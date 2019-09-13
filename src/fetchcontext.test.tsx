/**
 * fetchcontext.test.tsx
 * 
 * @description Creates a context hook and provider for fetched data. Displays
 * loading/error components while loading or after the fetch request fails, renders
 * children on success.
 *
 * @author jasmith79@gmail.com
 * @license MIT
 */

import 'jsdom-global/register';
import '@testing-library/jest-dom/extend-expect';

import React from 'react';
import fetchPonyfill from 'fetch-ponyfill';

import { render } from '@testing-library/react'

import usefetchcontext from './fetchcontext';

const ErrorComponent = ({ error }: { error: Error }) => <div>{'' + error}</div>;
const LoadingComponent = () => <div>  Loading</div>;
const TestComponent = ({ data }: { data: any }) => <div>{JSON.stringify(data)}</div>;

const BASIC_CONF = {
  ErrorComponent,
  LoadingComponent,
};

const globalThis = (new Function('return this;')());
const { Request } = fetchPonyfill();
globalThis.Request = Request;

const fakeResponseFactory = async (returnValue: any, status: number = 200) => ({
  json: () => new Promise(res => setTimeout(res, 0, returnValue)),
  status,
});

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

describe('Hook/Context Factory', () => {
  it('should require a loading, error component and request url', async () => {
    const [useData, CtxProvider] = usefetchcontext({
      ...BASIC_CONF,
      request: 'http://indy-somethingorother-1.indot.org',
    });
    const testData = 'hello world';
    globalThis.fetch.mockReturnValueOnce(fakeResponseFactory(testData));
    const TestComp = () => {
      const data = useData();
      return <TestComponent data={data} />;
    };

    const { container } = render(<CtxProvider><TestComp /></CtxProvider>);
    expect(container.querySelector('div')).toHaveTextContent('Loading');
    await new Promise(res => setTimeout(res, 10));
    expect(container.querySelector('div')).toHaveTextContent('hello world');
    return;
  });

  it('should render the error element if the request fails', () => {
    globalThis.fetch = (...args: any[]) => { throw new Error('foo!') };
    const [useData, CtxProvider] = usefetchcontext({
      ...BASIC_CONF,
      request: 'http://indy-somethingorother-2.indot.org',
    });
    const TestComp = () => {
      const data = useData();
      return <TestComponent data={data} />;
    };

    const { container } = render(<CtxProvider><TestComp /></CtxProvider>);
    expect(container.querySelector('div')).toHaveTextContent('foo!');
  });

  it('should render error element if the request response code is < 200', async () => {
    globalThis.fetch.mockReturnValueOnce(fakeResponseFactory('foo', 199));
    const [useData, CtxProvider] = usefetchcontext({
      ...BASIC_CONF,
      request: 'http://indy-somethingorother-3.indot.org',
    });

    const TestComp = () => {
      const data = useData();
      return <TestComponent data={data} />;
    };

    const { container } = render(<CtxProvider><TestComp /></CtxProvider>);
    await new Promise(res => setTimeout(res, 10));
    expect(container.querySelector('div')).toHaveTextContent('HTTP error 199');
  });

  it('should render the error element if the request response code is > 399', async () => {
    globalThis.fetch.mockReturnValueOnce(fakeResponseFactory('foo', 403));
    const [useData, CtxProvider] = usefetchcontext({
      ...BASIC_CONF,
      request: 'http://indy-somethingorother-4.indot.org',
    });

    const TestComp = () => {
      const data = useData();
      return <TestComponent data={data} />;
    };

    const { container } = render(<CtxProvider><TestComp /></CtxProvider>);
    await new Promise(res => setTimeout(res, 10));
    expect(container.querySelector('div')).toHaveTextContent('HTTP error 403');
  });
});