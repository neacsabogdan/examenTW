const SongDB=require('../models').Song;

const express = require("express");


const controller = {
    addSong: async (req,res) => {
        const song = {
            title: req.body.title,
            url: req.body.url,
            style: req.body.style,
            playlistId: req.body.playlistId
        }
        let err = false;
        let errArr=[];

        if(!err) {
            try {
                const newSong=await SongDB.create(song);
                res.status(200).send("Song added");
            }
            catch (error) {
                console.log('Error:',error);
                res.status(500).send("Error creating new song!");
            }
        }
        else {

            res.status(400).send({message:errArr})
        }
    },
    getAllSongs: async(req,res) => {
        try {
            let songs=await SongDB.findAll();
            res.status(200).send(songs);
        } catch(err){
            res.status(500).send({
                message: "Error selecting all songs!"
            })
        }
    },
    getOneSong: async(req, res) => {
        try{
            let songId = req.params['id'];
            const songs = await SongDB.findAll({ where : { playlistId: songId }});
            res.status(200).send(songs);
        } catch(err){
            res.status(500).send({
                message: "Error selecting song!"
            })
        }
    },

    updateSong: async(req, res) => {
        let songId=req.params['id'];
        const song=await SongDB.findOne({where:{id:songId}});
        song.update({
            title: req.body.title,
            url: req.body.url,
            style: req.body.style,
            playlistId: req.body.playlistId
        })
            .then(() => {
                res.status(200).send({message:"Edited songs"})
            })
            .catch(() => {
                res.status(500).send({message:"Error"})
            })
    },
    deleteSong : async(req,res) => {
        try{
            let songId = req.params['id'];
            const song = await SongDB.destroy({
                where: {
                    id: songId
                }
            })
            res.status(200).send({
                message: "Song " + songId + " deleted."
            });
        }catch(error){
            res.status(500).send({
                message: "Error deleting song!"
            })
        }
    }

}

module.exports = controller;