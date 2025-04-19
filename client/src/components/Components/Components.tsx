import { componentsImgs } from "@/common/components-imgs";
import { componentTypeToUkranian } from "@/common/helpers";
import { Link } from "@tanstack/react-router";
import { Card, Image, Typography } from "antd";

export default function Components() {
    const componentsConfig = [
        'cpuComponent', 'motherboardComponent',
        'ssdComponent', 'hddComponent', 'memoryComponent',
        'videoCardComponent',
        'coolerComponent', 'powerSupplyComponent', 'caseComponent',
    ];

    return <div>
        <Typography.Title>Вітаємо у BUILDER HUB</Typography.Title>
        <div className="flex w-full flex-wrap">
            {componentsConfig.map((componentType, idx) => (
                <div className="w-1/3 p-2">
                    <Link className="w-1/3" to="/components/$componentType" params={{ componentType }}>
                        <Card hoverable>
                            <div className="flex gap-1 items-center">
                                <Image key={componentType} height={100} src={componentsImgs[idx]} preview={false} />
                                <Card.Meta title={componentTypeToUkranian(componentType)} />
                            </div>
                        </Card>
                    </Link>
                </div>
            ))}
        </div>
    </div>
}