import ComponentsFiltersSider from "@/components/Components/ComponentsFiltersSider";
import ComponentsList from "@/components/Components/ComponentsList";
import LayoutHeader from "@/components/Layout/LayoutHeader";
import { rootRoute } from "@/main";
import { createRoute } from "@tanstack/react-router";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { z } from 'zod';

const componentsSearchSchema = z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    name: z.string().optional(),
    // filters: z.any().optional().default({coreCount: {maxValue:16, minValue: 8}, manufacturer: ['Intel', 'AMD']}),
    filters: z.any().optional(),
});

export const componentsListPageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/components/$componentType',
    component: ComponentsListPage,
    validateSearch: componentsSearchSchema,
});

export default function ComponentsListPage() {
    return <div>
        <LayoutHeader />
        <Layout>
            <ComponentsFiltersSider />
            <Layout>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 'calc(90vh)',
                    }}
                >
                    <ComponentsList />
                </Content>
            </Layout>
        </Layout>
    </div>
}