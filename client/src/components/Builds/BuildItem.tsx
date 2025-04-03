import { NO_IMAGE_SRC } from "@/common/consts";
import { Link } from "@tanstack/react-router";
import { Card, Image, Typography } from "antd";

export default function BuildItem({ data }: any) {
    return <div
        className="w-1/2 md:w-1/3 lg:w-1/5 flex flex-col pb-2" title={data.name}
    >
        <Card
            hoverable
            className="w-[95%] min-h-[350px]"
            cover={data.imgsUrls[0] ? <Image height={150} src={data.imgsUrls[0]} /> : <Image height={150} preview={false} src={NO_IMAGE_SRC} />}
        >
            <Link to="/builds/$buildId" params={{ buildId: data.id }}>
                <Card.Meta
                    title={data.name}
                    description={
                        <>
                            <div
                                className="min-h-[75px]"
                            >
                                <div>
                                    Ціна: <Typography.Text>{data.price} ₴</Typography.Text>
                                </div>
                            </div>
                        </>
                    }
                />
            </Link>
        </Card>
    </div>
}