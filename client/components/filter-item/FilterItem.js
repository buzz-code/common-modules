import React, { useCallback, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { getCondition } from '../../utils/queryUtil';

const FilterItem = ({ filterDef, index, onChange, classes }) => {
  const [value, setValue] = useState(filterDef.defaultValue ?? null);
  const handleChange = useCallback((value) => {
    const condition = getCondition(filterDef, value);
    onChange(condition, index);
    setValue(value);
  }, [filterDef, index, onChange, setValue]);

  const handleTextFieldChange = e => handleChange(e.target.value);
  const handleAutocompleteChange = (e, val) => handleChange((val || {})[filterDef.idField || 'id']);

  console.log(value);

  return filterDef.type === 'text' || filterDef.type === 'date' ? (
    <TextField
      className={classes.inputField}
      type={filterDef.type}
      label={filterDef.label}
      value={value}
      onChange={handleTextFieldChange}
      InputLabelProps={{
        shrink: true,
      }}
    />
  ) : filterDef.type === 'list' ? (
    <Autocomplete
      className={classes.inputField}
      value={value}
      onChange={handleAutocompleteChange}
      options={filterDef.list || []}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField {...params}
        label={filterDef.label}
        InputLabelProps={{
          shrink: true,
        }}
      />}
    />
  ) : null;
};

export default FilterItem;
