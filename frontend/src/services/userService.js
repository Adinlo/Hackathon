import axios from 'axios';
import URL from '../constants/urls'


class UserService {
    /**
     * Gets the current logged in user.
     * @returns The response of the get request.
     */
    async getUser() {
        const response = await axios.post(URL.ME, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response;
    }
}

export default UserService;