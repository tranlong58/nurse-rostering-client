import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchData = async (endpoint: string) => {
    try {
        return await axios.get(`${apiUrl}${endpoint}`);
    } catch (error: any) {
        return error.response;
    }
}

export default fetchData;