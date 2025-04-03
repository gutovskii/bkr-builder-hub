import { buildService } from "@/services/build.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input, message, Pagination, Spin, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import BuildItem from "./BuildItem";
import type { BuildsSearchSchemaType } from "@/pages/BuildsListPage";
import debounce from 'lodash.debounce';

type BuildsListProps = {
    title: string;
    search: BuildsSearchSchemaType,
    findMethod: Extract<keyof typeof buildService, 'findAll' | 'findAllSaved' | 'findAllCreated'>;
}

export default function BuildsList({ title, search, findMethod }: BuildsListProps) {
    const [page, setPage] = useState(search.page ?? 1);
    const [pageSize, setPageSize] = useState(search.pageSize ?? 20);
    const [searchTerm, setSearchTerm] = useState(search.name ?? '');

    const query = useQuery({
        queryFn: () => {
            return buildService[findMethod]({
                name: searchTerm,
                page: page,
                pageSize: pageSize,
                filters: search?.filters,
            });
        },
        queryKey: ['builds', page, pageSize, search.name, JSON.stringify(search?.filters)],
        refetchOnWindowFocus: false,
    });

    const deleteBuildMutation = useMutation({
        mutationFn: (buildId: string) => {
            return buildService.delete(buildId);
        },
        onSuccess() {
            message.success('Збірка видалена успішно!');
            query.refetch();
        }
    });

    const deleteBuild = (buildId: string) => {
        deleteBuildMutation.mutate(buildId);
    }

    const unsaveBuildMutation = useMutation({
        mutationFn: (buildId: string) => {
            return buildService.unsaveBuild(buildId);
        },
        onSuccess() {
            message.info('Збірку прибрано зі збережених');
            query.refetch();
        }
    });

    const unsaveBuild = (buildId: string) => {
        unsaveBuildMutation.mutate(buildId);
    }
    
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
            <Typography.Title>{title}</Typography.Title>
            <div className="w-[300px]">
                <Input 
                    placeholder="Пошук..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                />
            </div>
        </div>
        <div className='flex flex-col justify-center'>
            {query.isFetching ? <Spin /> : <div className="p-5 flex w-full flex-wrap justify-start">
                {query.data?.results.map((result: any) => (
                    <BuildItem key={result.id} data={result} deleteBuild={deleteBuild} unsaveBuild={unsaveBuild} />
                ))}
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
    </div>
}