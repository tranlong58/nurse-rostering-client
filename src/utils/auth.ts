import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const auth = async (values: {email: string, password: string}) => {
    try {
        return await axios.post(`${apiUrl}/auth/login`, values);
    } catch (error: any) {
        return error.response;
    }
}

export default auth;
