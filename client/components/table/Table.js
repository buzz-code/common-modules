import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialTable from '@material-table/core';

import CustomizedSnackbar from '../common/snakebar/CustomizedSnackbar';
import * as crudAction from '../../actions/crudAction';
import { useDispatch, useSelector } from 'react-redux';
import { materialTableOptions, materialTableLocalizations } from '../../config/config';
import { exportCsv, exportPdf } from '../../utils/exportsUtil';
import TableFilter from '../table-filter/TableFilter';

const getActions = (tableRef) => [
  {
    icon: 'refresh',
    tooltip: 'רענון נתונים',
    isFreeAction: true,
    onClick: () => tableRef.current && tableRef.current.onQueryChange(),
  },
];

const Table = ({
  entity,
  title,
  columns,
  additionalActions = [],
  filters,
  validateRow,
  manipulateDataToSave,
  disableAdd,
  disableUpdate,
  disableDelete,
  onConditionUpdate,
  getExportColumns,
}) => {
  const dispatch = useDispatch();
  const { isLoading, data, error } = useSelector((state) => state[entity]);
  const [validationError, setValidationError] = useState(null);
  const [conditions, setConditions] = useState({});
  const tableRef = createRef();
  const tableTitle = useMemo(() => 'רשימת ' + title, [title]);
  const actions = useMemo(() => getActions(tableRef), [tableRef]);
  const isFirstTimeRef = createRef(true);

  const getSaveItem = useCallback((rowData) => {
    let dataToSave = {
      ...rowData,
      tableData: undefined,
      created_at: undefined,
      updated_at: undefined,
    };
    if (manipulateDataToSave) {
      dataToSave = manipulateDataToSave(dataToSave);
    }
    if (validateRow) {
      const errorMessage = validateRow(dataToSave);
      setValidationError(errorMessage);
      if (errorMessage) {
        return Promise.reject(errorMessage);
      }
    }
    return dispatch(crudAction.submitForm(entity, dataToSave, dataToSave.id));
  }, [manipulateDataToSave, validateRow, setValidationError, dispatch, entity]);
  const onRowAdd = useCallback(getSaveItem, [getSaveItem]);
  const onRowUpdate = useCallback(getSaveItem, [getSaveItem]);
  const onRowDelete = useCallback((rowData) => dispatch(crudAction.destroyItem(entity, rowData.id)), [dispatch, entity]);

  const getData = useCallback((query) => {
    return dispatch(crudAction.fetchAll(entity, query, conditions))
      .then((res) => res.data)
      .then((result) => {
        return {
          data: result.data,
          page: result.page,
          totalCount: result.total,
        };
      });
  }, [dispatch, entity, conditions]);

  const handleFilterChange = useCallback((conditions) => {
    setConditions(conditions);
  }, [conditions]);

  useEffect(() => {
    if (Object.keys(conditions).length) {
      setConditions({});
    }
  }, [entity]);

  useEffect(() => {
    if (isFirstTimeRef.current) {
      isFirstTimeRef.current = false;
    } else {
      if (!isLoading) {
        tableRef.current && tableRef.current.onQueryChange();
        onConditionUpdate && onConditionUpdate(conditions);
      }
    }
  }, [conditions]);

  return (
    <div>
      <h2 style={{ paddingBottom: '15px' }}>{title}</h2>

      {error && <CustomizedSnackbar variant="error" message={error} />}
      {validationError && <CustomizedSnackbar variant="error" message={validationError} />}

      {filters && filters.length > 0 && (
        <TableFilter filters={filters} onFilterChange={handleFilterChange} />
      )}

      <MaterialTable
        title={tableTitle}
        tableRef={tableRef}
        columns={columns}
        actions={[...actions, ...additionalActions]}
        data={getData}
        isLoading={isLoading}
        editable={{
          onRowAdd: disableAdd ? null : onRowAdd,
          onRowUpdate: disableUpdate ? null : onRowUpdate,
          onRowDelete: disableDelete ? null : onRowDelete,
        }}
        options={{
          ...materialTableOptions,
          exportMenu: [
            {
              label: 'ייצא לקובץ CSV',
              exportFunc: (cols, datas) => exportCsv(cols, entity, conditions, tableTitle, tableRef.current?.state?.query, getExportColumns),
            },
            {
              label: 'ייצא לקובץ PDF',
              exportFunc: (cols, datas) => exportPdf(cols, entity, conditions, tableTitle, tableRef.current?.state?.query, getExportColumns),
            },
          ],
        }}
        localization={materialTableLocalizations}
      />
    </div>
  );
};

export default Table;
