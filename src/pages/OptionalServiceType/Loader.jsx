import loader from '../../helpers/LazyLoader';

export const loadable = loader(() => import('./index.jsx'));
export default loadable;
