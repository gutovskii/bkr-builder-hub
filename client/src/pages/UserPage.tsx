import { authRouteGuard } from "@/common/auth-route-guard";
import LayoutHeader from "@/components/Layout/LayoutHeader";
import User from "@/components/User/User";
import { rootRoute } from "@/main";
import { createRoute } from "@tanstack/react-router";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

export const userPageRoute = createRoute({
    path: '/users/$nickname',
    getParentRoute: () => rootRoute,
    component: UserPage,
    beforeLoad: () => authRouteGuard()
});

export default function UserPage() {
    const params = userPageRoute.useParams();

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
                <User nickname={params.nickname} />
            </Content>
        </Layout>
    </div>
}