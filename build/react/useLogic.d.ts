import type { LogicActions, LogicFactory } from "intentx-runtime";
import { ComputedDef } from "./withLogic";
export declare function useLogic<S extends object, C extends ComputedDef<S>, A extends LogicActions>(logic: LogicFactory<S, C, A>, scope?: string, sharedBus?: any): {
    state: Readonly<S & import("intentx-runtime/build/core/runtime").InferComputed<C>>;
    actions: A;
    emit: (intent: string, payload?: any) => Promise<void>;
};
