import { NO_IMAGE_SRC } from "@/common/consts";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Button, Image, Space, Table, Tooltip, Typography } from "antd";

export type BuildComponentsTableProps = {
    components: any[];
    componentType: string;
    componentName: string;
    handleNavigate?: () => void;
    handleRemoveFromBuild?: (componentName: string) => void;
}

export default function BuildComponentsTable({components, componentType, componentName, handleNavigate, handleRemoveFromBuild}: BuildComponentsTableProps) {
    return <div className="w-full md:w-[550px] lg:w-[800px]">
        <div className="flex justify-between items-center gap-2 mb-2">
            <div>
                <Typography.Title level={4} className="!mb-0">{componentName}</Typography.Title>
            </div>
            {handleNavigate && <div className="flex gap-2 items-center">
                <Button onClick={handleNavigate}>Додати до збірки</Button>
            </div>}
        </div>
        {(components && components.length) ? <Table 
            pagination={false}
            columns={[
                {key: 1, dataIndex: 'imgSrc', title: 'Картинка', width: '5%', render: (_, record) => (
                    <Image src={record.imgSrc ?? NO_IMAGE_SRC } height={35} width={40}/>
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
                        {handleRemoveFromBuild && <Tooltip title="Видалити зі збірки">
                            <CloseOutlined onClick={() => handleRemoveFromBuild(record.name)} />
                        </Tooltip>}
                        <Tooltip title="Купити">
                            <a href={record.URL}><Button>Купити</Button></a>
                        </Tooltip>
                    </Space>
                )}
            ]}
            dataSource={components.map((c: any) => ({
                key: c.id,
                imgSrc: c.imgUrl,
                name: c.name,
                marketplace: c.marketplaceName,
                price: c.price,

                URL: c.URL,
                unifiedComponentId: c.unifiedComponentId,
            }))}
        /> : null}
    </div>
    
}