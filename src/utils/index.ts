import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

let token = '';
if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') ?? '';
}

const fetchData = async (endpoint: string) => {
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