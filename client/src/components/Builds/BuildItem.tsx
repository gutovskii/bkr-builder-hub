import { NO_IMAGE_SRC } from "@/common/consts";
import { buildService } from "@/services/build.service";
import { useStore } from "@/store/store";
import { CloseOutlined, DeleteOutlined, SaveOutlined, UpOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Avatar, Card, Image, message, Popconfirm, Tooltip, Typography } from "antd";
import { useState } from "react";

export default function BuildItem({ data, deleteBuild, unsaveBuild }: any) {
    const user = useStore(state => state.user);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [likes, setLikes] = useState(data.likes);
    const [isLiked, setIsLiked] = useState(data.isLiked);

    const saveBuildMutation = useMutation({
        mutationFn: (buildId: string) => {
            return buildService.saveBuild(buildId);
        },
        onSuccess() {
            message.success('Збірка збережена!');
        },
    });

    const saveBuild = (buildId: string) => {
        saveBuildMutation.mutate(buildId);
    }

    const likeBuild = async (buildId: string) => {
        if (!user) return navigate({ to: '/login' });
        setLikes(likes + 1);
        setIsLiked(true);
        await buildService.likeBuild(buildId);
    }

    const unlikeBuild = async (buildId: string) => {
        if (!user) return navigate({ to: '/login' });
        setLikes(likes - 1);
        setIsLiked(false);
        await buildService.unlikeBuild(buildId);
    }

    const getStaticActions = (): React.ReactNode[] => {
        const actions: React.ReactNode[] = [];
        
        if (pathname === '/builds') {
            actions.push(<Tooltip title="Зберегти збірку">
                <SaveOutlined title="Зберегти збірку" key="saveBuild" onClick={() => saveBuild(data.id)} />
            </Tooltip>);
        } else if (pathname === '/builds/saved') {
            actions.push(<Tooltip title="Прибрати зі збережених">
                <CloseOutlined title="Прибрати зі збережених" key="unsaveBuild" onClick={() => unsaveBuild(data.id)} />
            </Tooltip>);
        } else if (pathname === '/builds/created') {
            actions.push(<Tooltip title="Видалити збірку">
                <Popconfirm
                    title="Видалити збірку"
                    description="Ви впевнені, що хочете видалити збірку?"
                    onConfirm={() => deleteBuild(data.id)}
                    okText="Так"
                    cancelText="Ні"
                >
                    <DeleteOutlined title="Видалити збірку" key="deleteBuild" />
                </Popconfirm>
            </Tooltip>);
        }
        
        return actions;
    }

    return <div className="w-1/2 md:w-1/3 lg:w-1/5 flex flex-col pb-2" title={data.name}>
        <Card
            hoverable
            className="flex flex-col w-[95%] min-h-[200px]"
            cover={data.imgsUrls[0] ? <div className="!flex justify-center"><Image height={150} src={data.imgsUrls[0]} /></div> : <Image height={150} preview={false} src={NO_IMAGE_SRC} />}
            actions={user ? [
                <Tooltip title={isLiked ? "Прибрати вподобайку" : "Вподобати"}>
                    <div 
                        className="flex justify-center items-center gap-1" 
                        onClick={() => isLiked ? unlikeBuild(data.id) : likeBuild(data.id)}
                    >
                        <UpOutlined 
                            key="likeBuild" 
                            className={isLiked ? "!text-blue-600" : "!text-gray-700"}
                            title={isLiked ? "Прибрати вподобайку" : "Вподобати"}
                        />
                        <div className={isLiked ? "!text-blue-600" : "!text-gray-700"}>{likes}</div>
                    </div>
                </Tooltip>,
                ...getStaticActions()] : []}
        >
            <Link to="/builds/$buildId" params={{ buildId: data.id }}>
                <Card.Meta
                    title={data.name}
                    avatar={<Avatar src={data.user.avatarUrl} />}
                    description={
                        <div className="min-h-[25px]">
                            <div>
                                {user ? <Link to="/users/$nickname" params={{nickname: data.user.nickname}} className="text-blue-500">
                                    {data.user.nickname}
                                </Link> : <Typography.Text>{data.user.nickname}</Typography.Text>}
                            </div>
                            <div>
                                <Typography.Text>{data.price} ₴</Typography.Text>
                            </div>
                        </div>
                    }
                />
            </Link>
        </Card>
    </div>
}