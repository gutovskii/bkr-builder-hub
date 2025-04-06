import { componentTypeToUkranian } from "@/common/helpers";
import ComponentItem from "@/components/Components/ComponentItem";
import { componentsService } from "@/services/components.service";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Input, Pagination, Spin, Typography } from "antd";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";

export default function ComponentsList() {
    const params = useParams({ from: '/components/$componentType' });
    const search = useSearch({ from: '/components/$componentType' });

    const [page, setPage] = useState(search.page ?? 1);
    const [pageSize, setPageSize] = useState(search.pageSize ?? 20);
    const [searchTerm, setSearchTerm] = useState(search.name ?? '');

    const query = useQuery({
        queryFn: () => {
            return componentsService.findComponents({
                componentType: params.componentType,
                name: searchTerm,
                page: page,
                pageSize: pageSize,
                filters: search?.filters,
            });
        },
        queryKey: ['components', page, pageSize, search.name, params.componentType, JSON.stringify(search?.filters)],
        refetchOnWindowFocus: false,
    });
    
    const debounceRefetch = useCallback(debounce(() => {
        query.refetch();
    }, 500), []);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debounceRefetch();
    }

    useEffect(() => {
        if (search.page) setPage(search.page);
    }, [search.page]);
    
    return <div>
        <div className="flex justify-between items-center">
            <Typography.Title>{componentTypeToUkranian(params.componentType)}</Typography.Title>
            <div className="w-[300px]">
                <Input 
                    placeholder="Пошук..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                />
            </div>
        </div>
        <div className="flex flex-col justify-center">
            {query.isFetching ? <Spin className="flex justify-center items-center" /> : <div className="p-5 flex w-full flex-wrap">
                {query.data?.results.map((result: any) => <ComponentItem key={result.id} data={result} />)}
            </div>}
            <div className="flex justify-center mb-5">
                {query.isFetching ? null : 
                    <Pagination 
                        onChange={(currentPage, currentPageSize) => {
                            setPage(currentPage); setPageSize(currentPageSize)
                        }}
                        pageSizeOptions={[10,20,50,100]}
                        pageSize={pageSize} 
                        current={page}
                        defaultCurrent={1} 
                        total={query.data?.totalCount} 
                    />
                }
            </div>
        </div>
    </div>;
}