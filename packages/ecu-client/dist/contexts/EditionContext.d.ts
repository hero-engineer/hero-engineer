import { Dispatch, SetStateAction } from 'react';
export declare type EditionContextType = {
    hierarchyIds: string[];
    setHierarchyIds: Dispatch<SetStateAction<string[]>>;
};
declare const _default: import("react").Context<EditionContextType>;
export default _default;
