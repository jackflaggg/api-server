import { sortDirectionEnum, sortDirectionType } from '../../../../libs/contracts/enums/sort/sort.direction.enum';
import { entitiesSortByEnum } from '../../../../libs/contracts/enums/sort/filter.params.enum';
import { UserQueryDto } from '../../dto/user.query.dto';

export interface QueryUsers {
    sortBy?: entitiesSortByEnum;
    sortDirection?: sortDirectionType;
    pageNumber?: number;
    pageSize?: number;
    searchLoginTerm?: string | null;
    searchEmailTerm?: string | null;
}

export interface QueryUsersOutputInterface {
    sortBy: string;
    sortDirection: sortDirectionType;
    pageNumber: number;
    pageSize: number;
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
}

export const getUsersQuery = (queryUser: UserQueryDto) => ({
    sortBy: (queryUser.sortBy || 'created_at').toLowerCase() ?? 'created_at',
    sortDirection:
        queryUser.sortBy?.toUpperCase() === sortDirectionEnum.enum['ASC'] ? sortDirectionEnum.enum['ASC'] : sortDirectionEnum.enum['DESC'],
    pageNumber: queryUser.pageNumber ?? 1,
    pageSize: queryUser.pageSize ?? 10,
    searchLoginTerm: queryUser.searchLoginTerm ?? '',
    searchEmailTerm: queryUser.searchEmailTerm ?? '',
});
