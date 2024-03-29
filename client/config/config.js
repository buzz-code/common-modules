import heLocale from 'date-fns/locale/he';
import PACKAGE from '../../../package.json';

const isBaseUrl = process.env.NODE_ENV === 'development' || PACKAGE.customDomain;
export const apiPath = isBaseUrl ? '/api/' : 'api/';
export const API_URL = apiPath;
export const JWT_TOKEN = 'token';
export const materialTableOptions = {
  actionsColumnIndex: 0,
  exportButton: { csv: true, pdf: false },
  search: false,
  filtering: false,
  pageSizeOptions:[10, 25, 50, 100],
  pageSize: 25,
  addRowPosition: 'first',
};
export const materialTableLocalizations = {
  body: {
    dateTimePickerLocalization: heLocale,
    emptyDataSourceMessage: 'אין רשומות להצגה',
    addTooltip: 'הוסף',
    deleteTooltip: 'מחק',
    editTooltip: 'ערוך',
    filterRow: {
      filterTooltip: 'סינון',
    },
    editRow: {
      deleteText: 'האם אתה בטוח שברצונך למחוק את השורה?',
      cancelTooltip: 'בטל',
      saveTooltip: 'שמור',
    },
  },
  grouping: {
    placeholder: 'גרור את ראשי הטבלאות',
    groupedBy: 'קיבוץ לפי:',
  },
  header: {
    actions: 'פעולות',
  },
  pagination: {
    labelDisplayedRows: '{from}-{to} מתוך {count}',
    labelRowsSelect: 'שורות',
    labelRowsPerPage: 'שורות לעמוד:',
    firstAriaLabel: 'עמוד ראשון',
    firstTooltip: 'עמוד ראשון',
    previousAriaLabel: 'העמוד הקודם',
    previousTooltip: 'העמוד הקודם',
    nextAriaLabel: 'העמוד הבא',
    nextTooltip: 'העמוד הבא',
    lastAriaLabel: 'עמוד אחרון',
    lastTooltip: 'עמוד אחרון',
  },
  toolbar: {
    addRemoveColumns: 'הוסף או הסר עמודות',
    nRowsSelected: '{0} שורות נבחרו',
    showColumnsTitle: 'הראה עמודות',
    showColumnsAriaLabel: 'הראה עמודות',
    exportTitle: 'ייצא',
    exportAriaLabel: 'ייצא',
    exportCSVName: 'ייצא לקובץ CSV',
    exportPDFName: 'ייצא לקובץ PDF',
    searchTooltip: 'חיפוש',
    searchPlaceholder: 'חיפוש',
  },
};
