import { buildService } from "@/services/build.service";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Pagination, Spin } from "antd";
import { useEffect, useState } from "react";
import BuildItem from "./BuildItem";

export default function BuildsList() {
    const search = useSearch({ from: '/builds' });

    const [page, setPage] = useState(search.page ?? 1);
    const [pageSize, setPageSize] = useState(search.pageSize ?? 20);

    const query = useQuery({
        queryFn: () => {
            return buildService.findAll({
                name: search.name,
                page: page,
                pageSize: pageSize,
                filters: search?.filters,
            });
        },
        queryKey: ['builds', page, pageSize, search.name, JSON.stringify(search?.filters)],
        refetchOnWindowFocus: false,
    });
    
    useEffect(() => {
        if (search.page) setPage(search.page);
    }, [search.page]);

    return <div className='flex flex-col justify-center'>
        {query.isFetching ? <Spin /> : <div>
            {query.data?.results.map((result: any) => {
                return <BuildItem key={result.id} data={result} /> 
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
    </div>
}