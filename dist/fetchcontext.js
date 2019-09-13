"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_ctx_store_1 = __importDefault(require("@indot/react-ctx-store"));
const usefetch_1 = __importDefault(require("@indot/usefetch"));
/**
 * @description The reducer for updating the fetch status.
 *
 * @param {Any} _state The previous state.
 * @param {Object} action The dispatched action.
 * @returns {Any} The new state.
 */
exports.reducer = (_state, action) => {
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
exports.default = ({ LoadingComponent, ErrorComponent, request, timeout = 3000, cache = true, }) => {
    const [useContextDataReducer, CtxProvider] = react_ctx_store_1.default();
    const FetchRenderer = ({ children, }) => {
        const [state, dispatch] = useContextDataReducer();
        // We only want to fetch this once
        const [req] = react_1.useState(request);
        const { data, error, isLoading, } = usefetch_1.default({
            request: req,
            timeout,
            cache,
        });
        if (error) {
            dispatch({ type: 'error', error });
        }
        else if (data && Object.keys(data).length && !isLoading && state !== data) {
            dispatch({ type: 'data', data });
        }
        else if (request && isLoading && state !== true) {
            dispatch({ type: 'loading' });
        }
        if (state instanceof Error) {
            return react_1.default.createElement(ErrorComponent, { error: state });
        }
        if (state === true || state === null) {
            return react_1.default.createElement(LoadingComponent, null);
        }
        if (Array.isArray(state) || Object.keys(state).length) {
            return react_1.default.createElement(react_1.default.Fragment, null, children);
        }
        throw new Error(`Unknown data type ${Object.prototype.toString.call(state)}`);
    };
    const Provider = ({ children, }) => (react_1.default.createElement(CtxProvider, { reducer: exports.reducer, initialState: null },
        react_1.default.createElement(FetchRenderer, null, children)));
    Provider.propTypes = {
        children: prop_types_1.default.node.isRequired,
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
//# sourceMappingURL=fetchcontext.js.map