import LayoutHeader from "@/components/Layout/LayoutHeader";
import { rootRoute } from "@/main";
import { createRoute } from "@tanstack/react-router";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

export const componentsRoute = createRoute({
    path: '/components',
    getParentRoute: () => rootRoute,
    component: ComponentsPage,
});

export default function ComponentsPage() {
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
                WIP
            </Content>
        </Layout>
    </div>
}