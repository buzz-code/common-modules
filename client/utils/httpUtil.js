import { httpBase } from './httpBaseUtil';
const defaultResponseType = 'json';

export const fetch = (endpoint, params, responseType = defaultResponseType) => {
  return httpBase(responseType).get(endpoint, { params });
};

export const store = (endpoint, data, responseType = defaultResponseType) => {
  return httpBase(responseType).post(endpoint, data);
};

export const update = (endpoint, data, responseType = defaultResponseType) => {
  return httpBase(responseType).put(endpoint, data);
};

export const destroy = (endpoint, nothing, responseType = defaultResponseType) => {
  return httpBase(responseType).delete(endpoint);
};
