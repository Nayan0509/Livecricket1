import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { playCardFlipSound, playCorrectSound, playWinFanfare } from "../../utils/gameAudio";
import { createKachufulRoom, joinKachufulRoom, fetchKachufulRoom, sendKachufulAction } from "../../api";

const SUITS = [
  { name: "Spades", symbol: "♠", color: "#60a5fa", hindi: "Ka (Kadi)" },
  { name: "Diamonds", symbol: "♦", color: "#f87171", hindi: "Chu (Chukat)" },
  { name: "Clubs", symbol: "♣", color: "#34d399", hindi: "Fu (Fuli)" },
  { name: "Hearts", symbol: "♥", color: "#f43f5e", hindi: "L (Lal)" },
];

const CARD_RANKS = [
  { label: "2", val: 2 }, { label: "3", val: 3 }, { label: "4", val: 4 },
  { label: "5", val: 5 }, { label: "6", val: 6 }, { label: "7", val: 7 },
  { label: "8", val: 8 }, { label: "9", val: 9 }, { label: "10", val: 10 },
  { label: "J", val: 11 }, { label: "Q", val: 12 }, { label: "K", val: 13 }, { label: "A", val: 14 }
];

const ROUND_CARDS = [1, 2, 3, 4, 5, 4, 3, 2, 1];
const SOLO_PLAYERS = ["You", "Rahul (AI)", "Priya (AI)", "Amit (AI)"];

