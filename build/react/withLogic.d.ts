import * as React from "react";
import type { ExtractLogicTypes, LogicActions, LogicFactory } from "intentx-runtime";
export type ComputedDef<S> = Record<string, (context: {
    state: Readonly<S>;
}) => any>;
export type InferComputed<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => infer R ? R : never;
};
type InjectedProps<S extends object, C extends ComputedDef<S>, A extends LogicActions> = {
    state: Readonly<S & InferComputed<C>>;
    actions: A;
    emit: (intent: string, payload?: any) => Promise<void>;
};
export type LogicViewProps<T extends LogicFactory<any, any, any>> = ExtractLogicTypes<T>;
export declare function withLogic<S extends object, C extends ComputedDef<S>, A extends LogicActions, P extends object>(logic: LogicFactory<S, C, A>, View: React.ComponentType<P & InjectedProps<S, C, A>>, scope?: string, sharedBus?: any): React.FC<Omit<P, keyof InjectedProps<S, C, A>>>;
export {};
