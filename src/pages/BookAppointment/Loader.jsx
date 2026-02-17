import loader from '../../helpers/LazyLoader.jsx';

const loadable = loader(() => import('./index.jsx'));
export default loadable;
