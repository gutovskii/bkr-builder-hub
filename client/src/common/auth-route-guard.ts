import { router } from "@/main";
import { authService } from "@/services/auth.service";

export const authRouteGuard = async () => {
    try {
        await authService.findUserByToken();
    } catch (e: unknown) {
        router.navigate({ to: '/login' });
    }
}