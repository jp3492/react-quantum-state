interface iQSInput {
    id: string;
    initialValue?: any;
    returnValue?: boolean;
}
declare function quantumState(props: iQSInput, { id, initialValue, returnValue }: {
    id: any;
    initialValue?: null | undefined;
    returnValue?: boolean | undefined;
}): [any, Function];
declare const _default: {
    quantumState: typeof quantumState;
    setQuantumValue: (id: string, value: any) => any;
};
export default _default;
