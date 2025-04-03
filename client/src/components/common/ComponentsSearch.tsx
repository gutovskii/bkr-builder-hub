import { componentsService } from "@/services/components.service";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";

export type ComponentsSearchProps = {
    componentType: string;
    handleComponents: (data: any) => void;
}

export default function ComponentsSearch({ componentType, handleComponents }: ComponentsSearchProps) {
    const [value, setValue] = useState<string>('');
    const timeoutRef = useRef<number | null>(null);

    const componentsQuery = useQuery({
        queryFn: async () => {
            const components = await componentsService.findComponents({
                componentType,
                value,
                page: 1,
                pageSize: 5,
                filters: {}
            });
            handleComponents(components);
            return components;
        },
        queryKey: ['components-search', componentType, value],
        enabled: !!value,
    });

    const handleSearch = useCallback((newValue: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            setValue(newValue);
        }, 500);
    }, []);

    useEffect(() => {
        handleComponents(componentsQuery.data);
    }, [componentsQuery.data]);

    return <Select 
        showSearch
        value={value}
        onChange={(v) => setValue(v)}
        onSearch={handleSearch}
        notFoundContent={null}
        placeholder="Search components..."
        suffixIcon={<SearchOutlined />}
    />;
}