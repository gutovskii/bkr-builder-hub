import ComponentItem from "@/components/Components/ComponentItem";
import { componentsService } from "@/services/components.service";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Pagination, Spin } from "antd";
import { useEffect, useState } from "react";

export default function ComponentsList() {
    const params = useParams({ from: '/components/$componentType' });
    const search = useSearch({ from: '/components/$componentType' });

    const [page, setPage] = useState(search.page ?? 1);
    const [pageSize, setPageSize] = useState(search.pageSize ?? 20);

    const query = useQuery({
        queryFn: () => {
            return componentsService.findComponents({
                componentType: params.componentType,
                name: search.name,
                page: page,
                pageSize: pageSize,
                filters: search?.filters,
            });
        },
        queryKey: ['components', page, pageSize, search.name, params.componentType, JSON.stringify(search?.filters)],
        refetchOnWindowFocus: false,
    });
    
    useEffect(() => {
        if (search.page) setPage(search.page);
    }, [search.page]);
    
    return <div className="flex flex-col justify-center">
        {query.isFetching ? <Spin className="flex justify-center items-center"/> : <div className="p-5 flex w-full flex-wrap justify-start">
            {query.data?.results.map((result: any) => {
                return <ComponentItem key={result.id} data={result} />
            })}
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
    </div>;
}