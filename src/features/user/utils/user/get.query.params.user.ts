import { sortDirectionEnum } from '../../../../libs/contracts/enums/sort/sort.direction.enum';
import { UserQueryDto } from '../../dto/user.query.dto';
import { ArticlesQuery } from '../../../../libs/contracts/commands/query/articles.query.command';

export const getUsersQuery = (queryUser: UserQueryDto) => ({
    sortBy: (queryUser.sortBy || 'created_at').toLowerCase() ?? 'created_at',
    sortDirection:
        queryUser.sortBy?.toUpperCase() === sortDirectionEnum.enum['ASC'] ? sortDirectionEnum.enum['ASC'] : sortDirectionEnum.enum['DESC'],
    pageNumber: queryUser.pageNumber ?? 1,
    pageSize: queryUser.pageSize ?? 10,
    searchLoginTerm: queryUser.searchLoginTerm ?? '',
    searchEmailTerm: queryUser.searchEmailTerm ?? '',
});

export const getArticlesQuery = (query: ArticlesQuery) => {
    return {
        sortBy: (query.sortBy === 'createdAt' ? 'created_at' : query.sortBy || 'created_at').toLowerCase(), // 'title' или 'createdAt'
        sortDirection:
            (query.sortDirection?.toUpperCase() === sortDirectionEnum.enum.ASC
                ? sortDirectionEnum.enum.ASC
                : sortDirectionEnum.enum.DESC) || sortDirectionEnum.enum.DESC,
        pageNumber: query.pageNumber ?? 1,
        pageSize: query.pageSize ?? 10,
        searchTitleTerm: query.searchTitleTerm ?? '',
        authorId: query.authorId ?? null,
        dateFrom: query.dateFrom ?? null,
        dateTo: query.dateTo ?? null,
    };
};
