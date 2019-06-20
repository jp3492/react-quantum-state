interface iAction {
    api: string;
    method: string;
    url: string;
    body: any;
}
interface iQRInput {
    id: string;
    connect?: Function | boolean;
}
interface iQROutput {
    state?: object;
    dispatch: Function;
    actions: object;
}
declare function quantumReducer(props: iQRInput, { id, connect }: {
    id: any;
    connect?: boolean | undefined;
}): iQROutput;
interface iInit {
    id: string;
    reducer: Function;
    initialState: object;
    actions: object;
    options: object;
}
declare function initializeReducers(inits: iInit[]): void[];
declare const _default: {
    initializeReducers: typeof initializeReducers;
    quantumReducer: typeof quantumReducer;
    dispatchToReducer: (props: iAction, { id, action }: {
        id: any;
        action: any;
    }) => void;
};
export default _default;
