import CreateBuild from "@/components/Builds/CreateBuild";
import LayoutHeader from "@/components/Layout/LayoutHeader";
import { rootRoute } from "@/main";
import { createRoute } from "@tanstack/react-router"
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

export const createBuildRoute = createRoute({
    path: '/builds/create',
    getParentRoute: () => rootRoute,
    component: CreateBuildPage,
});

export default function CreateBuildPage() {
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
                <CreateBuild />
            </Content>
        </Layout>
    </div>
}