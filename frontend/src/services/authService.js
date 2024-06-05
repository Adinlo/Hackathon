import axios from 'axios';
import URL from '../constants/urls'

class AuthService {
    /**
     * Logges in as user!
     * @param {String} email 
     * @param {String} password 
     */
    async login(email, password) {
        const data = JSON.stringify({
            Password: password,
            Email: email,
        });

        console.log(data);
        const response = await axios.post(URL.LOGIN, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userId", response.data.userId);
    };

    /**
     * Registers the user!
     * @param {String} name 
     * @param {String} lastName 
     * @param {String} email 
     * @param {String} password 
     */
    async register(name, lastName, email, password) {
        const data = JSON.stringify({
            Password: password,
            Email: email,
            Name: name,
            LastName: lastName,
        });

        const response = await axios.post(URL.REGISTER, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userId", response.data.userId);
    }

    /**
     * Verifies if the user is logged in
     * @returns True if the user is logged in!
     */
    async verifyLogin() {
        const token = sessionStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
    
        try {
            await axios.get(URL.ME, {
                headers: headers
            });
            return true
        } catch (err) {
            return false
        }
    }
}

export default AuthService;