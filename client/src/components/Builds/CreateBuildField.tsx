import { router } from "@/main";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Button, Image, Space, Table, Tooltip, Typography } from "antd";
import { useState } from "react";

type CreateBuildFieldProps = {
    componentType: string;
    componentName: string;
    components: any[];
    onBuildChange: () => void;
}

export default function CreateBuildField({ componentType, componentName, components, onBuildChange }: CreateBuildFieldProps) {
    const [buildComponents, setBuildComponents] = useState<any[]>(components);
    
    const removeFromBuild = (name: string) => {
        const build = JSON.parse(localStorage.getItem('build')!);

        if (Array.isArray(build[componentType])) {
            build[componentType] = build[componentType].filter(c => c.name !== name);
        } else {
            delete build[componentType];
        }

        localStorage.setItem('build', JSON.stringify(build));
        setBuildComponents(prev => prev.filter(c => c.name !== name));
        onBuildChange();
    };
    
    return <div>
        <div>
            <div className="flex gap-2 items-center">
                <Typography.Title level={4}>{componentName}</Typography.Title>
                <Button onClick={() => router.navigate({ to: '/components/$componentType', params: { componentType } })}>Додати до збірки</Button>
            </div>
            {buildComponents && <Table 
                className="w-full md:max-w-[550px] lg:w-[800px]"
                pagination={false}
                columns={[
                    {key: 1, dataIndex: 'imgSrc', title: 'Картинка', width: '5%', render: (_, record) => (
                        <Image src={record.imgSrc} height={35} width={40}/>
                    )},
                    {key: 2, dataIndex: 'name', title: 'Назва', width: '70%', render: (_, record) => (
                        <Link to="/components/$componentType/$id" params={{componentType, id: record.unifiedComponentId}}>
                            <Typography.Text>{record.name}</Typography.Text>
                        </Link>
                    )},
                    {key: 3, dataIndex: 'marketplace', title: 'Магазин', width: '10%'},
                    {key: 4, dataIndex: 'price', title: 'Ціна', width: '10%'},
                    {key: 5, dataIndex: 'actions', title: 'Дії', width: '5%', render: (_, record) => (
                        <Space size={'middle'}>
                            <Tooltip title="Видалити зі збірки">
                                <CloseOutlined onClick={() => removeFromBuild(record.name)} />
                            </Tooltip>
                            <Tooltip title="Купити">
                                <a href={record.URL}><Button>Купити</Button></a>
                            </Tooltip>
                        </Space>
                    )}
                ]}
                dataSource={buildComponents.map(c => ({
                    key: c.id,
                    imgSrc: c.imgUrl,
                    name: c.name,
                    marketplace: c.marketplaceName,
                    price: c.price,

                    URL: c.URL,
                    unifiedComponentId: c.unifiedComponentId,
                }))}
            />}
        </div>
    </div>;
}