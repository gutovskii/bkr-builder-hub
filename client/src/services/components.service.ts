import axiosInstance from "@/axios"

export type ComponentFilterResponse = {
    id: string;
    componentType: string;
    filters: {
        title: string;
        maxValue?: number;
        minValue?: number;
        characteristics?: string[];
    }[]
}

export const componentsService = {
    async findComponents({
        componentType,
        name,
        page,
        pageSize,
        filters,
    }: any) {
        return (await axiosInstance.get('/components', {
            params: {
                componentType,
                name,
                page,
                pageSize,
                filters,
            }
        })).data;
    },
    async findOne(componentType: string, id: string) {
        return (await axiosInstance.get(`/components/${componentType}/${id}`)).data;
    },
    async findFilters({
        componentType
    }: any) {
        return (await axiosInstance.get<ComponentFilterResponse>(`/filters/components/${componentType}`)).data;
    }
}