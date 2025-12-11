const showService = require('../services/showService');

module.exports = {
    createShow: async (req, res) => {
        try {
            const { name, start_time, total_seats } = req.body;
            if (!name || !start_time || !total_seats)
                return res.status(400).json({ error: 'Missing fields' });

            const id = await showService.createShow(name, start_time, total_seats);
            res.json({ id });
        } catch (err) {
            res.status(500).json({ error: 'internal' });
        }
    }
};
