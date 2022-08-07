export function getCondition(filterDef, value) {
    return {
        field: filterDef.field,
        operator: filterDef.operator,
        label: filterDef.label,
        type: filterDef.type,
        value: value,
    };
}

export function getOptionLabelFunc(list, idField = 'id') {
    return (option) => option?.name ?? list?.find((item) => item[idField] == option)?.name ?? '';
}

export function getDefaultConditionsFromFilters(filters) {
    if (!filters) {
        return {};
    }
    return Object.fromEntries(
        filters.map((item, index) => ([
            index,
            getCondition(item, item.defaultValue)
        ]))
    );
}
