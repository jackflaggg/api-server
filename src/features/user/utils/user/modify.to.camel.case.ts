import { entitiesSortByEnum, sortByValues } from '../../../../libs/contracts/enums/sort/filter.params.enum';

export const convertCamelCaseToSnakeCase = (sortBy: entitiesSortByEnum) => {
    if (sortByValues.includes(sortBy)) {
        return sortBy.replace(/([A-Z])/g, '_\$1').toLowerCase();
    }
    return sortBy.toLowerCase();
};
