import { MouseEvent, Ref } from 'react';
declare function useEditionProps<T>(id: string, className?: string): {
    ref: Ref<T>;
    hierarchyId: string;
    onClick: (event: MouseEvent) => void;
    className: string;
};
export default useEditionProps;
