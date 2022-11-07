import bookshelf from "../config/bookshelf";

export function createModel(tableName, properties = {}) {
    return bookshelf.model(tableName, {
        tableName,
        ...properties
    })
}
