import { buildDetailsPageRoute } from "@/pages/BuildDetailsPage";
import { buildService } from "@/services/build.service";
import { useStore } from "@/store/store";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query"
import { Avatar, Button, Carousel, Form, Image, List, message, Popconfirm, Rate, Spin, Tooltip, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import BuildComponentsTable from "./BuildComponentsTable";
import { Link } from "@tanstack/react-router";

type CreateCommentValues = {
    text: string;
    rating: number;
}

export default function BuildDetails() {
    const params = buildDetailsPageRoute.useParams();
    const user = useStore(state => state.user);
    const [createCommentForm] = Form.useForm();

    const [allComments, setAllComments] = useState<any[]>([]);
    
    const findBuildQuery = useQuery({
        queryFn: () => {
            return buildService.findOne(params.buildId);
        },
        queryKey: ['build-details', params.buildId],
        refetchOnWindowFocus: false,
    });
    
    const createCommentMutation = useMutation({
        mutationFn: ({ text, rating }: any) => {
            return buildService.createComment({ 
                text, 
                rating, 
                buildId: params.buildId, 
                userId: user?.id
            });
        },
        mutationKey: [
            'create-comment', 
            createCommentForm.getFieldValue('name'), 
            createCommentForm.getFieldValue('rating'), 
            params.buildId, 
            user?.id
        ],
        onSuccess(newComment) {
            setAllComments(prev => [{...newComment, user}, ...prev]);
        },
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: string) => {
            return buildService.deleteComment(commentId);
        },
        mutationKey: ['delete-comment'],
        onSuccess(deletedComment: any) {
            setAllComments(prev => prev.filter(p => p.id !== deletedComment.id))
        }
    });

    const createComment = async (values: CreateCommentValues) => {
        createCommentMutation.mutate(values);
    }

    const deleteComment = async (commentId: string) => {
        deleteCommentMutation.mutate(commentId);
    }

    const saveBuildMutation = useMutation({
        mutationFn: (buildId: string) => {
            return buildService.saveBuild(buildId);
        },
        mutationKey: ['save-build'],
        onSuccess() {
            message.success('Збірка збережена!');
        },
    });

    const saveBuild = (buildId: string) => {
        saveBuildMutation.mutate(buildId);
    }

    useEffect(() => {
        if (findBuildQuery.data?.buildComments) {
            setAllComments([...findBuildQuery.data.buildComments]);
        } 
    }, [findBuildQuery.data]);

    return findBuildQuery.isPending ? <Spin className="w-full flex justify-center items-center" /> : 
        <div className="flex flex-col md:flex-row w-full">
            <div className="w-full md:w-1/3">
               <div className="flex flex-col gap-4">
                    <div>
                        <Typography.Title>{findBuildQuery.data.name}</Typography.Title>
                    </div>
                    <div className="flex gap-1 items-center">
                        <Avatar src={findBuildQuery.data.user.avatarUrl}/> 
                        <div>
                            {user ? <Link 
                                to="/users/$nickname" 
                                params={{ nickname: findBuildQuery.data.user.nickname }}
                            >{findBuildQuery.data.user.nickname}</Link> : findBuildQuery.data.user.nickname}
                        </div>
                    </div>
                    <div>
                        <span className="mr-2 p-1 text-2xl font-bold rounded-xl">
                            <span className="p-1 bg-blue-300 rounded-xl">{findBuildQuery.data.price}</span> ₴</span>
                        <Rate defaultValue={findBuildQuery.data.rating} disabled />
                    </div>
                    {user && <div>
                        <Button onClick={() => saveBuild(findBuildQuery.data.id)} icon={<SaveOutlined />}>Зберегти збірку</Button>
                    </div>}
               </div>
                
                <div className="max-h-[500px] pr-5">
                    <Carousel arrows>
                        {findBuildQuery.data.imgsUrls.map((imgUrl: string) => (
                            <div>
                                <Image height={350} src={imgUrl} preview={false} />
                            </div>
                        ))}
                    </Carousel>
                </div>
                {findBuildQuery.data.description && <div>
                    <Typography.Text>
                        {findBuildQuery.data.description}
                    </Typography.Text>
                </div>}
            </div>
            <div className="w-full md:w-2/3">
                <div className="flex flex-col">
                    <BuildComponentsTable components={[{ imgUrl: findBuildQuery.data.cpu.imgUrls[0], ...findBuildQuery.data.cpu.marketplacesComponents[0] }]} componentName="Процесор" componentType="CpuComponent" />
                    <BuildComponentsTable components={[{ imgUrl: findBuildQuery.data.motherBoard.imgUrls[0], ...findBuildQuery.data.motherBoard.marketplacesComponents[0] }]} componentName="Материнська плата" componentType="MotherboardComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.ssds.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="SSD-диски" componentType="SsdComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.hdds.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Жорсткі диски" componentType="HddComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.videoCards.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Відеокарти" componentType="VideoCardComponents" />
                    <BuildComponentsTable components={findBuildQuery.data.memories.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Оперативна пам'ять" componentType="MemoryComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.coolers.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Кулери" componentType="CoolerComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.powerSupplies.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Джерела живлення" componentType="PowerSupplyComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.cases.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Кейси" componentType="CaseComponent" />
                </div>
                <div>
                    <Typography.Title level={3}>Коментарі</Typography.Title>
                    {user && <div>
                        <Form
                            form={createCommentForm}
                            onFinish={createComment}
                            layout="horizontal"
                        >
                            <Form.Item
                                name="text"
                                rules={[{max: 10000, message: 'Максимальна довжина коментаря 10000 символів'}, {required: true, message: 'Текст коментаря обов\'язковий'}]}
                                className="w-auto md:w-[550px]"
                            >
                                <TextArea maxLength={10000} cols={5} rows={2} placeholder="Додати коментар" />
                            </Form.Item>

                            <Form.Item
                                name="rating"
                            >
                                <Rate allowHalf />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    htmlType="submit"
                                    loading={createCommentMutation.isPending}
                                >Додати коментар</Button>
                            </Form.Item>
                        </Form>
                    </div>}
                    {findBuildQuery.data.buildComments.length ?
                        <List
                            dataSource={allComments}
                            renderItem={
                                comment => (
                                    <List.Item className="w-full md:w-[800px]" actions={comment.user.id === user?.id ? [
                                        <Popconfirm title="Ви впевнені, що хочете видалити коментар?" onConfirm={() => deleteComment(comment.id)}>
                                            <Tooltip title="Видалити коментар">
                                                <DeleteOutlined />
                                            </Tooltip>
                                        </Popconfirm>
                                    ] : []}>
                                        <List.Item.Meta 
                                            title={user ? 
                                                <Link 
                                                    to="/users/$nickname"
                                                    params={{ nickname: comment.user.nickname }}
                                                    className="text-blue-500"
                                                >
                                                    {comment.user.nickname}
                                                </Link> :
                                                comment.user.nickname
                                            }
                                            avatar={<Avatar src={comment.user.avatarUrl} />}
                                            description={comment.text}
                                        />
                                        {comment.rating && <Rate defaultValue={comment.rating} disabled />}
                                    </List.Item>
                                )
                            }
                        >
                        </List> : null
                    }
                </div>
            </div>
        </div>
}