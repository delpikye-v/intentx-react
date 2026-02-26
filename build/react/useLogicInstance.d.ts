import type { Scope, LogicActions, LogicFactory, LogicApi, ComputedDef } from "intentx-runtime";
import type { IntentBus } from "./bus";
export type LogicInstanceOptions = {
    scope?: Scope | string;
    sharedBus?: boolean;
    bus?: IntentBus;
};
export declare function useLogicInstance<S extends object, C extends ComputedDef<S>, A extends LogicActions>(logic: LogicFactory<S, C, A>, options?: LogicInstanceOptions): LogicApi<S, C, A>;
