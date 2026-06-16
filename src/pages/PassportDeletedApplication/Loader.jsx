import loader from '../../helpers/LazyLoader.jsx';

export const loadable = loader(() => import('./index.jsx'));
export default loadable;
