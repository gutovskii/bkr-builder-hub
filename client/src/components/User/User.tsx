import { userService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query"
import { Avatar, Spin, Typography } from "antd";
import BuildItem from "../Builds/BuildItem";

export default function User({ nickname }: { nickname: string }) {
    const query = useQuery({
        queryFn: () => {
            return userService.findOne(nickname);
        },
        queryKey: ['user', nickname],
        refetchOnWindowFocus: false,
    });

    return <div>
        {query.isPending && !query.data ? <Spin /> : (
            <>
                <div>
                    <div className="flex gap-2 items-center">
                        <Avatar src={query.data.avatarUrl} />
                        <Typography.Title level={3}>{query.data.nickname}</Typography.Title>
                    </div>
                    {query.data.createdAt && <Typography.Text>Доєднався: {query.data.createdAt}</Typography.Text>}
                </div>
                <div>
                    <Typography.Title level={4}>Збірки користувача</Typography.Title>
                    <div className="w-full flex flex-wrap">
                        {query.data.createdBuilds.map((build: any) => (
                            <BuildItem data={build} />
                        ))}
                    </div>
                </div>
            </>
        )}
    </div>
}