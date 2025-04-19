import { capitalizeFirstLetter, formatCamelCaseToSentence } from "@/common/helpers";
import { componentsService } from "@/services/components.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Carousel, Image, message, Spin, Table, Typography } from "antd";
import Link from "antd/es/typography/Link";
import TouchImg from '../../images/marketplacesLogos/touch.webp';
import ZhukImg from '../../images/marketplacesLogos/zhuk.png';
import ItboxImg from '../../images/marketplacesLogos/itbox.jpg';

const marketplaceNameToLogoConfig = {
    Touch: TouchImg,
    Zhuk: ZhukImg,
    ITbox: ItboxImg,
}

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
                if (sameComponent) {
                    message.info('Компонент уже доданий');
                    return;
                };
            }
            if (buildCharacterisitics)
                buildCharacterisitics.push(data);
            else
                parsed[buildComponentType] = [data];
        }

        localStorage.setItem('build', JSON.stringify(parsed));

        message.success('Додано в збірку!');
    }

    return query.isLoading ? <Spin /> : <div className="p-10">
        <div>
            <Typography.Title>{query.data.componentUnifiedName}</Typography.Title>
        </div>
        <Typography.Title level={4}>
            Найнижча ціна: <span className="p-1 rounded-xl bg-blue-300 text-black">{query.data.lowestPrice}</span> ₴
        </Typography.Title>
        <div>Гарантія: <strong>{query.data.warranty}</strong></div>
        <div className="flex w-full">
            <div className="w-1/2 max-h-[500px] pr-5">
                <Carousel arrows>
                    {query.data.imgUrls.map((imgUrl: string) => (
                        <div>
                            <Image height={350} src={imgUrl} />
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className="w-1/2">
                <Typography.Title level={4}>Компоненти в магазинах</Typography.Title>
                {query.data.marketplacesComponents.map((mc: any) => (
                    <div key={mc.id} className="flex items-center gap-2">
                        <div>
                            <Image height={75} src={marketplaceNameToLogoConfig[mc.marketplaceName as keyof typeof marketplaceNameToLogoConfig]} preview={false} />
                        </div>
                        <div>
                            <Link href={mc.URL}><div>{mc.componentUnifiedName}</div></Link>
                            <div>{mc.price} ₴</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Button type="primary"><a href={mc.URL} className="text-black">Купити</a></Button>
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