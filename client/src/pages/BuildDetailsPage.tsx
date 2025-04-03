import BuildDetails from "@/components/Builds/BuildDetails";
import LayoutHeader from "@/components/Layout/LayoutHeader";
import { rootRoute } from "@/main";
import { createRoute } from "@tanstack/react-router";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

export const buildDetailsPageRoute = createRoute({
    path: '/builds/$buildId',
    getParentRoute: () => rootRoute,
    component: BuildDetailsPage,
});

export default function BuildDetailsPage() {
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
                <BuildDetails />
            </Content>
        </Layout>
    </div>
}