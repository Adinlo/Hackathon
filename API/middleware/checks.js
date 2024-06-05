const db = require('../db/models');
const User = db.User;
const Metrics = db.Metrics;

exports.metricCheck = async (req, res, next) => {
    const metric = await Metrics.findOne({where : {id: req.params.metricsId}});
    try {
        if (metric.length === 0) {
            return res.status(404).json({message: 'Metric not found!'});
        }
    } catch(err) {
        return res.status(404).json({message: 'Metric not found!'});
    }
    next();
}

exports.userCheck = async (req, res, next) => {
    const user = await User.findOne({where : {id: req.params.userId}});
    if (user.length === 0) {
        return res.status(404).json({ message: 'User not found!' });
    }
    next();
}
