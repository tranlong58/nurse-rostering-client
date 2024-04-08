import axios from 'axios';

const backendUrl = 'http://localhost:3001';

const mutate = async (endpoint: string, method: string, values?) => {
    try {
        if(method === 'post') {
            return await axios.post(`${backendUrl}${endpoint}`, values);
        }

        if(method === 'patch') {
            return await axios.patch(`${backendUrl}${endpoint}`, values);
        }

        if(method === 'delete') {
            return await axios.delete(`${backendUrl}${endpoint}`);
        }

    } catch (error) {
        return error.response;
    }
}

export default mutate;