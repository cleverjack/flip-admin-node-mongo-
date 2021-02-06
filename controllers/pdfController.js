const Pdf = require('../models/pdf')
const Audio = require('../models/audio')
const Video = require('../models/video')
const fs = require('fs');

const pdfController = {
    index: async (req, res) => {
        try {
            const pdfs = await Pdf.find({});
            res.status(201).json(pdfs)
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    },
    upload: async (req, res) => {
        try {
            if (req.file) {
                let pdf = new Pdf();
    
                pdf.name = req.file.originalname;
                pdf.url = req.file.filename;
                pdf.size = req.file.size;
                pdf.mimetype = req.file.mimetype;
    
                await pdf.save();
    
                res.status(201).json(pdf);
            }
            res.status(400).json({message: "upload failed"});
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    },

    getAudio: async (req, res) => {
        try {
            let audio = await Audio.findOne({});

            res.status(201).json(audio);
        } catch (e) {
            res.status(400).json({ message: err.message })
        }
    },

    uploadAudio: async (req, res) => {
        try {
            if (req.file) {
                let audio = await Audio.findOne({});

                if (!audio) {
                    audio = new Audio();
                }
    
                audio.name = req.file.originalname;
                audio.url = req.file.filename;
                audio.size = req.file.size;
                audio.mimetype = req.file.mimetype;
    
                await audio.save();
    
                res.status(201).json(audio);
            }
            res.status(400).json({message: "upload failed"});
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    },

    getVideos: async (req, res) => {
        try {
            let videos = await Video.find({});

            return res.status(201).json(videos);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    },

    uploadVideo: async (req, res) => {
        try {
            if (req.file) {
                let video = new Video();
    
                video.name = req.file.originalname;
                video.url = req.file.filename;
                video.size = req.file.size;
                video.mimetype = req.file.mimetype;
    
                await video.save();
    
                res.status(201).json(video);
            }
            res.status(400).json({message: "upload failed"});
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    },

    deletePdf: async (req, res) => {
        try {
            let id = req.params.id;

            let pdf = await Pdf.findById(id);
            if (pdf == null) {
                return res.status(404).json({ message: 'Cant find pdf'})
            }
            
            let filePath = './uploads/' + pdf.url; 
            fs.unlinkSync(filePath);

            pdf.remove();

            res.status(201).json({message: "successfully removed"});
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    },

    deleteVideo: async (req, res) => {
        try {
            let id = req.params.id;

            let video = await Video.findById(id);
            if (video == null) {
                return res.status(404).json({ message: 'Cant find video'})
            }
            
            let filePath = './uploads/videos/' + video.url; 
            fs.unlinkSync(filePath);

            video.remove();

            res.status(201).json({message: "successfully removed"});
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }
}

module.exports = pdfController;