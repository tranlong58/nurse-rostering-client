import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchData = async (endpoint: string) => {
    const token = localStorage.getItem('token') ?? '';

    try {
        return await axios.get(`${apiUrl}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error: any) {
        return error.response;
    }
}

export default fetchData;