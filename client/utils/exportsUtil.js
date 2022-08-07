import { CsvBuilder } from 'filefy';
import moment from 'moment';
import { getJewishDate, formatJewishDateHebrew } from 'jewish-dates-core';

import * as httpService from '../services/httpService';
import { getOptionLabelFunc } from './queryUtil';

const getExportData = (entity, filters, columns, { orderBy, orderDirection }, columnsFunc) => {
  return httpService
    .fetchEntity(entity, { page: 0, pageSize: 10000, orderBy, orderDirection }, filters)
    .then((response) => response.data)
    .then((response) => response.data)
    .then((data) => {
      if (columnsFunc) {
        columns = columnsFunc(data);
      }
      const exportData = data.map((rowData) =>
        columns.map((columnDef) => getFieldValue(rowData, columnDef))
      );
      const exportColumns = columns.map((columnDef) => columnDef.title);

      return {
        data: exportData,
        columns: exportColumns,
      };
    });
};

const getFieldValue = (rowData, columnDef) => {
  let value = rowData[columnDef.field] ?? ''
  if (columnDef.list) {
    const getOptionLabel = getOptionLabelFunc(columnDef.list, columnDef.idField);
    value = getOptionLabel(value);
  } else if (columnDef.type == 'date') {
    value = value && moment(value).format('DD.MM.YYYY');
  } else if (columnDef.isHebrewDate) {
    value = value && formatJewishDateHebrew(getJewishDate(new Date(value)));
  }

  if (columnDef.isHideZeroValues && value == 0) {
    return '';
  }

  return value;
};

const getFileName = (title, filters) => {
  const filterTitle = Object.values(filters).map(filter => {
    if (filter.operator === 'like') {
      return filter.label + ' מכיל ' + filter.value;
    } else if (filter.operator === 'date-eq') {
      return filter.label + ' = ' + moment(filter.value, 'YYYY-MM-DD').format('DD-MM-YYYY');
    } else if (filter.operator === 'date-before') {
      return filter.label + ' ' + moment(filter.value, 'YYYY-MM-DD').format('DD-MM-YYYY');
    } else if (filter.operator === 'date-after') {
      return filter.label + ' ' + moment(filter.value, 'YYYY-MM-DD').format('DD-MM-YYYY');
    } else if (filter.operator === 'in') {
      return 'TODO';
    } else if (filter.operator === 'eq') {
      if (filter.type === 'list') {
        return filter.label + ' = ' + filter.name;
      } else {
        return 'TODO';
      }
    }
  })
    .join(', ');

  return (title ?? 'data') + (filterTitle ? ('- ' + filterTitle) : '');
}

export const exportCsv = (columns, entity, filters, title, query = {}, columnsFunc) => {
  getExportData(entity, filters, columns, query, columnsFunc).then(({ data, columns }) => {
    let fileName = getFileName(title, filters);

    const builder = new CsvBuilder(fileName + '.csv');
    builder.setDelimeter(',').setColumns(columns).addRows(data).exportFile();
  });
};

export const exportPdf = (columns, entity, filters, title, query = {}, columnsFunc) => {
  getExportData(entity, filters, columns, query, columnsFunc).then(({ data, columns }) => {
    let fileName = getFileName(title, filters);

    httpService
      .downloadFile(entity, 'POST', 'export-pdf', { data, columns, fileName });
  });
}
