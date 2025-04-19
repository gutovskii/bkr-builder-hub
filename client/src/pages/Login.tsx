import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { Form, Input, Button, Typography, message } from 'antd';
import { rootRoute } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useStore } from "@/store/store";
import type { AxiosError } from 'axios';
import type { NestError } from "@/types";

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: Login,
})

export type LoginValues = {
    nickname: string;
    password: string;
}

export default function Login() {
    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);

    const mutation = useMutation({
        mutationFn: ({ nickname, password }: LoginValues) => {
            return authService.login({nickname, password})
        },
        onSuccess(data) {
            setUser(data);
            navigate({ to: '/components' });
        },
        onError(error: AxiosError<NestError>) {
            message.error(error.response?.data.message, 3);
        },
    });

    const onFinish = async (values: LoginValues) => {
        mutation.mutate(values);
    }

    return (
        <div className="flex flex-col md:flex-row justify-center w-full items-center h-[100vh] gap-10">
            <Typography.Title color="white">BUILDER HUB</Typography.Title>
            <Form
                name="login"
                layout="vertical"
                onFinish={onFinish}
                className="min-w-[90%] md:min-w-[50%] lg:min-w-[25%]"
            >
                <Form.Item
                    label="Нікнейм"
                    name="nickname"
                    rules={[{ required: true, message: 'Уведіть свій нікнейм'}]}
                >
                    <Input placeholder="Уведіть нікнейм" />
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: 'Уведіть свій пароль!'}]}
                >
                    <Input.Password placeholder="Уведіть пароль" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={mutation.isPending}>
                        Увійти
                    </Button>
                </Form.Item>

                <Typography.Text>
                    Не маєте облікового запису? <Link to="/register" className="text-blue-500">Зареєструйтесь!</Link>
                </Typography.Text>
            </Form>
        </div>
    )
}