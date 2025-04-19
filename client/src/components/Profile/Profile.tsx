import { useStore } from "@/store/store";
import { Avatar, Typography } from "antd";

export default function Profile() {
    const user = useStore(state => state.user);

    return <div className="flex flex-col justify-center gap-1">
        <Avatar size={100} src={user?.avatarUrl} />
        <div>
            <Typography.Title level={3}>{user?.nickname}</Typography.Title>
        </div>
        <div>
            <Typography.Text>Email: {user?.email}</Typography.Text>
        </div>
        {user?.isAdmin && <Typography.Text>You are the admin!</Typography.Text>}
    </div>;
}