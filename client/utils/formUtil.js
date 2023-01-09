import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { getOptionLabelFunc } from './queryUtil';

export const getPropsForAutoComplete = (field, list, idField = 'id') => ({
  list,
  idField,
  render: (rowData) => <span>{list?.find((item) => item[idField] == rowData[field])?.name}</span>,
  editComponent: (props) => (
    <Autocomplete
      size="small"
      options={list || []}
      getOptionLabel={getOptionLabelFunc(list, idField)}
      getOptionSelected={(option, value) => option[idField] == value}
      value={props.value}
      renderInput={(params) => {
        return <TextField {...params} fullWidth />;
      }}
      onChange={(e, value) => props.onChange(value && value[idField])}
    />
  ),
});

export const getColumnsForPivot = (data, isHideZeroValues = true) => {
  const allProps = Object.fromEntries(data.flatMap(item => Object.entries(item)));
  const columns = [];
  for (const key in allProps) {
    if (key.endsWith('_title')) {
      const field = key.replace('_title', '');

      columns.push({
        field,
        title: allProps[key],
        sorting: false,
        ...getPropsForHideZeroValues(field, isHideZeroValues),
      })
    }
  }
  return columns;
}

export const getPropsForHideZeroValues = (field, isHideZeroValues = true) => {
  let render = undefined;
  if (isHideZeroValues) {
    render = (rowData) => <span>{rowData[field] || ''}</span>;
  }

  return {
    render
  };
}