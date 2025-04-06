import { router } from "@/main";
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
    
    return <div className="mb-2">
        <BuildComponentsTable 
            components={buildComponents} 
            componentType={componentType} 
            componentName={componentName} 
            handleRemoveFromBuild={removeFromBuild}
            handleNavigate={() => router.navigate({ to: '/components/$componentType', params: { componentType } })}
        />
    </div>;
}