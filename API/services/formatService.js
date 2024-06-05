const db = require('../db/models');
const Brand = db.Brand;
const ModelBrand = db.ModelBrand;
const CarDetail = db.CarDetail;
const User = db.User;

class FormatService {
    /**
     * Format user details.
     * @param {object} user - User object to format.
     */
    async userFormat(user) {

        return {
            id: user.id,
            Name: user.Name,
            LastName: user.LastName,
            Email: user.Email,
            IsSeller: user.IsSeller,
            Role: user.Role,
            Address: user.Address,
            City: user.City,
            PostalCode: user.PostalCode
        };
    }

    async metricsFormat(metric) {
        return {
            id: metric.id,
            accuracy: metric.accuracy,
            metric: metric.metric,
            numberOfGenerations: metric.numberOfGenerations,
            fitness: metric.fitness,
            numberOfCorrectPredictions: metric.numberOfCorrectPredictions,
            bestGeneration: metric.bestGeneration,
            pathCsv: metric.pathCsv,
        }
    }
}

// Export an instance of the class
module.exports = new FormatService();
