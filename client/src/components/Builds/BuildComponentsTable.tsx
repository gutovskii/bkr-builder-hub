import { CloseOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Button, Image, Space, Table, Tooltip, Typography } from "antd";

export type BuildComponentsTableProps = {
    components: any[];
    componentType: string;
    componentName: string;
    handleRemoveFromBuild?: (componentName: string) => void;
}

export default function BuildComponentsTable({components, componentType, componentName, handleRemoveFromBuild}: BuildComponentsTableProps) {
    return <div>
        <Typography.Title level={4}>{componentName}</Typography.Title>
        {(components && components.length) ? <Table 
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