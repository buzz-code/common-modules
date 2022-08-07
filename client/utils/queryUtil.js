export function getCondition(filterDef, value) {
    return {
        field: filterDef.field,
        operator: filterDef.operator,
        label: filterDef.label,
        type: filterDef.type,
        value: value,
    };
}
