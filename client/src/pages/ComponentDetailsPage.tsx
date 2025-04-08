import ComponentDetails from "@/components/Components/ComponentDetails";
import LayoutHeader from "@/components/Layout/LayoutHeader";
import { rootRoute } from "@/main";
import { createRoute } from "@tanstack/react-router";

export const componentDetailsRoute = createRoute({
    path: '/components/$componentType/$id',
    getParentRoute: () => rootRoute,
    component: ComponentDetailsPage,
});

export default function ComponentDetailsPage() {
    const params = componentDetailsRoute.useParams();

    return <div>
        <LayoutHeader />
        <ComponentDetails componentType={params.componentType} id={params.id} />
    </div>
}