import axiosInstance from "@/axios";
import { router } from "@/main";
import type { LoginValues } from "@/pages/Login";
import type { UserPayload } from "@/types";
import { jwtDecode } from "jwt-decode";

type AuthResponse = {
    accessToken: string;
}

export const authService = {
    async login({ nickname, password }: LoginValues) {
        const response = await axiosInstance.post<AuthResponse>("/auth/login", {
            nickname,
            password,
        });

        localStorage.setItem("token", response.data.accessToken);

        const decoded = jwtDecode<UserPayload>(response.data.accessToken);
        
        return decoded;
    },
    async register(formData: FormData) {
        const response = await axiosInstance.post<AuthResponse>("/auth/register", formData);

        localStorage.setItem("token", response.data.accessToken);

        const decoded = jwtDecode<UserPayload>(response.data.accessToken);

        return decoded;
    },
    async logout() {
        localStorage.removeItem("token");
        router.navigate({ reloadDocument: true });
    },
    async findUserByToken() {
        return (await axiosInstance.get("/auth/user")).data;
    }
}