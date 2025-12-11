const showModel = require('../models/showModel');
const seatModel = require('../models/seatModel');

module.exports = {
    getShows: async (req, res) => {
        const result = await showModel.getAllShows();
        res.json(result.rows);
    },

    getSeats: async (req, res) => {
        const result = await seatModel.getSeatsByShow(req.params.id);
        res.json(result.rows);
    }
};
