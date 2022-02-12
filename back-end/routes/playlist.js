const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist");

router.post('/playlist',playlistController.addPlaylist);
router.get('/playlist',playlistController.getAllPlaylists);
router.get('/playlist/:id',playlistController.getOnePlaylist);
router.put('/playlist/:id',playlistController.updatePlaylist);
router.delete('/playlist/:id',playlistController.deletePlaylist);

module.exports = router;