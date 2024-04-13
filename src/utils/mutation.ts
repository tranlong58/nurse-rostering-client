import axios from 'axios';
import { AxiosError } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const mutate = async (endpoint: string, method: string, values?: any) => {
    try {
        if(method === 'post') {
            return await axios.post(`${apiUrl}${endpoint}`, values);
        }

        if(method === 'patch') {
            return await axios.patch(`${apiUrl}${endpoint}`, values);
        }

        if(method === 'delete') {
            return await axios.delete(`${apiUrl}${endpoint}`);
        }

    } catch (error: any) {
        return error.response;
    }
}

export default mutate;
