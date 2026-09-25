import { t as _defineProperty } from "./defineProperty-wQpB4Zl9.js";
import { Wi as setClassMetadata, kl as ɵɵdefineInjector, qn as NgModule, ro as ɵɵdefineNgModule } from "./core-D4fY0-5O.js";
import { t as BidiModule } from "./bidi-B_7QWA7a.js";
import { n as MatRipple } from "./_ripple-chunk-ChB87teh.js";
//#region node_modules/@angular/material/fesm2022/_ripple-module-chunk.mjs
var _MatRippleModule;
var MatRippleModule = class {};
_MatRippleModule = MatRippleModule;
_defineProperty(MatRippleModule, "ɵfac", function MatRippleModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatRippleModule)();
});
_defineProperty(MatRippleModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatRippleModule,
	imports: [MatRipple],
	exports: [MatRipple, BidiModule]
}));
_defineProperty(MatRippleModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [BidiModule] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRippleModule, [{
		type: NgModule,
		args: [{
			imports: [MatRipple],
			exports: [MatRipple, BidiModule]
		}]
	}], null, null);
})();
//#endregion
export { MatRippleModule as t };
