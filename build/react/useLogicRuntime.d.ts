import { Scope, LogicRuntime, LogicActions, LogicFactory, createIntentBus } from "intentx-runtime";
import { ComputedDef } from "./withLogic";
type IntentBus = ReturnType<typeof createIntentBus>;
export declare function getGlobalBus(): IntentBus;
export declare function setGlobalBus(bus: IntentBus): void;
export declare function useLogicRuntime<S extends object, C extends ComputedDef<S>, A extends LogicActions>(logic: LogicFactory<S, C, A>, scope?: Scope | string, sharedBus?: boolean | IntentBus): {
    runtime: LogicRuntime<S, C, A>;
    state: Readonly<S & import("intentx-runtime/build/core/runtime").InferComputed<C>>;
    actions: A;
    emit: (intent: string, payload?: any) => Promise<void>;
};
export {};
