import axios from 'axios';

import { API_URL, JWT_TOKEN } from '../config/config';
import { getLocalStorage } from './storageUtil';

export const httpBase = (responseType) => {
  const api = axios.create({
    baseURL: `${API_URL}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': getLocalStorage(JWT_TOKEN),
      Authorization: 'bearer ' + getLocalStorage(JWT_TOKEN),
    },
    responseType,
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (401 === error.response.status) {
        // redirect to login page
      }
      if (404 === error.response.status) {
        // redirect to 404 page
      }
      if (500 === error.response.status) {
        // redirect to 500 page
      }
      return Promise.reject(error);
    }
  );

  return api;
};
