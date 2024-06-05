import axios from 'axios';
import URL from '../constants/urls';

class MetricsService {
    /**
     * Gets the metrics data.
     * @param {string} metricId - The ID of the metric to fetch.
     * @returns The response of the get request.
     */
    async getMetric(metricId) {
        const token = sessionStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const response = await axios.get(`${URL.METRIC}${metricId}`, {
            headers: headers
        });
        return response.data;
    }
    /**
     * Get all user Metrics
     * @returns 
     */
    async getMetrics() {
        const token = sessionStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const response = await axios.get(URL.METRICS, {
            headers: headers
        });
        return response.data;
    }
}

export default MetricsService;
