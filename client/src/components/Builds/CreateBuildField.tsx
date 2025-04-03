import { router } from "@/main";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Button, Image, Space, Table, Tooltip, Typography } from "antd";
import { useState } from "react";
import BuildComponentsTable from "./BuildComponentsTable";

type CreateBuildFieldProps = {
    componentType: string;
    componentName: string;
    components: any[];
    onBuildChange: () => void;
}

export default function CreateBuildField({ componentType, componentName, components, onBuildChange }: CreateBuildFieldProps) {
    const [buildComponents, setBuildComponents] = useState<any[]>(components);
    
    const removeFromBuild = (comnponentName: string) => {
        const build = JSON.parse(localStorage.getItem('build')!);

        build[componentType] = build[componentType].filter((c: any) => c.name !== comnponentName);

        localStorage.setItem('build', JSON.stringify(build));
        setBuildComponents(prev => prev.filter(c => c.name !== comnponentName));
        onBuildChange();
    };
    
    return <div>
        <div>
            <div className="flex gap-2 items-center">
                <Button onClick={() => router.navigate({ to: '/components/$componentType', params: { componentType } })}>Додати до збірки</Button>
            </div>
            <BuildComponentsTable 
                components={buildComponents} 
                componentType={componentType} 
                componentName={componentName} 
                handleRemoveFromBuild={removeFromBuild}
            />
        </div>
    </div>;
}