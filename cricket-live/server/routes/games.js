const express = require("express");
const router = express.Router();
const kachufulEngine = require("../../api/kachufulRooms");

// POST /api/games/kachuful/rooms (Create or Join)
router.post("/kachuful/rooms", (req, res) => {
  const { action, hostName, roomId, playerName } = req.body;
  if (action === "create") {
    const room = kachufulEngine.createRoom(hostName || "Host");
    return res.json({ status: "success", room });
  }
  if (action === "join") {
    const result = kachufulEngine.joinRoom(roomId, playerName);
    if (result.error) return res.status(400).json({ status: "error", message: result.error });
    return res.json({ status: "success", room: result.room, assignedName: result.assignedName });
  }
  return res.status(400).json({ error: "Invalid action" });
});

// GET /api/games/kachuful/rooms/:roomId
router.get("/kachuful/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const playerName = req.query.player || "Player";
  const room = kachufulEngine.getSanitizedRoom(roomId, playerName);
  if (!room) return res.status(404).json({ status: "error", message: "Room not found" });
  return res.json({ status: "success", room });
});

// POST /api/games/kachuful/rooms/:roomId/action
router.post("/kachuful/rooms/:roomId/action", (req, res) => {
  const { roomId } = req.params;
  const { action, playerName, bid, cardId, emoji } = req.body;

  let result;
  if (action === "start") {
    result = kachufulEngine.startMatch(roomId, playerName);
  } else if (action === "bid") {
    result = kachufulEngine.submitBid(roomId, playerName, bid);
  } else if (action === "play_card") {
    result = kachufulEngine.playCard(roomId, playerName, cardId);
  } else if (action === "next_round") {
    result = kachufulEngine.nextRound(roomId);
  } else if (action === "reaction") {
    result = kachufulEngine.addReaction(roomId, playerName, emoji);
  }

  if (result?.error) return res.status(400).json({ status: "error", message: result.error });
  const sanitized = kachufulEngine.getSanitizedRoom(roomId, playerName);
  return res.json({ status: "success", room: sanitized });
});

module.exports = router;
