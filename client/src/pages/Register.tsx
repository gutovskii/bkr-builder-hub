import { createRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { message, Form, Input, Button, Typography, Upload, type GetProp, type UploadProps, Avatar } from 'antd';
import { rootRoute } from "@/main";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/store/store";

export const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: Register,
})

export type RegisterValues = {
    nickname: string;
    email: string;
    password: string;
    avatarImg: File;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function Register() {
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState({});
    const [avatarBase64Url, setAvatarBase64Url] = useState<string>();
    const setUser = useStore(state => state.setUser);

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn(formData: FormData) {
            return authService.register(formData);
        },
        onSuccess(data) {
            setUser(data);
            navigate({ to: '/components' });
        },
        onError(error) {
            message.error(error.message);
        },
    });

    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        setAvatarLoading(true);
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handleChange: UploadProps['onChange'] = (info) => {
        if (!info) return;
        getBase64(info.file as FileType, (url) => {
            setAvatarLoading(false);
            setAvatarBase64Url(url);
            setAvatar(info.file);
        });
    };

    const onFinish = async (values: { nickname: string, email: string, password: string }) => {
        const formData = new FormData();

        formData.set("nickname", values.nickname);
        formData.set("email", values.email);
        formData.set("password", values.password);
        formData.set("avatarImg", avatar as any);

        mutation.mutate(formData);
    }

    return (
        <div className="flex flex-col md:flex-row justify-center w-full items-center h-[100vh] gap-10">
            <Typography.Title color="white">BUILDER HUB</Typography.Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="min-w-[90%] md:min-w-[50%] lg:min-w-[25%]"
            >
                <Form.Item
                    label="Нікнейм"
                    name="nickname"
                    rules={[{ required: true, message: 'Уведіть свій нікнейм!'}]}
                >
                    <Input placeholder="Уведіть нікнейм" />
                </Form.Item>

                <Form.Item
                    label="Пошта"
                    name="email"
                    rules={[{ required: true, message: 'Уведіть свою пошту!'}, { type: 'email' }]}
                >
                    <Input placeholder="Уведіть пошту" />
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: 'Уведіть свій пароль!'}]}
                >
                    <Input.Password placeholder="Уведіть пароль" />
                </Form.Item>

                <Form.Item
                    label="Аватарка"
                    name="avatarImg"
                >
                    <Upload
                        maxCount={1}
                        name="avatar"
                        listType="picture-circle"
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleChange}
                    >
                        {avatarBase64Url ? <Avatar src={avatarBase64Url} alt="avatar" style={{ width: '100%', height: '100%' }} /> : 
                        <button style={{ border: 0, background: 'none' }} type="button">
                            {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
                            <div style={{ marginTop: 8 }}>Завантажити</div>
                        </button>}
                    </Upload>
                    </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={mutation.isPending}>
                        Зареєструватись
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}