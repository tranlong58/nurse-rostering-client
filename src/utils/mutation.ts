import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const mutate = async (endpoint: string, method: string, values?: any) => {
    const token = localStorage.getItem('token') ?? '';

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
