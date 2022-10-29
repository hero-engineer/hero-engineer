import { Ref } from 'react';
export default function useForkedRef<InstanceA, InstanceB>(refA: Ref<InstanceA> | null | undefined, refB: Ref<InstanceB> | null | undefined): Ref<InstanceA & InstanceB> | null;
