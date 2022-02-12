const PlaylistDB=require('../models').Playlist;

const express = require("express");


const controller = {
    addPlaylist: async (req, res) => {
        const playlist = {
            description: req.body.description,
            date: req.body.date
        }
        let err=false;
        let errArr=[];

        if(!err) {
            try {
                const newPlaylist=await PlaylistDB.create(playlist);
                res.status(200).send("Playlist added");
            }
            catch (error) {
                console.log('Error:',error);
                res.status(500).send("Error creating new playlist!");
            }
        }
        else {
            res.status(400).send({message:errArr})

        }
    },
    getAllPlaylists: async(req, res) => {
        try {
            let playlists=await PlaylistDB.findAll();
            res.status(200).send(playlists);
        } catch(err){
            res.status(500).send({
                message: "Error selecting all playlists!"
            })
        }
    },
    getOnePlaylist: async(req, res) => {
        try{
            let playlistId = req.params['id'];
            const playlist = await PlaylistDB.findOne({ where : { id: playlistId }});
            res.status(200).send(playlist);
        } catch(err){
            res.status(500).send({
                message: "Error selecting playlist!"
            })
        }
    },

    updatePlaylist: async(req, res) => {
        let playlistId=req.params['id'];
        const playlist=await PlaylistDB.findOne({where:{id:playlistId}});
        playlist.update({
            description: req.body.description,
            date: req.body.date
        })
            .then(() => {
                res.status(200).send({message:"Edited playlist"})
            })
            .catch(() => {
                res.status(500).send({message:"Error"})
            })
    },
    deletePlaylist : async(req, res) => {
        try{
            let playlistId = req.params['id'];
            const playlist = await PlaylistDB.destroy({
                where: {
                    id: playlistId
                }
            })
            res.status(200).send({
                message: "playlist " + playlist + " deleted."
            });
        }catch(error){
            console.log("Error:",error);
            res.status(500).send({
                message: "Error deleting playlist!"
            })
        }
    }
}

module.exports = controller;