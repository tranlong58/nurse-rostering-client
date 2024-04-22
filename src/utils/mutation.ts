import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

let token = '';
if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') ?? '';
}

const mutate = async (endpoint: string, method: string, values?: any) => {
    try {
        if(method === 'post') {
            return await axios.post(`${apiUrl}${endpoint}`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }

        if(method === 'patch') {
            return await axios.patch(`${apiUrl}${endpoint}`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }

        if(method === 'delete') {
            return await axios.delete(`${apiUrl}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }

    } catch (error: any) {
        return error.response;
    }
}

export default mutate;
