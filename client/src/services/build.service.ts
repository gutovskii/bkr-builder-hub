import axiosInstance from "@/axios";

export const buildService = {
    async findAll({
        name,
        page,
        pageSize,
        filters
    }: any) {
        return (await axiosInstance.get('/builds', {
            params: { name, page, pageSize, filters },
        })).data;
    },
    async findOne(id: string) {
        return (await axiosInstance.get(`/builds/${id}`)).data;
    },
    async delete(id: string) {
        return (await axiosInstance.delete(`/builds/${id}`)).data;
    },
    async createBuild(data: FormData) {
        return (await axiosInstance.post('/builds', data)).data;
    },
    async findFilters() {
        return (await axiosInstance.get('/filters/builds')).data;
    },
    async createComment(values: any) {
        return (await axiosInstance.post('/comments', values)).data;
    },
    async deleteComment(commentId: string) {
        return (await axiosInstance.delete(`/comments/${commentId}`)).data;
    }
};