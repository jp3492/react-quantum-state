"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Store = /** @class */ (function () {
    function Store() {
        var _this = this;
        this.value = "";
        this.setters = [];
        this.setValue = function (value) {
            _this.value = value;
            _this.setters.forEach(function (setter) { return setter(_this.value); });
        };
        this.addSetter = function (setter) {
            _this.setters = _this.setters.concat([setter]);
        };
        this.unsubscribe = function (setter) {
            _this.setters = _this.setters.filter(function (s) { return s !== setter; });
        };
    }
    return Store;
}());
var stores = {};
var setQuantumValue = function (id, value) { return stores[id].setValue(value); };
function quantumState(props, _a) {
    var id = _a.id, _b = _a.initialValue, initialValue = _b === void 0 ? null : _b, _c = _a.returnValue, returnValue = _c === void 0 ? true : _c;
    var _d = react_1.useState(""), _ = _d[0], set = _d[1];
    if (!stores.hasOwnProperty(id)) {
        stores[id] = new Store();
        stores[id].setValue(initialValue);
    }
    if (!stores[id].setters.includes(set) && returnValue) {
        stores[id].addSetter(set);
    }
    var _e = stores[id], value = _e.value, setValue = _e.setValue, unsubscribe = _e.unsubscribe;
    react_1.useEffect(function () { return function () { return unsubscribe(set); }; }, []);
    if (!returnValue) {
        return [null, setValue];
    }
    return [value, setValue];
}
exports.default = {
    quantumState: quantumState,
    setQuantumValue: setQuantumValue
};
