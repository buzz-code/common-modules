import React, { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const FilterItem = ({ item, index, onChange, classes }) => {
  const handleChange = useCallback((value) => {
    const filter = {
      field: item.field,
      value: value,
      operator: item.operator,
    };
    onChange(filter, index);
  }, [item, index, onChange]);

  const handleTextFieldChange = e => handleChange(e.target.value);
  const handleAutocompleteChange = (e, val) => handleChange((val || {})[item.idField || 'id']);

  return item.type === 'text' || item.type === 'date' ? (
    <TextField
      className={classes.inputField}
      type={item.type}
      label={item.label}
      onChange={handleTextFieldChange}
      InputLabelProps={{
        shrink: true,
      }}
    />
  ) : item.type === 'list' ? (
    <Autocomplete
      className={classes.inputField}
      onChange={handleAutocompleteChange}
      options={item.list || []}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField {...params}
        label={item.label}
        InputLabelProps={{
          shrink: true,
        }}
      />}
    />
  ) : null;
};

export default FilterItem;
