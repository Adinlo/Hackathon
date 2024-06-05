import axios from 'axios';
import URL from '../constants/urls'


class UserService {
    /**
     * Gets the current logged in user.
     * @returns The response of the get request.
     */
    async getUser() {
        const response = await axios.get(URL.ME, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response;
    }
}

export default UserService;