export function getListFromTable(table, user_id, idField = 'id') {
    return new table().where({ user_id })
        .query({ select: [idField, 'name'] })
        .fetchAll()
        .then(result => result.toJSON());
}
