// Kachuful Multiplayer Room Engine for Live Cricket Zone

const rooms = new Map();

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

const ROUND_SEQUENCE = [1, 2, 3, 4, 5, 4, 3, 2, 1];

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

function dealRound(room) {
  const cardsCount = ROUND_SEQUENCE[room.currentRoundIdx] || 1;
  const deck = createDeck();
  room.hands = {};
  room.bids = {};
  room.tricksWon = {};
  room.currentTrick = [];
  room.leadSuit = null;
  room.phase = "bidding";
  room.trump = SUITS[room.currentRoundIdx % SUITS.length];
  room.cardsThisRound = cardsCount;

  room.players.forEach((p, idx) => {
    const hand = deck.slice(idx * cardsCount, (idx + 1) * cardsCount);
    hand.sort((a, b) => (a.suit === b.suit ? b.val - a.val : a.suit.localeCompare(b.suit)));
    room.hands[p.name] = hand;
    room.tricksWon[p.name] = 0;
  });

  room.turn = room.players[0].name;
  room.lastActivity = Date.now();
  room.message = `Round ${room.currentRoundIdx + 1} (${cardsCount} Cards) · Trump is ${room.trump.hindi} ${room.trump.symbol}. Place your bids!`;
}

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "KACH";
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Cleanup stale rooms older than 2 hours
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.lastActivity > 2 * 3600 * 1000) {
      rooms.delete(code);
    }
  }
}, 10 * 60 * 1000);

function createRoom(hostName = "Player 1") {
  const code = generateRoomCode();
  const room = {
    code,
    host: hostName,
    players: [{ name: hostName, isHost: true, isAi: false }],
    status: "lobby", // lobby | active | finished
    phase: "lobby", // lobby | bidding | playing | round_summary | game_over
    currentRoundIdx: 0,
    scores: { [hostName]: 0 },
    bids: {},
    tricksWon: {},
    hands: {},
    currentTrick: [],
    leadSuit: null,
    trump: SUITS[0],
    cardsThisRound: 1,
    turn: hostName,
    message: `Room created! Share code ${code} with friends to join.`,
    reactions: [],
    lastActivity: Date.now(),
  };
  rooms.set(code, room);
  return room;
}

function joinRoom(code, playerName) {
  const room = rooms.get(code.toUpperCase());
  if (!room) return { error: "Room not found. Check the code and try again." };
  if (room.status !== "lobby") return { error: "Match already in progress in this room." };
  if (room.players.length >= 4) return { error: "Room is already full (max 4 players)." };

  let finalName = playerName.trim() || `Player ${room.players.length + 1}`;
  if (room.players.some(p => p.name.toLowerCase() === finalName.toLowerCase())) {
    finalName = `${finalName} (${room.players.length + 1})`;
  }

  room.players.push({ name: finalName, isHost: false, isAi: false });
  room.scores[finalName] = 0;
  room.lastActivity = Date.now();
  room.message = `${finalName} joined the room! (${room.players.length}/4 Players)`;
  return { room, assignedName: finalName };
}

function startMatch(code, requesterName) {
  const room = rooms.get(code.toUpperCase());
  if (!room) return { error: "Room not found" };

  // Fill remaining slots with AI if fewer than 4 players
  const botNames = ["Rahul (Bot)", "Priya (Bot)", "Amit (Bot)"];
  let botIdx = 0;
  while (room.players.length < 4) {
    const name = botNames[botIdx++] || `Bot ${room.players.length + 1}`;
    room.players.push({ name, isHost: false, isAi: true });
    room.scores[name] = 0;
  }

  room.status = "active";
  room.currentRoundIdx = 0;
  dealRound(room);
  return { room };
}

function submitBid(code, playerName, bid) {
  const room = rooms.get(code.toUpperCase());
  if (!room || room.phase !== "bidding") return { error: "Invalid state for bidding" };

  room.bids[playerName] = parseInt(bid);
  room.lastActivity = Date.now();

  // Auto-submit bids for AI players
  room.players.forEach(p => {
    if (p.isAi && room.bids[p.name] === undefined) {
      const hand = room.hands[p.name] || [];
      let est = 0;
      hand.forEach(c => {
        if (c.suit === room.trump.name && c.val >= 10) est += 1;
        else if (c.val >= 13) est += 1;
      });
      room.bids[p.name] = Math.min(est, room.cardsThisRound);
    }
  });

  // If all players have bid
  if (Object.keys(room.bids).length === room.players.length) {
    room.phase = "playing";
    room.turn = room.players[0].name;
    room.message = `All bids placed! ${room.turn}'s turn to lead a card.`;
  } else {
    room.message = `${playerName} placed bid (${bid}). Waiting for other players...`;
  }

  return { room };
}

