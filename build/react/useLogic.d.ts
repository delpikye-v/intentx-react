import type { ComputedDef, LogicActions, LogicFactory } from "intentx-runtime";
import type { LogicInstanceOptions } from "./useLogicInstance";
export declare function useLogic<S extends object, C extends ComputedDef<S>, A extends LogicActions>(logic: LogicFactory<S, C, A>, options?: LogicInstanceOptions): {
    state: Readonly<S & import("intentx-runtime").InferComputed<C>>;
    actions: A;
    emit: (intent: string, payload?: any) => Promise<void>;
    computed: Readonly<import("intentx-runtime").InferComputed<C>>;
};
