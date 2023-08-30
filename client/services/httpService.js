// Import custom utils
import { fetch, store, update, destroy } from '../utils/httpUtil';
import { getPathParam } from '../utils/serializeUtil';
import fileDownload from 'js-file-download';
import contentDisposition from 'content-disposition';

export const fetchEntity = (
  entityName,
  { error, orderBy, orderDirection, page, pageSize, search, totalCount, ...rest },
  filters
) => {
  const columnOrder = orderBy?.columnOrder || orderBy?.field;
  return fetch(entityName.toLowerCase(), {
    page,
    pageSize,
    orderBy: columnOrder,
    orderDirection,
    ...rest,
    filters,
  });
};

export const fetchEntityById = (entityName, dataId) => {
  return fetch(getPathParam(entityName.toLowerCase(), dataId));
};

export const storeEntity = (entityName, data) => {
  return store(entityName.toLowerCase(), data);
};

export const updateEntity = (entityName, data, dataId) => {
  return update(getPathParam(entityName.toLowerCase(), dataId), data);
};

export const destroyEntity = (entityName, dataId) => {
  return destroy(getPathParam(entityName.toLowerCase(), dataId));
};

export const customHttpRequest = (entityName, method, url, data, dataId, responseType) => {
  const mapping = { GET: fetch, POST: store, PUT: update, DELETE: destroy };
  return mapping[method](getPathParam(entityName.toLowerCase(), url, dataId), data, responseType);
};

export const downloadFile = (entityName, method, url, data, dataId) => {
  return customHttpRequest(entityName, method, url, data, dataId, 'blob')
    .then(response => {
      const disposition = contentDisposition.parse(response.headers["content-disposition"]);
      fileDownload(response.data, disposition.parameters.filename);
    });
};
