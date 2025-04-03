import { capitalizeFirstLetter, formatCamelCaseToSentence } from "@/common/helpers";
import { componentsService } from "@/services/components.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Carousel, Image, Spin, Table, Typography } from "antd";
import Link from "antd/es/typography/Link";

export default function ComponentDetails({ componentType, id }: {componentType: string, id: string}) {
    const query = useQuery({
        queryFn: () => {
            return componentsService.findOne(componentType, id);
        },
        queryKey: ['component-details', id],
    });

    const addToBuild = (data: any) => {
        let build = localStorage.getItem('build');
        if (!build) return;

        data = { imgUrl: query.data.imgUrls[0], ...data };

        const parsed = JSON.parse(build);
        const buildComponentType = capitalizeFirstLetter(componentType);

        const buildCharacterisitics = parsed[buildComponentType];

        if (buildComponentType === 'MotherboardComponent' ||
            buildComponentType === 'CpuComponent'
        ) {
            parsed[buildComponentType] = [data];
        } else {
            if (buildCharacterisitics) {
                const sameComponent = buildCharacterisitics.find((bc: any) => bc.id === data.id);
                if (sameComponent) return;
            }
            if (buildCharacterisitics)
                buildCharacterisitics.push(data);
            else
                parsed[buildComponentType] = [data];
        }

        localStorage.setItem('build', JSON.stringify(parsed));
    }

    return query.isLoading ? <Spin /> : <div className="p-10">
        <div>
            <Typography.Title>{query.data.componentUnifiedName}</Typography.Title>
        </div>
        <div>
            <Typography.Text>Найнижча ціна: {query.data.lowestPrice} ₴</Typography.Text>
        </div>
        <div>
            <Typography.Text>Гарантія: {query.data.warranty}</Typography.Text>
        </div>
        <div className="flex w-full">
            <div className="w-1/2 max-h-[500px] pr-5">
                <Carousel arrows>
                    {query.data.imgUrls.map((imgUrl: string) => (
                        <div>
                            <Image height={350} src={imgUrl} preview={false} />
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className="w-1/2">
                <Typography.Title level={4}>Компоненти в магазинах</Typography.Title>
                {query.data.marketplacesComponents.map((mc: any) => (
                    <div key={mc.id} className="flex gap-2">
                        <div>
                            <Link href={mc.URL}><div>{mc.componentUnifiedName}</div></Link>
                            <div>{mc.price} ₴</div>
                        </div>
                        <div>
                            <Button onClick={() => addToBuild(mc)}>Додати в збірку</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <Typography.Title>Характеристики</Typography.Title>
        {query.data && <Table className="w-1/2" pagination={false} dataSource={
            Object.entries(JSON.parse(query.data.jsonCharacteristics)).map(([key, value]) => ({
                key: key + value,
                characteristicsKey: formatCamelCaseToSentence(key),
                characteristicsValue: value,
            }))
        } columns={[
            {title: 'Властивість', dataIndex: 'characteristicsKey', key: 'characteristicsKey'},
            {title: 'Значення', dataIndex: 'characteristicsValue', key: 'characteristicsValue'}
        ]}/>}
    </div>;
}