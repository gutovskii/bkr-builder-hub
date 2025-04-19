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
            <div className="flex flex-col md:flex-row w-full">
                <div className="w-full md:w-1/4">
                    <div className="p-4 m-2 flex flex-col items-center justify-center rounded-2xl bg-indigo-200">
                        <div className="flex flex-col justify-center gap-2">
                            <div className="flex justify-center">
                                <Avatar size={80} src={query.data.avatarUrl} />
                            </div>
                            <div>
                                <p className="font-bold text-center text-2xl">{query.data.nickname}</p>
                            </div>
                            <div className="text-center">
                                {query.data.createdAt && <Typography.Text>Доєднався: {query.data.createdAt}</Typography.Text>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-3/4">
                    <div className="p-4 m-2 bg-gray-300 rounded-2xl">
                        <Typography.Title level={3} className="pb-2">Збірки користувача</Typography.Title>
                        <div className="w-full flex flex-wrap">
                            {query.data.createdBuilds.length ? query.data.createdBuilds.map((build: any) => (
                                <BuildItem data={build} />
                            )) : <div className="text-center">Користувач поки що не має збірок</div>}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
}