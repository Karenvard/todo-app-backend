import type {RequestAuth} from "./RequestAuth";

export interface TypedRequestAuthBody<T> extends RequestAuth {
    body: T
}