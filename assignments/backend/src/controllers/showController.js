const showModel = require('../models/showModel');
const seatModel = require('../models/seatModel');

module.exports = {
    getShows: async (req, res) => {
        try {
            const result = await showModel.getAllShows();
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load shows" });
        }
    },

    getSeats: async (req, res) => {
        try {
            const result = await seatModel.getSeatsByShow(req.params.id);
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load seats" });
        }
    },
    getAllSeats: async (req, res) => {
        try {
            const result = await seatModel.getAllSeats();
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load seats" });
        }
    },
};
