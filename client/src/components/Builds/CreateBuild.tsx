import { useStore } from "@/store/store";
import CreateBuildField from "./CreateBuildField";
import { useState } from "react";
import { Button, Form, Input, message, Typography, Upload, type UploadFile, type UploadProps } from "antd";
import ImgCrop from 'antd-img-crop';
import { buildService } from "@/services/build.service";
import { useMutation } from "@tanstack/react-query";
import MDEditor from '@uiw/react-md-editor';
import { useNavigate } from "@tanstack/react-router";

type CreateBuildValues = {
    name: string;
    description?: string;
}

export default function CreateBuild() {
    const build = JSON.parse(localStorage.getItem('build')!);

    const [buildImgs, setBuildImgs] = useState<UploadFile[]>([]);
    const [buildPrice, setBuildPrice] = useState<number>(
        Object.keys(build).map(componentType => {
            return build[componentType].reduce((acc: number, curr: any) => acc + curr.price, 0);
        }).reduce((acc: number, curr: number) => acc + curr, 0)
    );

    const [form] = Form.useForm<CreateBuildValues>();
    const navigate = useNavigate();

    const user = useStore(state => state.user);

    const createBuildMutation = useMutation({
        mutationFn: (formData: FormData) => {
            return buildService.createBuild(formData);
        },
        mutationKey: ['create-build', form.getFieldValue('name'), user?.id, localStorage.getItem('build')],
        onSuccess(data) {
            message.success('Збірки створена успішно!');
            navigate({ to: '/builds/$buildId', params: {buildId: data.id} });
        },
        onError(error) {
            message.error(error.message);
        },
    });

    const handleBuildImgUpload: UploadProps['onChange'] = ({
        fileList: newFileList,
    }) => {
        setBuildImgs(newFileList);
    }

    const handleBuildImgRemove: UploadProps['onRemove'] = (fileToRemove) => {
        setBuildImgs(prev => prev.filter(f => f.fileName !== fileToRemove.fileName))
    }

    const handleBuildChange = () => {
        const updatedBuild = JSON.parse(localStorage.getItem('build')!);

        const newPrice = Object.keys(updatedBuild).map(componentType => {
            return updatedBuild[componentType].reduce((acc: number, curr: any) => acc + curr.price, 0);
        }).reduce((acc: number, curr: number) => acc + curr, 0);

        setBuildPrice(newPrice);
    }

    const createBuild = async (values: CreateBuildValues) => {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('description', values.description ?? '');
        formData.append('price', buildPrice.toString());
        buildImgs.forEach((buildImg) => formData.append('imgs', buildImg.originFileObj as any));

        if (Array.isArray(build.MotherboardComponent))
            formData.append('motherBoardId', build.MotherboardComponent[0].unifiedComponentId);
        if (Array.isArray(build.CpuComponent))
            formData.append('cpuId', build.CpuComponent[0].unifiedComponentId);
        if (Array.isArray(build.VideoCardComponent))
            build.VideoCardComponent.forEach(((c: any) => formData.append('videoCardsIds', c.unifiedComponentId)));
        if (Array.isArray(build.SsdComponent))
            build.SsdComponent.forEach(((c: any) => formData.append('ssdsIds', c.unifiedComponentId)));
        if (Array.isArray(build.HddComponent))
            build.HddComponent.forEach(((c: any) => formData.append('hddsIds', c.unifiedComponentId)));
        if (Array.isArray(build.MemoryComponent))
            build.MemoryComponent.forEach(((c: any) => formData.append('memoriesIds', c.unifiedComponentId)));
        if (Array.isArray(build.CoolerComponent))
            build.CoolerComponent.forEach(((c: any) => formData.append('coolerIds', c.unifiedComponentId)));
        if (Array.isArray(build.CasesComponent))
            build.CasesComponent.forEach(((c: any) => formData.append('casesIds', c.unifiedComponentId)));
        if (Array.isArray(build.PowerSupplyComponent))
            build.PowerSupplyComponent.forEach(((c: any) => formData.append('powerSuppliesIds', c.unifiedComponentId)));

        createBuildMutation.mutate(formData);
    }

    return <div className="flex flex-col md:flex-row w-full">
        {user && 
            <div className="w-full md:w-1/3 p-3">
                <div className="flex">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={createBuild}
                        className="w-[500px]"
                    >
                        <Form.Item
                            label="Назва збірки"
                            name="name"
                            rules={[{required: true, message: 'Уведіть назву збірки'}]}
                        >
                            <Input className="max-w-[300px]" />
                        </Form.Item>

                        <Form.Item
                            label="Опис"
                            name="description"
                            rules={[{max: 1000000, message: 'Максимум 1 мільйон символів'}]}
                        >
                            <MDEditor />
                        </Form.Item>
                        
                        <Form.Item
                            label="Фото збірки"
                            name="imgs"
                            className="max-w-auto md:max-w-[450px]"
                            rules={[{min: 1, message: 'Додайте хоча би одну фотографію'}]}
                        >
                            <ImgCrop rotationSlider quality={0.4}>
                                <Upload
                                    maxCount={10}
                                    listType="picture-card"
                                    beforeUpload={() => false}
                                    onChange={handleBuildImgUpload}
                                    onRemove={handleBuildImgRemove}
                                    fileList={buildImgs}
                                >
                                    {buildImgs.length < 10 && '+ Upload'}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={createBuildMutation.isPending}>
                                Створити збірку
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        }
        <div className="w-full md:w-2/3 p-3">
            <div>
                <Typography.Title level={4}>Ціна: <span className="p-1 rounded-xl bg-blue-300 text-black">{buildPrice}</span> ₴</Typography.Title>
                <CreateBuildField componentType="CpuComponent" components={build.CpuComponent} componentName="Процесор" onBuildChange={handleBuildChange} />
                <CreateBuildField componentType="MotherboardComponent" components={build.MotherboardComponent} componentName="Материнська плата" onBuildChange={handleBuildChange} />
                <CreateBuildField componentType="MemoryComponent" components={build.MemoryComponent} componentName="Оперативна пам'ять" onBuildChange={handleBuildChange} />
                <CreateBuildField componentType="SsdComponent" components={build.SsdComponent} componentName="SSD-диски" onBuildChange={handleBuildChange} />
                <CreateBuildField componentType="HddComponent" components={build.HddComponent} componentName="Жорсткі диски" onBuildChange={handleBuildChange} />
                <CreateBuildField componentType="VideoCardComponent" components={build.VideoCardComponent} componentName="Відеокарти" onBuildChange={handleBuildChange} />
                <CreateBuildField componentType="PowerSupplyComponent" components={build.PowerSupplyComponent} componentName="Джерела живлення" onBuildChange={handleBuildChange} />
                <CreateBuildField componentType="CoolerComponent" components={build.CoolerComponent} componentName="Кулер" onBuildChange={handleBuildChange} />
                <CreateBuildField componentType="CaseComponent" components={build.CaseComponent} componentName="Кейси" onBuildChange={handleBuildChange} />
            </div>
        </div>
    </div>
}