function playCard(code, playerName, cardId) {
  const room = rooms.get(code.toUpperCase());
  if (!room || room.phase !== "playing") return { error: "Invalid state for playing" };
  if (room.turn !== playerName) return { error: "It's not your turn!" };

  const playerHand = room.hands[playerName] || [];
  const card = playerHand.find(c => c.id === cardId);
  if (!card) return { error: "Card not in hand" };

  // Enforce follow suit rule
  if (room.leadSuit && card.suit !== room.leadSuit) {
    const hasLead = playerHand.some(c => c.suit === room.leadSuit);
    if (hasLead) return { error: `You must follow the lead suit: ${room.leadSuit}` };
  }

  // Remove card from player hand
  room.hands[playerName] = playerHand.filter(c => c.id !== cardId);
  if (!room.leadSuit) room.leadSuit = card.suit;
  room.currentTrick.push({ player: playerName, card });
  room.lastActivity = Date.now();

  // Determine next turn
  const currentIdx = room.players.findIndex(p => p.name === playerName);
  const nextPlayer = room.players[(currentIdx + 1) % room.players.length];
  room.turn = nextPlayer.name;

  // Process AI moves if next players are AI
  processAiCardPlays(room);

  return { room };
}

function processAiCardPlays(room) {
  if (room.phase !== "playing") return;

  while (room.currentTrick.length < 4) {
    const currentTurnPlayer = room.players.find(p => p.name === room.turn);
    if (!currentTurnPlayer || !currentTurnPlayer.isAi) break;

    const aiHand = room.hands[currentTurnPlayer.name] || [];
    if (aiHand.length === 0) break;

    // AI selects card
    const leadCards = aiHand.filter(c => c.suit === room.leadSuit);
    let chosenCard;
    if (leadCards.length > 0) {
      chosenCard = leadCards[0];
    } else {
      const trumps = aiHand.filter(c => c.suit === room.trump.name);
      chosenCard = trumps.length > 0 ? trumps[0] : aiHand[aiHand.length - 1];
    }

    room.hands[currentTurnPlayer.name] = aiHand.filter(c => c.id !== chosenCard.id);
    if (!room.leadSuit) room.leadSuit = chosenCard.suit;
    room.currentTrick.push({ player: currentTurnPlayer.name, card: chosenCard });

    const currentIdx = room.players.findIndex(p => p.name === currentTurnPlayer.name);
    const nextPlayer = room.players[(currentIdx + 1) % room.players.length];
    room.turn = nextPlayer.name;
  }

  // If 4 cards in trick, evaluate winner
  if (room.currentTrick.length === 4) {
    evaluateTrick(room);
  }
}

function evaluateTrick(room) {
  let winningPlay = room.currentTrick[0];
  const lead = room.leadSuit;
  const trump = room.trump.name;

  room.currentTrick.forEach(play => {
    const isTrump = play.card.suit === trump;
    const winIsTrump = winningPlay.card.suit === trump;

    if (isTrump && !winIsTrump) {
      winningPlay = play;
    } else if (isTrump && winIsTrump) {
      if (play.card.val > winningPlay.card.val) winningPlay = play;
    } else if (!isTrump && !winIsTrump && play.card.suit === lead) {
      if (play.card.val > winningPlay.card.val) winningPlay = play;
    }
  });

  const winner = winningPlay.player;
  room.tricksWon[winner] = (room.tricksWon[winner] || 0) + 1;
  room.message = `🎉 ${winner} won the trick with ${winningPlay.card.label} of ${winningPlay.card.suit}!`;
  room.turn = winner;

  // Check if hand is empty (round ended)
  const remainingHand = Object.values(room.hands)[0] || [];
  if (remainingHand.length === 0) {
    // Score round
    room.players.forEach(p => {
      const won = room.tricksWon[p.name] || 0;
      const bid = room.bids[p.name];
      if (won === bid) {
        room.scores[p.name] = (room.scores[p.name] || 0) + 10 + (bid * 10);
      }
    });
    room.phase = "round_summary";
  } else {
    room.currentTrick = [];
    room.leadSuit = null;
  }
}

function nextRound(code) {
  const room = rooms.get(code.toUpperCase());
  if (!room) return { error: "Room not found" };

  if (room.currentRoundIdx + 1 < ROUND_SEQUENCE.length) {
    room.currentRoundIdx += 1;
    dealRound(room);
  } else {
    room.phase = "game_over";
    room.status = "finished";
    room.message = "🏆 Kachuful Match Finished! Check final rankings below.";
  }
  return { room };
}

function addReaction(code, playerName, emoji) {
  const room = rooms.get(code.toUpperCase());
  if (!room) return { error: "Room not found" };

  room.reactions = [...(room.reactions || []).slice(-9), {
    player: playerName,
    emoji,
    time: Date.now()
  }];
  return { room };
}

function getSanitizedRoom(code, requesterName) {
  const room = rooms.get(code.toUpperCase());
  if (!room) return null;

  // Mask opponents' private hands so players can't cheat
  const sanitizedHands = {};
  Object.keys(room.hands).forEach(name => {
    if (name === requesterName) {
      sanitizedHands[name] = room.hands[name];
    } else {
      sanitizedHands[name] = (room.hands[name] || []).map(() => ({ hidden: true }));
    }
  });

  return {
    ...room,
    hands: sanitizedHands,
  };
}

module.exports = {
  createRoom,
  joinRoom,
  startMatch,
  submitBid,
  playCard,
  nextRound,
  addReaction,
  getSanitizedRoom
};
