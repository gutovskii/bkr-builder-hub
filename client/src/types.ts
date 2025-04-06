export type UserPayload = {
    id: string;
    nickname: string;
    email: string;
    isAdmin: boolean;
    avatarUrl: string;
}

export type NestError = {
    message: string;
    error: string;
    statusCode: number;
}