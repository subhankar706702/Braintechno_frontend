import { t as _defineProperty } from "./defineProperty-wQpB4Zl9.js";
import { Wi as setClassMetadata, kl as ɵɵdefineInjector, qn as NgModule, ro as ɵɵdefineNgModule } from "./core-D4fY0-5O.js";
import { t as BidiModule } from "./bidi-B_7QWA7a.js";
import { t as MatPseudoCheckbox } from "./_pseudo-checkbox-chunk-D0wtgxpI.js";
//#region node_modules/@angular/material/fesm2022/_pseudo-checkbox-module-chunk.mjs
var _MatPseudoCheckboxModule;
var MatPseudoCheckboxModule = class {};
_MatPseudoCheckboxModule = MatPseudoCheckboxModule;
_defineProperty(MatPseudoCheckboxModule, "ɵfac", function MatPseudoCheckboxModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatPseudoCheckboxModule)();
});
_defineProperty(MatPseudoCheckboxModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatPseudoCheckboxModule,
	imports: [MatPseudoCheckbox],
	exports: [MatPseudoCheckbox, BidiModule]
}));
_defineProperty(MatPseudoCheckboxModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [BidiModule] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPseudoCheckboxModule, [{
		type: NgModule,
		args: [{
			imports: [MatPseudoCheckbox],
			exports: [MatPseudoCheckbox, BidiModule]
		}]
	}], null, null);
})();
//#endregion
export { MatPseudoCheckboxModule as t };
