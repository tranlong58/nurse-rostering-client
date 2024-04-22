'use client'

import auth from "@/utils/auth";
import {Button, Form, Input, notification} from "antd";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [form] = Form.useForm(); 

    const handleLogin = async () => {
        const dataSubmit = form.getFieldsValue()
        const response = await auth(dataSubmit);

        if (response.status === 201) {
            notification.success({message: 'Login successful'});
            localStorage.setItem('token', response.data.data.token)
            localStorage.setItem('user', response.data.data.email)
            router.push('/');
        }

        if(response.status === 400) {
            notification.error({message: response.data.message})
        }
    }

    return (
        <>
          <div className='p-4 bg-[#eff0f4] min-h-full items-center justify-center flex'>
            <div className='flex flex-col items-center justify-center w-[500px] h-[500px] bg-white rounded-3xl'>
                <div className='mb-14 text-3xl font-bold'>Login to admin page</div>
                <Form form={form} layout="vertical" className='w-[300px]'>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the email' }]}>
                        <Input size='large'/>
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input the password' }]}>
                        <Input.Password size='large'/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" size='large' className="w-full" onClick={handleLogin}>Login</Button>
                    </Form.Item>
                </Form>
            </div>
          </div>
        </>
    );
  }
  