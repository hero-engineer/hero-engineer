import { Dispatch, SetStateAction } from 'react';
declare function usePersistedState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>];
export default usePersistedState;
