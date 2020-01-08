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
export interface IErrorComponent {
    error: Error;
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
export declare const DefaultLoadingComponent: () => JSX.Element;
export declare const DefaultErrorComponent: ({ error, }: {
    error: Error;
}) => JSX.Element;
declare const _default: ({ request, timeout, cache, LoadingComponent, ErrorComponent, }: IUseFetchContextParams) => [() => any, React.ElementType<any>];
/**
 * @description Renders the results of a fetch when available or the error
 * if the fetch fails. Displays a loading component until the fetch resolves.
 *
 * @param {Object} [props] The destructured props object.
 * @param {string} props.request The URL string or Request object to fetch.
 * @param {number} props.timeout Optional timeout in milliseconds.
 * @param {boolean} props.cache Whether or not to cache the result of the fetch.
 * @param {React.Element} props.LoadingComponent The component to display until the fetch resolves.
 * @param {React.Element} props.ErrorComponent The component to display if the fetch fails.
 * @returns {Array} A tuple of the hook to use the data, and the context provider to provide it.
 */
export default _default;
