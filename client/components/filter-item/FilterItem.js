import React, { useCallback, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { getCondition, getOptionLabelFunc } from '../../utils/queryUtil';

const FilterItem = ({ filterDef, index, value, onChange, classes }) => {
  const handleChange = useCallback((value) => {
    const condition = getCondition(filterDef, value);
    onChange(condition, index);
  }, [filterDef, index, onChange]);

  const handleTextFieldChange = e => handleChange(e.target.value);
  const handleAutocompleteChange = (e, val) => handleChange((val || {})[filterDef.idField || 'id']);

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
      getOptionLabel={getOptionLabelFunc(filterDef.list, filterDef.idField)}
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
