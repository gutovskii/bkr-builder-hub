import { NO_IMAGE_SRC } from "@/common/consts";
import { buildService } from "@/services/build.service";
import { useStore } from "@/store/store";
import { CloseOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Avatar, Card, Image, message, Popconfirm, Tooltip, Typography } from "antd";

export default function BuildItem({ data, deleteBuild, unsaveBuild }: any) {
    const user = useStore(state => state.user);

    const { pathname } = useLocation();

    const saveBuildMutation = useMutation({
        mutationFn: (buildId: string) => {
            return buildService.saveBuild(buildId);
        },
        onSuccess() {
            message.success('Build saved successfully!');
        },
    });

    const saveBuild = (buildId: string) => {
        saveBuildMutation.mutate(buildId);
    }

    const getActions = (pathname: string): React.ReactNode[] => {
        if (pathname === '/builds') {
            return [<Tooltip title="Зберегти збірку">
                <SaveOutlined title="Зберегти збірку" key="saveBuild" onClick={() => saveBuild(data.id)} />
            </Tooltip>];
        } else if (pathname === '/builds/saved') {
            return [<Tooltip title="Прибрати зі збережених">
                <CloseOutlined title="Прибрати зі збережених" key="unsaveBuild" onClick={() => unsaveBuild(data.id)} />
            </Tooltip>];
        } else if (pathname === '/builds/created') {
            return [<Tooltip title="Видалити збірку">
                <Popconfirm
                    title="Видалити збірку"
                    description="Ви впевнені, що хочете видалити збірку?"
                    onConfirm={() => deleteBuild(data.id)}
                    okText="Так"
                    cancelText="Ні"
                >
                    <DeleteOutlined title="Видалити збірку" key="deleteBuild" />
                </Popconfirm>
            </Tooltip>];
        }
        return [];
    }

    return <div className="w-1/2 md:w-1/3 lg:w-1/5 flex flex-col pb-2" title={data.name}>
        <Card
            hoverable
            className="flex flex-col w-[95%] min-h-[200px]"
            cover={data.imgsUrls[0] ? <Image height={150} src={data.imgsUrls[0]} /> : <Image height={150} preview={false} src={NO_IMAGE_SRC} />}
            actions={user ? getActions(pathname) : []}
        >
            <Link to="/builds/$buildId" params={{ buildId: data.id }}>
                <Card.Meta
                    title={data.name}
                    avatar={<Avatar src={data.user.avatarUrl} />}
                    description={
                        <>
                            <div className="min-h-[25px]">
                                <div>
                                    Користувач: <Link to="/users/$nickname" params={{nickname: data.user.nickname}}>
                                        <Typography.Text>{data.user.nickname}</Typography.Text>
                                    </Link>
                                </div>
                                <div>
                                    Ціна: <Typography.Text>{data.price} ₴</Typography.Text>
                                </div>
                            </div>
                        </>
                    }
                />
            </Link>
        </Card>
    </div>
}