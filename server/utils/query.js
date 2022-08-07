export function getCountFromTable(table, user_id, filter = {}, groupBy = 'id') {
    return new table().where({ user_id })
        .where(filter)
        .query()
        .countDistinct({ count: groupBy })
        .then(res => res[0].count);
}
