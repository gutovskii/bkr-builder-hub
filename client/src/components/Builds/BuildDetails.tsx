import { buildDetailsPageRoute } from "@/pages/BuildDetailsPage";
import { buildService } from "@/services/build.service";
import { useStore } from "@/store/store";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query"
import { Avatar, Button, Carousel, Form, Image, List, Rate, Spin, Tooltip, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import BuildComponentsTable from "./BuildComponentsTable";

type CreateCommentValues = {
    text: string;
    rating: number;
}

export default function BuildDetails() {
    const params = buildDetailsPageRoute.useParams();
    const [newComments, setNewComments] = useState<any[]>([]);
    const [allComments, setAllComments] = useState<any[]>([]);
    
    const user = useStore(state => state.user);
    const [createCommentForm] = Form.useForm();
    
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
            setNewComments(prev => [...prev, {...newComment, user}]);
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

    useEffect(() => {
        if (newComments && findBuildQuery.data?.buildComments) {
            setAllComments([...newComments, ...findBuildQuery.data.buildComments]);
        } 
    }, [newComments, findBuildQuery.data]);

    return <div>
        {findBuildQuery.isPending ? <Spin /> : <div>
            <div>
                <Typography.Title>{findBuildQuery.data.name}</Typography.Title>
            </div>
            <div>
                Рейтинг: <Rate defaultValue={findBuildQuery.data.rating} disabled />
            </div>
            <div>
                <Typography.Text>Ціна: {findBuildQuery.data.price} ₴</Typography.Text>
            </div>
            <div>
                <Typography.Text>
                    <div>
                        Користувач: <Avatar src={findBuildQuery.data.user.avatarUrl}/> {findBuildQuery.data.user.nickname}
                    </div>
                </Typography.Text>
            </div>
            {findBuildQuery.data.description && <div>
                <Typography.Text>
                    {findBuildQuery.data.description}
                </Typography.Text>
            </div>}
            <div className="flex w-full">
                <div className="w-1/3 max-h-[500px] pr-5">
                    <Carousel arrows>
                        {findBuildQuery.data.imgsUrls.map((imgUrl: string) => (
                            <div>
                                <Image height={350} src={imgUrl} preview={false} />
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="w-1/3">
                    <BuildComponentsTable components={[{ imgUrl: findBuildQuery.data.cpu.imgUrls[0], ...findBuildQuery.data.cpu.marketplacesComponents[0] }]} componentName="Процесор" componentType="CpuComponent" />
                    <BuildComponentsTable components={[{ imgUrl: findBuildQuery.data.motherBoard.imgUrls[0], ...findBuildQuery.data.motherBoard.marketplacesComponents[0] }]} componentName="Материнська плата" componentType="MotherboardComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.ssds.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="SSD-диски" componentType="SsdComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.hdds.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Жорсткі диски" componentType="HddComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.videoCards.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Відеокарти" componentType="VideoCardComponents" />
                    <BuildComponentsTable components={findBuildQuery.data.memories.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Оперативна пам'ять" componentType="MemoryComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.coolers.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Кулери" componentType="CoolerComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.cases.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Кейси" componentType="CaseComponent" />
                    <BuildComponentsTable components={findBuildQuery.data.powerSupplies.map((c: any) => ({ imgUrl: c.imgUrls[0], ...c.marketplacesComponents[0] }))} componentName="Батареї" componentType="PowerSupplyComponent" />
                </div>
                <div className="w-1/3">
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
                            >
                                <TextArea maxLength={10000} cols={5} rows={1} placeholder="Додати коментар" />
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
                                    <List.Item className="max-w-[400px]" actions={comment.user.id === user?.id ? [
                                        <Tooltip title="Видалити коментар"><DeleteOutlined onClick={() => deleteComment(comment.id)} /></Tooltip>
                                    ] : []}>
                                        <List.Item.Meta 
                                            title={comment.user.nickname}
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
        </div>}
    </div>
}