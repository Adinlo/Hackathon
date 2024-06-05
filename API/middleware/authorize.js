const jwt = require('jsonwebtoken');
const db = require('../db/models');
const User = db.User;
const Metrics = db.Metrics;

async function getUserRoleCompany(userId) {
    const user = await User.findOne({ where: { id: userId } });
    return {role: user.Role, companyId: user.CompanyID};
}

exports.jwtUserAuth = async (req, res, next) => {
    try {
        // const token = req.cookies['token'];
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const { userId } = decodedToken;
        req.auth = {
            userId
        };
        next();
    } catch (error) {
        // 401 : unauthorized
        res.status(401).json({ error });
    }
};

exports.userHasMetric = async (req, res, next) => {
    const metric = await Metrics.findByPk(req.params.metricsId);
    console.log(metric.userId);
    console.log(req.auth.userId);
    if (metric.userId !== parseInt(req.auth.userId)) {
        return res.status(401).json({message: 'Not authorized'});
    }
    next();
}
