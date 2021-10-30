export function getListFromTable(table, user_id, idField = 'id') {
    return new table().where({ user_id })
        .query({ select: [idField, 'name'] })
        .fetchAll()
        .then(result => result.toJSON());
}

export function getDataToSave(data, columns) {
    return data.map((item) => {
        const value = {};
        columns.forEach((c, i) => c && (value[c] = item[i]));
        return value;
    });
}