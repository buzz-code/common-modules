import bookshelf from "../config/bookshelf";

export function getCountFromTable(table, user_id, filter = {}, groupBy = 'id') {
    return new table().where({ user_id })
        .where(filter)
        .query()
        .countDistinct({ count: groupBy })
        .then(res => res[0].count);
}

const models = {};
export function getMinimalModel(tableName) {
    if (!models[tableName]) {
        models[tableName] = bookshelf.model(tableName, { tableName });
    }
    return models[tableName];
}