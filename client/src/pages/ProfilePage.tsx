import LayoutHeader from "@/components/Layout/LayoutHeader";
import Profile from "@/components/Profile/Profile";
import { rootRoute, router } from "@/main";
import { authService } from "@/services/auth.service";
import { createRoute } from "@tanstack/react-router";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

export const profileRoute = createRoute({
    path: '/profile',
    getParentRoute: () => rootRoute,
    component: ProfilePage,
    async beforeLoad() {
        try {
            await authService.findUserByToken();
        } catch (e: unknown) {
            router.navigate({ to: '/components' });
        }
    },
});

export default function ProfilePage() {
    return <div>
        <LayoutHeader />
        <Layout>
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 'calc(90vh)',
                }}
            >
                <Profile />
            </Content>
        </Layout>
    </div>
}