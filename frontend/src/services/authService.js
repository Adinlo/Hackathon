import axios from 'axios';

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
        const response = await axios.post('http://192.168.247.142:3001/login', data, {
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

        const response = await axios.post('http://192.168.247.142:3001/register', data, {
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
            await axios.get('http://192.168.247.142:3001/me', {
                headers: headers
            });
            return true
        } catch (err) {
            return false
        }
    }
}

export default AuthService;