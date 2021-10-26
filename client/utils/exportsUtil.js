import { CsvBuilder } from 'filefy';
import moment from 'moment';

import * as httpService from '../services/httpService';

const getExportData = (entity, filters, columns) => {
  return httpService
    .fetchEntity(entity, { page: 0, pageSize: 10000 }, filters)
    .then((response) => response.data)
    .then((response) => response.data)
    .then((data) => {
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
    value = columnDef.list?.find((item) => item[columnDef.idField] == value)?.name;
  } else if (columnDef.type == 'date') {
    value = moment(value).format('DD.MM.YYYY');
  }

  return value;
};

export const exportCsv = (columns, entity, filters, title) => {
  getExportData(entity, filters, columns).then(({ data, columns }) => {
    let fileName = title || 'data';

    const builder = new CsvBuilder(fileName + '.csv');
    builder.setDelimeter(',').setColumns(columns).addRows(data).exportFile();
  });
};

export const exportPdf = (columns, entity, filters, title) => {
  getExportData(entity, filters, columns).then(({ data, columns }) => {
    let fileName = title || 'data';

    httpService
      .downloadFile(entity, 'POST', 'export-pdf', { data, columns, fileName });
  });
}
