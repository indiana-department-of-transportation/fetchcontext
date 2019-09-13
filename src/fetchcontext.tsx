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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ctxprovider from '@indot/react-ctx-store';
import useFetch from '@indot/usefetch';

export interface ICtxReducerAction {
  type: string,
  error?: Error,
  data?: IPojo,
  loading?: boolean,
}

export interface IPojo {
  [key: string]: any,
}

export interface IUseFetchContextParams {
  LoadingComponent: React.ComponentType<{}>,
  ErrorComponent: React.ComponentType<{ error: Error }>,
  request: string | Request,
  timeout?: number,
  cache?: boolean,
}

type ReducerState = boolean | null | undefined | Error | IPojo | any[];

/**
 * @description The reducer for updating the fetch status.
 *
 * @param {Any} _state The previous state.
 * @param {Object} action The dispatched action.
 * @returns {Any} The new state.
 */
export const reducer = (_state: ReducerState, action: ICtxReducerAction): ReducerState => {
  switch (action.type) {
    case 'error':
    case 'data':
      return action[action.type];

    case 'loading':
      return true;

    default:
      throw new Error(`Unknown dispatch for ${action.type}`);
  }
};

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
export default ({
  LoadingComponent,
  ErrorComponent,
  request,
  timeout = 3000,
  cache = true,
}: IUseFetchContextParams): [() => any, React.ReactType] => {
  const [useContextDataReducer, CtxProvider] = ctxprovider<ReducerState, ICtxReducerAction>();
  const FetchRenderer = ({
    children,
  }: { children: React.ReactChild }) => {
    const [state, dispatch] = useContextDataReducer();

    // We only want to fetch this once
    const [req] = useState(request);
    const {
      data,
      error,
      isLoading,
    } = useFetch({
      request: req,
      timeout,
      cache,
    });

    if (error) {
      dispatch({ type: 'error', error });
    } else if (data && Object.keys(data).length && !isLoading && state !== data) {
      dispatch({ type: 'data', data });
    } else if (request && isLoading && state !== true) {
      dispatch({ type: 'loading' });
    }

    if (state instanceof Error) {
      return <ErrorComponent error={ state } />;
    }

    if (state === true || state === null) {
      return <LoadingComponent />;
    }

    if (Array.isArray(state) || Object.keys(state).length) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    throw new Error(`Unknown data type ${Object.prototype.toString.call(state)}`);
  };

  const Provider = ({
    children,
  }: { children: React.ReactChild }) => (
    <CtxProvider reducer={reducer} initialState={null} >
      <FetchRenderer>
      { children }
      </FetchRenderer>
    </CtxProvider>
  );

  Provider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const useContextData = () => {
    const [state] = useContextDataReducer();
    return state;
  };

  // It's assumed that consumers will give these domain-appropriate names,
  // so rather than having them alias in object destructuring we'll return
  // an array.
  return [
    useContextData,
    Provider,
  ];
};
