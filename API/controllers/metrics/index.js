const db = require('../../db/models');
const User = db.User;
const Metrics = db.Metrics;
const formatService = require('../../services/formatService');

class metricsController {
    constructor() {}
    /**
    * Get data for the current user
    */
    async getMetricDS(req, res) {
        try {
            const metric = await Metrics.findByPk(req.params.metricsId);
            res.status(200).json(await formatService.metricsFormat(metric));
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    async getAllMetrics(req, res) {
        try {
            await Metrics.findAll({ where: { userid: req.auth.userId } })
            .then(async metrics => {
                const formatedMetrics = await Promise.all(metrics.map(met => formatService.metricsFormat(met)))
                res.status(200).json(formatedMetrics);
            });
        } catch (error) {
            res.status(500).json({ error });
        }
    }
}

module.exports = new metricsController();
