import { createBrowserHistory as createHistory } from 'history';
import PACKAGE from '../../../package.json';

const isAppendPackageName = process.env.NODE_ENV !== 'development' && PACKAGE.customDomain === false;

// a singleton history object
const history = createHistory({
  basename: isAppendPackageName ? `/${PACKAGE.name}/` : undefined,
});
export default history;
