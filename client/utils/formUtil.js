import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export const getPropsForAutoComplete = (field, list, idField = 'id') => ({
  list,
  idField,
  render: (rowData) => <span>{list?.find((item) => item[idField] == rowData[field])?.name}</span>,
  editComponent: (props) => (
    <Autocomplete
      size="small"
      options={list || []}
      getOptionLabel={(option) => option?.name || list?.find((item) => item[idField] == props.value)?.name}
      getOptionSelected={(option, value) => option[idField] == value}
      value={props.value}
      renderInput={(params) => {
        return <TextField {...params} fullWidth />;
      }}
      onChange={(e, value) => props.onChange(value && value[idField])}
    />
  ),
});

export const getColumnsForPivot = (data) => {
  const allProps = Object.fromEntries(data.flatMap(item => Object.entries(item)));
  const columns = [];
  for (const key in allProps) {
    if (key.endsWith('_title')) {
      columns.push({
        field: key.replace('_title', ''),
        title: allProps[key],
        sorting: false,
      })
    }
  }
  return columns;
}