"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Reducer = /** @class */ (function () {
    function Reducer(props) {
        var _this = this;
        this.state = {};
        this.setters = [];
        this.mappers = {};
        this.options = {};
        this.dispatch = function (action) {
            var oldState = _this.state;
            _this.state = _this.reducer(_this.state, action, _this.options);
            _this.setters.forEach(function (setter, index) {
                try {
                    var newOldState = _this.mappers[index] ? _this.mappers[index](oldState) : oldState;
                    var newState = _this.mappers[index] ? _this.mappers[index](_this.state) : _this.state;
                    if (JSON.stringify(newOldState) !== JSON.stringify(newState)) {
                        setter(newState);
                    }
                }
                catch (error) {
                    throw Error(error);
                }
            });
        };
        this.unsubscribe = function (setter) {
            _this.setters = _this.setters.filter(function (s) { return s !== setter; });
        };
        this.addSetter = function (setter) {
            _this.setters = _this.setters.concat([setter]);
        };
        this.reducer = props.reducer;
        this.state = props.initialState;
        this.actions = {};
        this.options = props.options;
        Object.keys(props.actions).forEach(function (action) {
            var _a;
            _this.actions = __assign({}, _this.actions, (_a = {}, _a[action] = function (options) {
                return props.actions[action](options)(_this.dispatch);
            }, _a));
        });
    }
    return Reducer;
}());
var reducers = {};
var dispatchToReducer = function (props, _a) {
    var id = _a.id, action = _a.action;
    try {
        return reducers[id].dispatch(__assign({}, action));
    }
    catch (error) {
        throw Error(error);
    }
};
function quantumReducer(props, _a) {
    var id = _a.id, _b = _a.connect, connect = _b === void 0 ? true : _b;
    var _c = react_1.useState({}), _ = _c[0], set = _c[1];
    if (!reducers.hasOwnProperty(id)) {
        throw new Error("Store with id: " + id + " has not been initialized");
    }
    if (!reducers[id].setters.includes(set) && connect !== false) {
        reducers[id].addSetter(set);
        if (connect) {
            reducers[id].mappers[reducers[id].setters.length - 1] = connect;
        }
    }
    var _d = reducers[id], state = _d.state, dispatch = _d.dispatch, actions = _d.actions, unsubscribe = _d.unsubscribe;
    react_1.useEffect(function () { return function () { return unsubscribe(set); }; }, []);
    if (connect === false) {
        return {
            dispatch: dispatch,
            actions: actions
        };
    }
    return {
        state: state,
        dispatch: dispatch,
        actions: actions
    };
}
function initializeReducers(inits) {
    try {
        return inits.map(function (i) {
            var id = i.id, reducer = i.reducer, initialState = i.initialState, actions = i.actions, options = i.options;
            reducers[id] = new Reducer({
                reducer: reducer,
                initialState: initialState,
                actions: actions,
                options: options
            });
        });
    }
    catch (error) {
        console.log("Errro while initializing reducers");
        throw Error(error);
    }
}
exports.default = {
    initializeReducers: initializeReducers,
    quantumReducer: quantumReducer,
    dispatchToReducer: dispatchToReducer
};