function createDeck() {
  const deck = [];
  SUITS.forEach(suit => {
    CARD_RANKS.forEach(rank => {
      deck.push({
        id: `${rank.label}-${suit.symbol}`,
        suit: suit.name,
        symbol: suit.symbol,
        color: suit.color,
        label: rank.label,
        val: rank.val
      });
    });
  });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function KachufulGame() {
  const [searchParams] = useSearchParams();
  const initialRoomCode = searchParams.get("room") || "";

  const [mode, setMode] = useState(initialRoomCode ? "multiplayer" : "solo"); // solo | multiplayer
  const [mpView, setMpView] = useState(initialRoomCode ? "join" : "menu"); // menu | create | join | lobby | playing
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("lcz_player_name") || "");
  const [roomState, setRoomState] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Solo State
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [phase, setPhase] = useState("bidding"); // bidding | playing | round_summary | game_over
  const [scores, setScores] = useState({ You: 0, "Rahul (AI)": 0, "Priya (AI)": 0, "Amit (AI)": 0 });
  const [bids, setBids] = useState({ You: 0, "Rahul (AI)": 0, "Priya (AI)": 0, "Amit (AI)": 0 });
  const [tricksWon, setTricksWon] = useState({ You: 0, "Rahul (AI)": 0, "Priya (AI)": 0, "Amit (AI)": 0 });
  const [playerHands, setPlayerHands] = useState({ You: [], "Rahul (AI)": [], "Priya (AI)": [], "Amit (AI)": [] });
  const [currentTrick, setCurrentTrick] = useState([]);
  const [turn, setTurn] = useState("You");
  const [leadSuit, setLeadSuit] = useState(null);
  const [message, setMessage] = useState("Predict how many hands (tricks) you will win this round!");
  const [selectedBid, setSelectedBid] = useState(0);

  const pollIntervalRef = useRef(null);

  const totalCardsThisRound = ROUND_CARDS[currentRoundIdx] || 1;
  const currentTrump = SUITS[currentRoundIdx % SUITS.length];

  // ─── SOLO GAMEPLAY METHODS ──────────────────────────────────────────────────
  const dealNewSoloRound = (roundIdx) => {
    const deck = createDeck();
    const cardsCount = ROUND_CARDS[roundIdx];
    const newHands = {
      You: deck.slice(0, cardsCount),
      "Rahul (AI)": deck.slice(cardsCount, cardsCount * 2),
      "Priya (AI)": deck.slice(cardsCount * 2, cardsCount * 3),
      "Amit (AI)": deck.slice(cardsCount * 3, cardsCount * 4),
    };
    newHands.You.sort((a, b) => (a.suit === b.suit ? b.val - a.val : a.suit.localeCompare(b.suit)));
    setPlayerHands(newHands);
    setTricksWon({ You: 0, "Rahul (AI)": 0, "Priya (AI)": 0, "Amit (AI)": 0 });
    setCurrentTrick([]);
    setLeadSuit(null);
    setPhase("bidding");
    setSelectedBid(0);
    setMessage(`Round ${roundIdx + 1}: ${cardsCount} Card${cardsCount > 1 ? "s" : ""} · Trump is ${SUITS[roundIdx % SUITS.length].hindi} ${SUITS[roundIdx % SUITS.length].symbol}`);
    playCardFlipSound();
  };

  useEffect(() => {
    if (mode === "solo") {
      dealNewSoloRound(0);
    }
  }, [mode]);

  const submitSoloBid = () => {
    playCorrectSound();
    const calcAiBid = (hand) => {
      let estimated = 0;
      hand.forEach(c => {
        if (c.suit === currentTrump.name && c.val >= 10) estimated += 1;
        else if (c.val >= 13) estimated += 1;
      });
      return Math.min(estimated, totalCardsThisRound);
    };

    const newBids = {
      You: selectedBid,
      "Rahul (AI)": calcAiBid(playerHands["Rahul (AI)"]),
      "Priya (AI)": calcAiBid(playerHands["Priya (AI)"]),
      "Amit (AI)": calcAiBid(playerHands["Amit (AI)"]),
    };

    setBids(newBids);
    setPhase("playing");
    setTurn("You");
    setMessage(`Bids placed! You bid ${selectedBid}. Lead your card to begin!`);
  };

  const handleSoloPlayCard = (card) => {
    if (phase !== "playing" || turn !== "You") return;
    if (leadSuit && card.suit !== leadSuit) {
      const hasLeadSuit = playerHands.You.some(c => c.suit === leadSuit);
      if (hasLeadSuit) {
        setMessage(`⚠️ You must follow the lead suit: ${leadSuit}!`);
        return;
      }
    }
    playCardFlipSound();
    const updatedHand = playerHands.You.filter(c => c.id !== card.id);
    setPlayerHands(prev => ({ ...prev, You: updatedHand }));
    const updatedTrick = [...currentTrick, { player: "You", card }];
    setCurrentTrick(updatedTrick);
    if (!leadSuit) setLeadSuit(card.suit);
    runSoloAiTurns(updatedTrick, card.suit || leadSuit, updatedHand);
  };

  const runSoloAiTurns = (trickSoFar, currentLead, youRemainingHand) => {
    let trick = [...trickSoFar];
    const aiPlayers = ["Rahul (AI)", "Priya (AI)", "Amit (AI)"];
    let delay = 600;
    aiPlayers.forEach((aiName) => {
      setTimeout(() => {
        setPlayerHands(prev => {
          const aiHand = [...prev[aiName]];
          if (aiHand.length === 0) return prev;
          const leadCards = aiHand.filter(c => c.suit === currentLead);
          let chosenCard;
          if (leadCards.length > 0) chosenCard = leadCards[0];
          else {
            const trumps = aiHand.filter(c => c.suit === currentTrump.name);
            chosenCard = trumps.length > 0 ? trumps[0] : aiHand[aiHand.length - 1];
          }
          const remainingAiHand = aiHand.filter(c => c.id !== chosenCard.id);
          trick.push({ player: aiName, card: chosenCard });
          setCurrentTrick([...trick]);
          playCardFlipSound();
          if (trick.length === 4) {
            setTimeout(() => evaluateSoloTrickWinner(trick, currentLead, youRemainingHand), 1000);
          }
          return { ...prev, [aiName]: remainingAiHand };
        });
      }, delay);
      delay += 600;
    });
  };

  const evaluateSoloTrickWinner = (trick, trickLeadSuit, youRemainingHand) => {
    let winningPlay = trick[0];
    trick.forEach(play => {
      const isTrump = play.card.suit === currentTrump.name;
      const winIsTrump = winningPlay.card.suit === currentTrump.name;
      if (isTrump && !winIsTrump) winningPlay = play;
      else if (isTrump && winIsTrump) {
        if (play.card.val > winningPlay.card.val) winningPlay = play;
      } else if (!isTrump && !winIsTrump && play.card.suit === trickLeadSuit) {
        if (play.card.val > winningPlay.card.val) winningPlay = play;
      }
    });

    const winner = winningPlay.player;
    setTricksWon(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
    setMessage(`🎉 ${winner} won the trick with ${winningPlay.card.label} of ${winningPlay.card.suit}!`);

    setTimeout(() => {
      setCurrentTrick([]);
      setLeadSuit(null);
      if (youRemainingHand.length === 0) {
        setPhase("round_summary");
        playCorrectSound();
        setScores(prev => {
          const newScores = { ...prev };
          SOLO_PLAYERS.forEach(p => {
            const won = tricksWon[p];
            const bid = bids[p];
            if (won === bid) newScores[p] += 10 + (bid * 10);
          });
          return newScores;
        });
      } else {
        setTurn(winner);
        setMessage(`${winner}'s turn to lead the next trick!`);
      }
    }, 1400);
  };

  // ─── MULTIPLAYER ROOM METHODS ───────────────────────────────────────────────
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setErrorMsg("Please enter your name to create a room.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    localStorage.setItem("lcz_player_name", playerName.trim());
    try {
      const res = await createKachufulRoom(playerName.trim());
      if (res?.room) {
        setRoomCode(res.room.code);
        setRoomState(res.room);
        setMpView("lobby");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to create room.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e?.preventDefault();
    if (!roomCode.trim() || !playerName.trim()) {
      setErrorMsg("Please enter both Room Code and your name.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    localStorage.setItem("lcz_player_name", playerName.trim());
    try {
      const res = await joinKachufulRoom(roomCode.trim().toUpperCase(), playerName.trim());
      if (res?.room) {
        setRoomCode(res.room.code);
        setPlayerName(res.assignedName || playerName.trim());
        setRoomState(res.room);
        setMpView(res.room.status === "active" ? "playing" : "lobby");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to join room.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartMpMatch = async () => {
    if (!roomCode) return;
    setIsLoading(true);
    try {
      const res = await sendKachufulAction(roomCode, playerName, { action: "start" });
      if (res?.room) {
        setRoomState(res.room);
        setMpView("playing");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMpBid = async () => {
    if (!roomCode) return;
    try {
      const res = await sendKachufulAction(roomCode, playerName, { action: "bid", bid: selectedBid });
      if (res?.room) setRoomState(res.room);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  const handlePlayMpCard = async (card) => {
    if (!roomCode) return;
    try {
      const res = await sendKachufulAction(roomCode, playerName, { action: "play_card", cardId: card.id });
      if (res?.room) setRoomState(res.room);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  const handleNextMpRound = async () => {
    if (!roomCode) return;
    try {
      const res = await sendKachufulAction(roomCode, playerName, { action: "next_round" });
      if (res?.room) setRoomState(res.room);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  const handleSendReaction = async (emoji) => {
    if (!roomCode) return;
    try {
      await sendKachufulAction(roomCode, playerName, { action: "reaction", emoji });
    } catch (_) {}
  };

  // Poll room state in multiplayer mode
  useEffect(() => {
    if (mode !== "multiplayer" || !roomCode || (mpView !== "lobby" && mpView !== "playing")) return;

    const poll = async () => {
      try {
        const res = await fetchKachufulRoom(roomCode, playerName);
        if (res?.room) {
          setRoomState(res.room);
          if (res.room.status === "active" && mpView === "lobby") {
            setMpView("playing");
          }
        }
      } catch (_) {}
    };

    poll();
    pollIntervalRef.current = setInterval(poll, 1200);
    return () => clearInterval(pollIntervalRef.current);
  }, [mode, roomCode, playerName, mpView]);

  const inviteLink = `${window.location.origin}/games?game=kachuful&room=${roomCode}`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const shareOnWhatsApp = () => {
    const text = `🃏 Hey! Join my Kachuful card game room on Live Cricket Zone! 🏆\n\nRoom Code: *${roomCode}*\nTap to play instantly:\n${inviteLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 16px" }}>
      {/* Mode Switcher Banner */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "12px 18px",
        marginBottom: 20
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setMode("solo")}
            style={{
              padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: "pointer",
              background: mode === "solo" ? "linear-gradient(135deg, #00F0FF, #00B8D9)" : "rgba(255,255,255,0.03)",
              border: "none", color: mode === "solo" ? "#000" : "var(--text3)",
            }}
          >
            🤖 Play vs AI (Solo)
          </button>
          <button
            onClick={() => { setMode("multiplayer"); setMpView("menu"); }}
            style={{
              padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: "pointer",
              background: mode === "multiplayer" ? "linear-gradient(135deg, #D896FF, #B026FF)" : "rgba(255,255,255,0.03)",
              border: "none", color: mode === "multiplayer" ? "#fff" : "var(--text3)",
            }}
          >
            👥 Play with Friends (Create Room)
          </button>
        </div>

        <span style={{ fontSize: 11, fontWeight: 800, color: mode === "multiplayer" ? "#D896FF" : "#00F0FF" }}>
          {mode === "multiplayer" ? "🌐 MULTIPLAYER ROOM ACTIVE" : "⚡ SINGLE PLAYER MODE"}
        </span>
      </div>

      {errorMsg && (
        <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", borderRadius: 12, padding: "12px 16px", color: "#ef4444", fontSize: 13, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>
          {errorMsg}
        </div>
      )}

      {/* ── MULTIPLAYER ROOM MENU / CREATE / JOIN ── */}
      {mode === "multiplayer" && mpView === "menu" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          {/* Create Room Card */}
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(216,150,255,0.3)", borderRadius: 18, padding: "24px" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>👑</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>Create Private Room</h3>
            <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6, margin: "0 0 16px" }}>
              Host a new Kachuful room and get an invite code to share with friends.
            </p>
            <input
              type="text"
              placeholder="Enter Your Name"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 13, outline: "none", marginBottom: 14 }}
            />
            <button
              onClick={handleCreateRoom}
              disabled={isLoading}
              style={{ width: "100%", padding: "12px", borderRadius: 12, background: "linear-gradient(135deg, #D896FF, #B026FF)", border: "none", color: "#fff", fontWeight: 900, fontSize: 14, cursor: "pointer", boxShadow: "0 0 16px rgba(216,150,255,0.35)" }}
            >
              {isLoading ? "Creating..." : "Create Room & Invite Friends →"}
            </button>
          </div>

          {/* Join Room Card */}
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(0,240,255,0.3)", borderRadius: 18, padding: "24px" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🚪</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>Join Friend's Room</h3>
            <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6, margin: "0 0 16px" }}>
              Enter the 6-character room code shared by your friend.
            </p>
            <input
              type="text"
              placeholder="Room Code (e.g. KACH88)"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase())}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", color: "#00F0FF", fontWeight: 900, fontSize: 14, outline: "none", marginBottom: 10, textTransform: "uppercase" }}
            />
            <input
              type="text"
              placeholder="Your Name"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 13, outline: "none", marginBottom: 14 }}
            />
            <button
              onClick={handleJoinRoom}
              disabled={isLoading}
              style={{ width: "100%", padding: "12px", borderRadius: 12, background: "linear-gradient(135deg, #00F0FF, #00B8D9)", border: "none", color: "#000", fontWeight: 900, fontSize: 14, cursor: "pointer", boxShadow: "0 0 16px rgba(0,240,255,0.3)" }}
            >
              {isLoading ? "Joining..." : "Join Room →"}
            </button>
          </div>
        </div>
      )}

      {/* ── MULTIPLAYER LOBBY ROOM ── */}
      {mode === "multiplayer" && mpView === "lobby" && roomState && (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(216,150,255,0.3)", borderRadius: 20, padding: "28px", marginBottom: 24, textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#D896FF", background: "rgba(216,150,255,0.15)", padding: "3px 12px", borderRadius: 20 }}>
            LOBBY WAITING ROOM
          </span>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "10px 0 4px" }}>
            Room Code: <span style={{ color: "#00F0FF", letterSpacing: 2 }}>{roomState.code}</span>
          </h2>
          <p style={{ fontSize: 13, color: "var(--text3)", margin: "0 0 20px" }}>
            Invite friends to join this link or enter code <strong>{roomState.code}</strong>.
          </p>

          {/* Share buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
            <button
              onClick={copyInviteLink}
              style={{ padding: "10px 18px", borderRadius: 10, background: "rgba(0,240,255,0.15)", border: "1px solid #00F0FF", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}
            >
              {copySuccess ? "✅ Link Copied!" : "📋 Copy Invite Link"}
            </button>
            <button
              onClick={shareOnWhatsApp}
              style={{ padding: "10px 18px", borderRadius: 10, background: "#25D366", border: "none", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <span>💬</span> Share on WhatsApp
            </button>
          </div>

          {/* Joined Players List */}
          <div style={{ maxWidth: 420, margin: "0 auto 28px", textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", textTransform: "uppercase", marginBottom: 10 }}>
              Joined Players ({roomState.players?.length}/4):
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {roomState.players?.map((p, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontWeight: 800, color: "#fff" }}>
                    {idx + 1}. {p.name} {p.isHost && "👑 (Host)"} {p.name === playerName && " (You)"}
                  </span>
                  <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>● Ready</span>
                </div>
              ))}
            </div>
          </div>

          {/* Start button (Host only) */}
          {roomState.host === playerName ? (
            <button
              onClick={handleStartMpMatch}
              disabled={isLoading}
              style={{ padding: "14px 36px", borderRadius: 14, background: "linear-gradient(135deg, #00F0FF, #00B8D9)", border: "none", color: "#000", fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 0 20px rgba(0,240,255,0.35)" }}
            >
              {isLoading ? "Starting..." : roomState.players.length < 4 ? `Start Game (Fill rest with AI Bots) 🚀` : `Start 4-Player Match 🚀`}
            </button>
          ) : (
            <div style={{ fontSize: 13, color: "var(--text3)", fontStyle: "italic" }}>
              Waiting for host ({roomState.host}) to start the match...
            </div>
          )}
        </div>
      )}

      {/* ── ACTIVE GAMEPLAY ARENA (SOLO OR MULTIPLAYER) ── */}
      {((mode === "solo") || (mode === "multiplayer" && mpView === "playing" && roomState)) && (
        <div>
          {/* Header Info */}
          <div style={{
            background: "linear-gradient(135deg, rgba(13,20,38,0.95), rgba(30,20,50,0.95))",
            border: "1px solid rgba(216,150,255,0.3)",
            borderRadius: 18,
            padding: "16px 22px",
            marginBottom: 20,
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12
          }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#D896FF", background: "rgba(216,150,255,0.15)", padding: "3px 10px", borderRadius: 20 }}>
                {mode === "multiplayer" ? `ROOM: ${roomCode}` : "SOLO VS AI"}
              </span>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "6px 0 0" }}>
                Round {(mode === "multiplayer" ? (roomState.currentRoundIdx + 1) : (currentRoundIdx + 1))} of {ROUND_CARDS.length} · <span style={{ color: "#00F0FF" }}>{mode === "multiplayer" ? roomState.cardsThisRound : totalCardsThisRound} Cards</span>
              </h2>
            </div>

            {/* Trump Badge */}
            {(() => {
              const trumpObj = mode === "multiplayer" ? roomState.trump : currentTrump;
              return (
                <div style={{ padding: "8px 16px", borderRadius: 12, background: "rgba(0,0,0,0.4)", border: `1px solid ${trumpObj?.color || "#fff"}`, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 22, color: trumpObj?.color }}>{trumpObj?.symbol}</span>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 800 }}>TRUMP (HUKAM)</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: trumpObj?.color }}>{trumpObj?.hindi}</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 4-Player Green Felt Arena */}
          <div style={{
            position: "relative",
            minHeight: 330,
            borderRadius: 20,
            background: "radial-gradient(ellipse at center, #1b4332 0%, #081c15 100%)",
            border: "3px solid #2d6a4f",
            boxShadow: "inset 0 0 50px rgba(0,0,0,0.8)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginBottom: 20,
          }}>
            {/* Top 3 Opponents */}
            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 10 }}>
              {(mode === "multiplayer"
                ? roomState.players.filter(p => p.name !== playerName)
                : ["Rahul (AI)", "Priya (AI)", "Amit (AI)"].map(name => ({ name }))
              ).map((p, idx) => {
                const pName = p.name;
                const pBid = mode === "multiplayer" ? roomState.bids[pName] : bids[pName];
                const pWon = mode === "multiplayer" ? roomState.tricksWon[pName] : tricksWon[pName];
                return (
                  <div key={idx} style={{ textAlign: "center", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 14px" }}>
                    <div style={{ fontSize: 18 }}>{p.isAi || mode === "solo" ? "🤖" : "🧑"}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{pName}</div>
                    <div style={{ fontSize: 11, color: "#D896FF" }}>
                      Bid: {pBid !== undefined ? pBid : "?"} | Won: {pWon || 0}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center Trick Arena */}
            <div style={{
              alignSelf: "center",
              minHeight: 120,
              minWidth: 260,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 16,
              border: "1px dashed rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "12px",
              flexWrap: "wrap",
            }}>
              {(mode === "multiplayer" ? roomState.currentTrick : currentTrick).length === 0 ? (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
                  Played cards will appear here
                </div>
              ) : (
                (mode === "multiplayer" ? roomState.currentTrick : currentTrick).map((t, idx) => (
                  <div key={idx} style={{ textAlign: "center", animation: "popIn 0.3s ease-out" }}>
                    <div style={{
                      width: 50,
                      height: 72,
                      borderRadius: 8,
                      background: "#fff",
                      color: t.card.suit === "Hearts" || t.card.suit === "Diamonds" ? "#dc2626" : "#1e293b",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "4px 6px",
                      fontWeight: 900,
                      fontSize: 14,
                      boxShadow: "0 6px 14px rgba(0,0,0,0.5)",
                    }}>
                      <div>{t.card.label}</div>
                      <div style={{ fontSize: 18, alignSelf: "center" }}>{t.card.symbol}</div>
                      <div style={{ fontSize: 10, alignSelf: "flex-end" }}>{t.card.label}</div>
                    </div>
                    <div style={{ fontSize: 10, color: "#fff", fontWeight: 700, marginTop: 4 }}>{t.player.split(" ")[0]}</div>
                  </div>
                ))
              )}
            </div>

            {/* Player Status at Bottom */}
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <div style={{ display: "inline-block", background: "rgba(0,0,0,0.6)", border: "1px solid #00F0FF", borderRadius: 12, padding: "6px 16px" }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: "#00F0FF" }}>{mode === "multiplayer" ? playerName : "YOU"}</span>
                <span style={{ fontSize: 12, color: "#fff", marginLeft: 10 }}>
                  Bid: <strong style={{ color: "#FFD700" }}>{mode === "multiplayer" ? (roomState.bids[playerName] !== undefined ? roomState.bids[playerName] : "?") : bids.You}</strong> | Won: <strong style={{ color: "#22c55e" }}>{mode === "multiplayer" ? (roomState.tricksWon[playerName] || 0) : tricksWon.You}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Reaction Bar (Multiplayer) */}
          {mode === "multiplayer" && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              {["👏", "🔥", "👑", "😂", "🎯", "😱"].map(em => (
                <button
                  key={em}
                  onClick={() => handleSendReaction(em)}
                  style={{ fontSize: 20, padding: "6px 12px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
                >
                  {em}
                </button>
              ))}
            </div>
          )}

          {/* Status Message */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "12px 18px",
            fontSize: 13,
            color: "var(--text2)",
            marginBottom: 20,
            textAlign: "center"
          }}>
            {mode === "multiplayer" ? roomState.message : message}
          </div>

          {/* Bidding Controls */}
          {((mode === "solo" && phase === "bidding") || (mode === "multiplayer" && roomState.phase === "bidding" && roomState.bids[playerName] === undefined)) && (
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: "#fff", margin: "0 0 12px" }}>
                Predict your winning hands for this round:
              </h3>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {Array.from({ length: (mode === "multiplayer" ? roomState.cardsThisRound : totalCardsThisRound) + 1 }).map((_, n) => (
                  <button
                    key={n}
                    onClick={() => setSelectedBid(n)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      fontSize: 16,
                      fontWeight: 900,
                      cursor: "pointer",
                      background: selectedBid === n ? "linear-gradient(135deg, #00F0FF, #00B8D9)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${selectedBid === n ? "#00F0FF" : "rgba(255,255,255,0.1)"}`,
                      color: selectedBid === n ? "#000" : "#fff",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                onClick={mode === "multiplayer" ? handleSendMpBid : submitSoloBid}
                style={{ padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg, #00F0FF, #00B8D9)", border: "none", color: "#000", fontWeight: 900, fontSize: 14, cursor: "pointer", boxShadow: "0 0 16px rgba(0,240,255,0.35)" }}
              >
                Confirm Bid ({selectedBid}) →
              </button>
            </div>
          )}

          {/* Cards in Hand (Play Mode) */}
          {((mode === "solo" && phase === "playing") || (mode === "multiplayer" && roomState.phase === "playing")) && (
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>
                {mode === "multiplayer" && roomState.turn !== playerName ? `⏳ Waiting for ${roomState.turn} to play...` : "Tap a card from your hand to play:"}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {(mode === "multiplayer" ? (roomState.hands[playerName] || []) : playerHands.You).map(c => (
                  <button
                    key={c.id}
                    onClick={() => (mode === "multiplayer" ? handlePlayMpCard(c) : handleSoloPlayCard(c))}
                    disabled={mode === "multiplayer" && roomState.turn !== playerName}
                    style={{
                      width: 60,
                      height: 88,
                      borderRadius: 10,
                      background: "#fff",
                      color: c.suit === "Hearts" || c.suit === "Diamonds" ? "#dc2626" : "#1e293b",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "6px 8px",
                      fontWeight: 900,
                      fontSize: 16,
                      cursor: "pointer",
                      border: c.suit === (mode === "multiplayer" ? roomState.trump?.name : currentTrump?.name) ? "3px solid #00F0FF" : "1px solid #cbd5e1",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                      opacity: mode === "multiplayer" && roomState.turn !== playerName ? 0.6 : 1,
                    }}
                  >
                    <div>{c.label}</div>
                    <div style={{ fontSize: 22, alignSelf: "center" }}>{c.symbol}</div>
                    <div style={{ fontSize: 11, alignSelf: "flex-end" }}>{c.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Round Summary */}
          {((mode === "solo" && phase === "round_summary") || (mode === "multiplayer" && roomState.phase === "round_summary")) && (
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px", textAlign: "center" }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#00F0FF", margin: "0 0 14px" }}>
                Round Results
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 }}>
                {(mode === "multiplayer" ? roomState.players : SOLO_PLAYERS.map(name => ({ name }))).map(p => {
                  const pName = p.name;
                  const won = mode === "multiplayer" ? roomState.tricksWon[pName] : tricksWon[pName];
                  const bid = mode === "multiplayer" ? roomState.bids[pName] : bids[pName];
                  const success = won === bid;
                  return (
                    <div key={pName} style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${success ? "#22c55e" : "#ef4444"}`, borderRadius: 12, padding: "12px" }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: "#fff" }}>{pName}</div>
                      <div style={{ fontSize: 12, color: "var(--text3)", margin: "4px 0" }}>Bid: {bid} | Won: {won}</div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: success ? "#22c55e" : "#ef4444" }}>
                        {success ? `+${10 + bid * 10} Pts` : "0 Pts"}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={mode === "multiplayer" ? handleNextMpRound : () => dealNewSoloRound(currentRoundIdx + 1)}
                style={{ padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg, #00F0FF, #00B8D9)", border: "none", color: "#000", fontWeight: 900, fontSize: 15, cursor: "pointer" }}
              >
                Next Round →
              </button>
            </div>
          )}

          {/* Game Over Leaderboard */}
          {((mode === "solo" && phase === "game_over") || (mode === "multiplayer" && roomState.phase === "game_over")) && (
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px", textAlign: "center" }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>👑</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#FFD700", margin: "0 0 16px" }}>
                Kachuful Match Complete!
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 360, margin: "0 auto 24px" }}>
                {Object.entries(mode === "multiplayer" ? roomState.scores : scores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([p, scoreVal], idx) => (
                    <div key={p} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderRadius: 10, background: idx === 0 ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.03)", border: idx === 0 ? "1px solid #FFD700" : "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontWeight: 800, color: "#fff" }}>{idx + 1}. {p}</span>
                      <span style={{ fontWeight: 900, color: idx === 0 ? "#FFD700" : "#00F0FF" }}>{scoreVal} Points</span>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => { if (mode === "multiplayer") setMpView("menu"); else dealNewSoloRound(0); }}
                style={{ padding: "14px 32px", borderRadius: 14, background: "linear-gradient(135deg, #00F0FF, #00B8D9)", border: "none", color: "#000", fontWeight: 900, fontSize: 16, cursor: "pointer" }}
              >
                Play New Match 🔄
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
