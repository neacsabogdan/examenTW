const express = require("express");
const router = express.Router();
const songController = require("../controllers/song");

router.post('/song/',songController.addSong);
router.get('/song',songController.getAllSongs);
router.get('/song/:id',songController.getOneSong);
router.put('/song/:id',songController.updateSong);
router.delete('/song/:id',songController.deleteSong);

module.exports = router;