/**
 * fetchcontext.tsx
 *
 * @description Creates a context hook and provider for fetched data. Displays
 * loading/error components while loading or after the fetch request fails, renders
 * children on success.
 *
 * @author jasmith79@gmail.com
 * @license MIT
 */
import React from 'react';
export interface ICtxReducerAction {
    type: string;
    error?: Error;
    data?: IPojo;
    loading?: boolean;
}
export interface IPojo {
    [key: string]: any;
}
export interface IUseFetchContextParams {
    LoadingComponent: React.ComponentType<{}>;
    ErrorComponent: React.ComponentType<{
        error: Error;
    }>;
    request: string | Request;
    timeout?: number;
    cache?: boolean;
}
declare type ReducerState = boolean | null | undefined | Error | IPojo | any[];
/**
 * @description The reducer for updating the fetch status.
 *
 * @param {Any} _state The previous state.
 * @param {Object} action The dispatched action.
 * @returns {Any} The new state.
 */
export declare const reducer: (_state: ReducerState, action: ICtxReducerAction) => ReducerState;
declare const _default: ({ LoadingComponent, ErrorComponent, request, timeout, cache, }: IUseFetchContextParams) => [() => any, React.ElementType<any>];
/**
 * @description Renders the results of a fetch when available or the error
 * if the fetch fails. Displays a loading component until the fetch resolves.
 *
 * @param {Object} [props] The destructured props object.
 * @param {React.ReactNode} props.children The React child.
 * @param {number} props.timeout The optional timeout for the fetch, defaults to 3 seconds.
 * @param {boolean} props.cache Whether or not to cache the fetch result. Unlike the
 * underlying useFetch hook, here we default to true.
 * @returns {React.FunctionComponent} The FetchRenderer component.
 */
export default _default;
