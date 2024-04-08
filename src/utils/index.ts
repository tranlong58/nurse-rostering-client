import axios from 'axios';

const backendUrl = 'http://localhost:3001';

const fetchData = async (endpoint: string) => {
    try {
        return await axios.get(`${backendUrl}${endpoint}`);
    } catch (error) {
        return error.response;
    }
}

export default fetchData;