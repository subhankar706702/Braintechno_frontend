import { t as _defineProperty } from "./defineProperty-wQpB4Zl9.js";
import { Wi as setClassMetadata, ao as ɵɵdefineService, dr as Service } from "./core-D4fY0-5O.js";
//#region node_modules/@angular/cdk/fesm2022/_unique-selection-dispatcher-chunk.mjs
var _UniqueSelectionDispatcher;
var UniqueSelectionDispatcher = class {
	constructor() {
		_defineProperty(this, "_listeners", []);
	}
	notify(id, name) {
		for (let listener of this._listeners) listener(id, name);
	}
	listen(listener) {
		this._listeners.push(listener);
		return () => {
			this._listeners = this._listeners.filter((registered) => {
				return listener !== registered;
			});
		};
	}
	ngOnDestroy() {
		this._listeners = [];
	}
};
_UniqueSelectionDispatcher = UniqueSelectionDispatcher;
_defineProperty(UniqueSelectionDispatcher, "ɵfac", function UniqueSelectionDispatcher_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _UniqueSelectionDispatcher)();
});
_defineProperty(UniqueSelectionDispatcher, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _UniqueSelectionDispatcher,
	factory: _UniqueSelectionDispatcher.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UniqueSelectionDispatcher, [{ type: Service }], null, null);
})();
//#endregion
export { UniqueSelectionDispatcher as t };
