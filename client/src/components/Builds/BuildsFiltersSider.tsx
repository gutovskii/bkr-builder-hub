import { buildService } from "@/services/build.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react";
import Sider from "antd/es/layout/Sider";
import { Checkbox, Collapse, Slider } from "antd";
import { formatCamelCaseToSentence } from "@/common/helpers";

export type BuildsFiltersSiderProps = {
    searchFilters: any;
}

export default function BuildsFiltersSider({ searchFilters }: BuildsFiltersSiderProps) {
    const navigate = useNavigate();

    const [filters, setFilters] = useState<any>(undefined);

    const filtersQuery = useQuery({
        queryFn: () => {
            return buildService.findFilters();
        },
        queryKey: ['build-filters'],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (filtersQuery.data) {
            setFilters(filtersQuery.data?.filters.reduce((acc: any, curr: any) => {
                const { title, ...dataToSet } = curr;
                acc[title] = dataToSet;
                return acc; 
            }, {}));
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
            to: '/builds', 
            search: (prev) => {
                delete prev.filters;
                return {...prev};
            },
            replace: false,
        });

        await navigate({ 
            to: '/builds', 
            search: (prev) => ({...prev, filters: updatedFilters}),
            replace: false,
        })
    }

    let sliderTimeout: number;
    const onSliderChange = async (fitlerTitle: string, minValue: number, maxValue: number) => {
        if (!filters) return;

        let updatedFilters = { ...searchFilters };

        if (!updatedFilters) {
            updatedFilters = {};
        }

        updatedFilters[fitlerTitle] = {
            maxValue,
            minValue,
        };

        await navigate({
            to: '/builds',
            search: (prev) => {
                delete prev.filters;
                return {...prev};
            },
            replace: false,
        });

        await navigate({
            to: '/builds',
            search: (prev) => ({...prev, filters: updatedFilters}), 
            replace: false,
        });
    }

    return <Sider width={200} theme={'light'}>
        {filters && <Collapse 
            items={Object.keys(filters).reverse().map((filterTitle: string) => ({
                key: filterTitle === 'lowestPrice' ? 'price' : filterTitle,
                label: formatCamelCaseToSentence(filterTitle === 'lowestPrice' ? 'price' : filterTitle),
                children: filters[filterTitle].characteristics 
                    ? filters[filterTitle].characteristics.map((characteristicsValue: any) => {
                        return <div key={characteristicsValue}>
                        <Checkbox
                            onChange={(e) => {return onCheckboxChange(filterTitle, characteristicsValue, e.target.checked)}}
                            checked={searchFilters?.[filterTitle]?.characteristics.includes(characteristicsValue)}
                        >{characteristicsValue}</Checkbox>
                    </div>
                    })
                    : <Slider
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
            }))}
        />}
    </Sider>
}