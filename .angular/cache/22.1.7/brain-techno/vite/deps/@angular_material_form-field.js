import { t as _defineProperty } from "./defineProperty-wQpB4Zl9.js";
import { Wi as setClassMetadata, kl as ɵɵdefineInjector, qn as NgModule, ro as ɵɵdefineNgModule } from "./core-D4fY0-5O.js";
import { t as BidiModule } from "./bidi-B_7QWA7a.js";
import { s as ObserversModule } from "./a11y-BIopVDGV.js";
import "./_animation-chunk-BiZmHWwH.js";
import "./platform-BSIMapkK.js";
import "./observers-private-DH4FaGMT.js";
import { a as MAT_SUFFIX, c as MatFormFieldControl, d as MatPrefix, f as MatSuffix, h as getMatFormFieldPlaceholderConflictError, i as MAT_PREFIX, l as MatHint, m as getMatFormFieldMissingControlError, n as MAT_FORM_FIELD, o as MatError, p as getMatFormFieldDuplicatedHintError, r as MAT_FORM_FIELD_DEFAULT_OPTIONS, s as MatFormField, t as MAT_ERROR, u as MatLabel } from "./_form-field-chunk-DNmxTBGF.js";
//#region node_modules/@angular/material/fesm2022/form-field.mjs
var _MatFormFieldModule;
var MatFormFieldModule = class {};
_MatFormFieldModule = MatFormFieldModule;
_defineProperty(MatFormFieldModule, "ɵfac", function MatFormFieldModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatFormFieldModule)();
});
_defineProperty(MatFormFieldModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatFormFieldModule,
	imports: [
		ObserversModule,
		MatFormField,
		MatLabel,
		MatError,
		MatHint,
		MatPrefix,
		MatSuffix
	],
	exports: [
		MatFormField,
		MatLabel,
		MatHint,
		MatError,
		MatPrefix,
		MatSuffix,
		BidiModule
	]
}));
_defineProperty(MatFormFieldModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [
	ObserversModule,
	MatFormField,
	BidiModule
] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldModule, [{
		type: NgModule,
		args: [{
			imports: [
				ObserversModule,
				MatFormField,
				MatLabel,
				MatError,
				MatHint,
				MatPrefix,
				MatSuffix
			],
			exports: [
				MatFormField,
				MatLabel,
				MatHint,
				MatError,
				MatPrefix,
				MatSuffix,
				BidiModule
			]
		}]
	}], null, null);
})();
//#endregion
export { MAT_ERROR, MAT_FORM_FIELD, MAT_FORM_FIELD_DEFAULT_OPTIONS, MAT_PREFIX, MAT_SUFFIX, MatError, MatFormField, MatFormFieldControl, MatFormFieldModule, MatHint, MatLabel, MatPrefix, MatSuffix, getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, getMatFormFieldPlaceholderConflictError };
