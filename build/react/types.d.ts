import type { ExtractLogicTypes, LogicFactory } from "intentx-runtime";
export type LogicViewProps<T extends LogicFactory<any, any, any>> = ExtractLogicTypes<T>;
