import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { Form, Input, Button, Typography } from 'antd';
import { rootRoute } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useStore } from "@/store/store";

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
            navigate({ to: '/components/$componentType', params: {componentType: 'cpuComponent'} }); // todo
        },
    });

    const onFinish = async (values: LoginValues) => {
        mutation.mutate(values);
    }

    return (
        <div className="flex justify-center w-full items-center h-[100vh] gap-10">
            <Typography.Title color="white">BUILDER HUB</Typography.Title>
            <Form
                name="login"
                layout="vertical"
                onFinish={onFinish}
                className="min-w-[90%] md:min-w-[50%] lg:min-w-[25%]"
            >
                <Form.Item
                    label="Nickname"
                    name="nickname"
                    rules={[{ required: true, message: 'Please enter your nickname!'}]}
                >
                    <Input placeholder="Enter nickname" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!'}]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={mutation.isPending}>
                        Login
                    </Button>
                </Form.Item>

                <Typography.Text>
                    Do not have an account? <Link to="/register" className="text-blue-500">Register!</Link>
                </Typography.Text>
            </Form>
        </div>
    )
}