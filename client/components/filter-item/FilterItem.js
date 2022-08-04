import React, { useCallback, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const FilterItem = ({ item, index, onChange, classes }) => {
  const [value, setValue] = useState(item.defaultValue ?? null);
  const handleChange = useCallback((value, name) => {
    const filter = {
      field: item.field,
      value: value,
      operator: item.operator,
      label: item.label,
      type: item.type,
      name: name,
    };
    onChange(filter, index);
    setValue(value);
  }, [item, index, onChange, setValue]);

  const handleTextFieldChange = e => handleChange(e.target.value);
  const handleAutocompleteChange = (e, val) => handleChange((val || {})[item.idField || 'id'], val && val.name);

  console.log(value);

  return item.type === 'text' || item.type === 'date' ? (
    <TextField
      className={classes.inputField}
      type={item.type}
      label={item.label}
      value={value}
      onChange={handleTextFieldChange}
      InputLabelProps={{
        shrink: true,
      }}
    />
  ) : item.type === 'list' ? (
    <Autocomplete
      className={classes.inputField}
      value={value}
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
