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
    async findAllCreated({
        name,
        page,
        pageSize,
        filters
    }: any) {
        return (await axiosInstance.get('/builds/created', {
            params: { name, page, pageSize, filters },
        })).data;
    },
    async findAllSaved({
        name,
        page,
        pageSize,
        filters
    }: any) {
        return (await axiosInstance.get('/builds/saved', {
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
    },
    async saveBuild(buildId: string) {
        return (await axiosInstance.post('/builds/save', { buildId })).data;
    },
    async unsaveBuild(buildId: string) {
        return (await axiosInstance.post('/builds/unsave', { buildId })).data;
    },
    async likeBuild(buildId: string) {
        return (await axiosInstance.put('/builds/like', { buildId })).data;
    },
    async unlikeBuild(buildId: string) {
        return (await axiosInstance.put('/builds/unlike', { buildId })).data;
    },
};