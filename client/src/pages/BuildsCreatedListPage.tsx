import { authRouteGuard } from "@/common/auth-route-guard";
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

export const buildsCreatedListPageRoute = createRoute({
    path: '/builds/created',
    getParentRoute: () => rootRoute,
    component: BuildsCreatedListPage,
    validateSearch: buildsSearchSchema,
    beforeLoad: () => authRouteGuard()
});

export default function BuildsCreatedListPage() {
    const search = buildsCreatedListPageRoute.useSearch();

    return <div>
        <LayoutHeader />
        <Layout>
            <BuildsFiltersSider searchFilters={search.filters} />
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 'calc(90vh)',
                }}
            >
                <BuildsList title="Створені збірки" findMethod="findAllCreated" search={search} />
            </Content>
        </Layout>
    </div>
}