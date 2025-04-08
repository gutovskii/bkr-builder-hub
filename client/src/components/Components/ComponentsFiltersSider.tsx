import { capitalizeFirstLetter, formatCamelCaseToSentence } from "@/common/helpers";
import { componentsService, type ComponentFilterResponse } from "@/services/components.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Checkbox, Collapse, InputNumber, Slider, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";

export type ComponentSearchFilters = Record<string, Omit<ComponentFilterResponse['filters'][0], 'title'>>;

export default function ComponentsFiltersSider() {
    const params = useParams({ from: '/components/$componentType' });
    const { filters: searchFilters } = useSearch({ from: '/components/$componentType' });

    const navigate = useNavigate();
    
    const [filters, setFilters] = useState<ComponentSearchFilters | undefined>(undefined);
    const [collapsed, setCollapsed] = useState(false);

    const filtersQuery = useQuery({
        queryFn: () => {
            return componentsService.findFilters({ componentType: capitalizeFirstLetter(params.componentType) });
        },
        queryKey: ['components-filters', params.componentType],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (filtersQuery.data) {
            setFilters(filtersQuery.data?.filters.reduce((acc, curr) => {
                const { title, ...dataToSet } = curr;
                acc[title] = dataToSet;
                return acc; 
            }, {} as ComponentSearchFilters));
        }
    }, [filtersQuery.data?.filters]);

    const onCheckboxChange = async (filterTitle: string, characteristicsValue: string, isChecked: boolean) => {
        if (!filters) return;

        let updatedFilters = { ...searchFilters };

        if (!updatedFilters) {
            updatedFilters = {};
        }

        if (isChecked) {
            const existingFilter = updatedFilters[filterTitle];

            if (existingFilter) {
                updatedFilters[filterTitle].characteristics?.push(characteristicsValue);
            } else {
                updatedFilters[filterTitle] = {
                    characteristics: [characteristicsValue]
                }
            }
        } else {
            updatedFilters[filterTitle].characteristics = 
                updatedFilters[filterTitle].characteristics?.filter((c: string) => c !== characteristicsValue);
            if (updatedFilters[filterTitle].characteristics.length === 0)
                delete updatedFilters[filterTitle];
        }
        
        await navigate({ 
            to: '/components/$componentType', 
            search: (prev) => {
                delete prev.filters;
                return {...prev};
            },
            params: {...params},
            replace: false,
        });

        await navigate({ 
            to: '/components/$componentType', 
            search: (prev) => ({...prev, filters: updatedFilters}),
            params: {...params},
            replace: false,
        })
    }

    let sliderTimeout: number;
    const onSliderChange = async (filterTitle: string, minValue: number, maxValue: number) => {
        if (!filters) return;

        let updatedFilters = { ...searchFilters };

        if (!updatedFilters) {
            updatedFilters = {};
        }

        updatedFilters[filterTitle] = {
            maxValue,
            minValue,
        };

        await navigate({
            to: '/components/$componentType',
            search: (prev) => {
                delete prev.filters;
                return {...prev};
            },
            params: {...params}, 
            replace: false,
        });

        await navigate({
            to: '/components/$componentType',
            search: (prev) => ({...prev, filters: updatedFilters}), 
            params: {...params}, 
            replace: false,
        });
    }

    const handleSliderNumberInput = debounce((filterTitle: string, minValue: number, maxValue: number) => {
        onSliderChange(filterTitle, minValue, maxValue);
    }, 350);

    return <Sider className='sticky' width={200} theme={"light"} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <Typography.Title level={4} className="pl-3 pt-2">Filters</Typography.Title>
                {filters && <Collapse
                    className="!rounded-none" 
                    items={Object.keys(filters).reverse().map((filterTitle: string) => ({
                        key: filterTitle === 'lowestPrice' ? 'price' : filterTitle,
                        label: !collapsed ? formatCamelCaseToSentence(filterTitle === 'lowestPrice' ? 'price' : filterTitle) : '',
                        children: filters[filterTitle].characteristics 
                            ? filters[filterTitle].characteristics.map(characteristicsValue => {
                                return <div key={characteristicsValue}>
                                <Checkbox
                                    onChange={(e) => onCheckboxChange(filterTitle, characteristicsValue, e.target.checked)}
                                    checked={searchFilters?.[filterTitle]?.characteristics.includes(characteristicsValue)}
                                >{characteristicsValue}</Checkbox>
                            </div>
                            })
                            : <div>
                                <div className="flex w-full justify-between">
                                    <div className="w-1/2 p-1">
                                        <InputNumber 
                                            className="!w-[70px]"
                                            onChange={(number) => handleSliderNumberInput(filterTitle, number, filters[filterTitle].maxValue!)}
                                            min={filters[filterTitle].minValue!}
                                            max={filters[filterTitle].maxValue!}
                                            defaultValue={searchFilters?.[filterTitle]?.minValue ?? filters[filterTitle].minValue!}
                                        />
                                    </div>
                                    <div className="w-1/2 p-1">
                                        <InputNumber 
                                            className="!w-[70px]"
                                            onChange={(number) => handleSliderNumberInput(filterTitle, filters[filterTitle].minValue!, number)}
                                            min={filters[filterTitle].minValue!}
                                            max={filters[filterTitle].maxValue!}
                                            value={searchFilters?.[filterTitle]?.maxValue ?? filters[filterTitle].maxValue!}
                                            defaultValue={searchFilters?.[filterTitle]?.maxValue ?? filters[filterTitle].maxValue!}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Slider
                                        range 
                                        onChange={(values) => {
                                            clearTimeout(sliderTimeout);
                                            sliderTimeout = setTimeout(() => {
                                                onSliderChange(filterTitle, values[0], values[1])
                                            }, 300);
                                        }}
                                        min={filters[filterTitle].minValue!}
                                        max={filters[filterTitle].maxValue!}
                                        value={[
                                            searchFilters?.[filterTitle]?.minValue ?? filters[filterTitle].minValue!, 
                                            searchFilters?.[filterTitle]?.maxValue ?? filters[filterTitle].maxValue!,
                                        ]}
                                    />
                                </div>
                            </div>
                    }))}
                />}
            </Sider>;
}
