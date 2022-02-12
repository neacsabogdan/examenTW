const express = require('express')
const router = express.Router();
const otherRouter = require('./other')
const playlistRouter = require('./playlist');
const songRouter=require('./song');

if(process.env.NODE_ENV !== 'production') {
    router.use('/', otherRouter);
}
router.use('/', playlistRouter);
router.use('/',songRouter);

module.exports = router