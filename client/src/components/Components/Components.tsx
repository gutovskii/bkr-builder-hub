import { componentTypeToUkranian } from "@/common/helpers";
import { router } from "@/main";
import { Link } from "@tanstack/react-router";
import { Card, List, Typography } from "antd";

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
            {componentsConfig.map(componentType => (
                <div className="w-1/3 p-2">
                    <Link className="w-1/3" to="/components/$componentType" params={{ componentType }}>
                        <Card hoverable>
                            <Card.Meta title={componentTypeToUkranian(componentType)} />
                        </Card>
                    </Link>
                </div>
            ))}
        </div>
    </div>
}