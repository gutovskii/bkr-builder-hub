import { NO_IMAGE_SRC } from "@/common/consts";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useParams } from "@tanstack/react-router";
import { Card, Image, Tooltip, Typography } from "antd";

export default function ComponentItem({data}: any) {
    const params = useParams({ from: '/components/$componentType' });

    const addToBuild = (data: any) => {
        let build = localStorage.getItem('build');
        if (!build) return;
        const componentInMarketplace = { imgUrl: data.imgUrls[0], ...data.marketplacesComponents.find((mc: any) => mc.price === data.lowestPrice)! };

        const parsed = JSON.parse(build);

        let buildCharacterisitics = parsed[data.componentType];

        if (data.componentType === 'MotherboardComponent' ||
            data.componentType === 'CpuComponent'
        ) {
            parsed[data.componentType] = [componentInMarketplace];
        } else {
            if (buildCharacterisitics) {
                const sameComponent = buildCharacterisitics.find((bc: any) => bc.id === componentInMarketplace.id);
                if (sameComponent) return;
            }
            if (buildCharacterisitics)
                buildCharacterisitics.push(componentInMarketplace);
            else
                parsed[data.componentType] = [componentInMarketplace];
        }

        localStorage.setItem('build', JSON.stringify(parsed));
    }

    return <div className="w-1/2 md:w-1/3 lg:w-1/5 flex flex-col pb-2" title={data.componentUnifiedName}>
        <Card
            hoverable
            className="w-[95%] min-h-[350px]"
            cover={data.imgUrls[0] ? <Image height={150} src={data.imgUrls[0]} /> : <Image height={150} preview={false} src={NO_IMAGE_SRC} />}
            actions={[
                <Tooltip title="Додати в збірку">
                    <PlusOutlined title="Додати в збірку" key="addToBuild" onClick={() => addToBuild(data)} />
                </Tooltip>,
            ]}
        >
            <Link to="/components/$componentType/$id" params={{componentType: params.componentType, id: data.id}}>
                <Card.Meta
                    title={data.componentUnifiedName}
                    description={
                        <>
                            <div className="min-h-[75px]">
                                <div>
                                    Найнижча ціна: <Typography.Text>{data.lowestPrice} ₴</Typography.Text>
                                </div>
                                <div>
                                    Гарантія: <Typography.Text>{data.warranty}</Typography.Text>
                                </div>
                            </div>
                        </>
                    }
                />
            </Link>
        </Card>
    </div>;
}