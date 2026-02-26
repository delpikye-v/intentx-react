import * as React from "react";
import type { ComputedDef, InferComputed, LogicActions, LogicFactory } from "intentx-runtime";
import type { LogicInstanceOptions } from "./useLogicInstance";
type InjectedProps<S extends object, C extends ComputedDef<S>, A extends LogicActions> = {
    state: Readonly<S & InferComputed<C>>;
    computed: Readonly<InferComputed<C>>;
    actions: A;
    emit: (intent: string, payload?: any) => Promise<void>;
};
export declare function withLogic<S extends object, C extends ComputedDef<S>, A extends LogicActions, P extends object>(logic: LogicFactory<S, C, A>, View: React.ComponentType<P & InjectedProps<S, C, A>>, options?: LogicInstanceOptions): React.FC<Omit<P, keyof InjectedProps<S, C, A>>>;
export {};
