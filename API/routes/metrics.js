const express = require('express');

const router = express.Router();

const authorize = require('../middleware/authorize');
const checks = require('../middleware/checks')
const metricsController = require('../controllers/metrics');

// route to get one metric
router.get('/metric/:metricsId', authorize.jwtUserAuth, checks.metricCheck, authorize.userHasMetric, metricsController.getMetricDS);

// route to get one metric
router.get('/metrics/', authorize.jwtUserAuth, metricsController.getAllMetrics);

module.exports = router;
