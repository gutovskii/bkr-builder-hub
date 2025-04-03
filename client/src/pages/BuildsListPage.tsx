import BuildsFiltersSider from "@/components/Builds/BuildsFiltersSider";
import BuildsList from "@/components/Builds/BuildsList";
import LayoutHeader from "@/components/Layout/LayoutHeader";
import { rootRoute } from "@/main";
import { createRoute } from "@tanstack/react-router"
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { z } from 'zod';

const buildsSearchSchema = z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    name: z.string().optional(),
    filters: z.any().optional(),
});

export const buildsListPageRoute = createRoute({
    path: '/builds',
    getParentRoute: () => rootRoute,
    component: BuildsListPage,
    validateSearch: buildsSearchSchema,
});

export default function BuildsListPage() {
    return <div>
        <LayoutHeader />
        <Layout>
            <BuildsFiltersSider />
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 'calc(90vh)',
                }}
            >
                <BuildsList />
            </Content>
        </Layout>
    </div>
}