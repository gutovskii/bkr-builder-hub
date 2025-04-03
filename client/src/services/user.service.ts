import axiosInstance from "@/axios"

export const userService = {
    async findOne(nickname: string) {
        return (await axiosInstance.get(`/users/${nickname}`)).data;
    }
}