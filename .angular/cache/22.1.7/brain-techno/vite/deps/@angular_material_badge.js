import { t as _defineProperty } from "./defineProperty-wQpB4Zl9.js";
import { Dr as ViewEncapsulation, En as ElementRef, In as Input, Lc as NgZone, O as booleanAttribute, Oc as InjectionToken, Wi as setClassMetadata, cn as Component, gc as DOCUMENT, ir as Renderer2, kl as ɵɵdefineInjector, ll as inject, no as ɵɵdefineDirective, qn as NgModule, ro as ɵɵdefineNgModule, to as ɵɵdefineComponent, wn as Directive, xa as ɵɵclassProp } from "./core-BQkULX7_.js";
import { t as BidiModule } from "./bidi-BE1zMB3V.js";
import { t as _CdkPrivateStyleLoader } from "./_style-loader-chunk-iFl81OOF.js";
import { i as InteractivityChecker, n as A11yModule, t as AriaDescriber } from "./a11y-dop1Ij2N.js";
import { t as _VisuallyHiddenLoader } from "./private-DzCrAjOT.js";
import { t as _animationsDisabled } from "./_animation-chunk-BpcDPFL7.js";
import { t as _IdGenerator } from "./_id-generator-chunk-DmVs8uFk.js";
//#region node_modules/@angular/material/fesm2022/badge.mjs
var _MatBadgeStyleLoader2;
var _MatBadge;
var _MatBadgeModule;
var MAT_BADGE_CONFIG = new InjectionToken("MAT_BADGE_CONFIG");
var BADGE_CONTENT_CLASS = "mat-badge-content";
var _MatBadgeStyleLoader = class {};
_MatBadgeStyleLoader2 = _MatBadgeStyleLoader;
_defineProperty(_MatBadgeStyleLoader, "ɵfac", function _MatBadgeStyleLoader_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatBadgeStyleLoader2)();
});
_defineProperty(_MatBadgeStyleLoader, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatBadgeStyleLoader2,
	selectors: [["ng-component"]],
	decls: 0,
	vars: 0,
	template: function _MatBadgeStyleLoader_Template(rf, ctx) {},
	styles: [".mat-badge {\n  position: relative;\n}\n.mat-badge.mat-badge {\n  overflow: visible;\n}\n\n.mat-badge-content {\n  position: absolute;\n  text-align: center;\n  display: inline-block;\n  transition: transform 200ms ease-in-out;\n  transform: scale(0.6);\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  box-sizing: border-box;\n  pointer-events: none;\n  background-color: var(--%NS%mat-badge-background-color, var(--%NS%mat-sys-error));\n  color: var(--%NS%mat-badge-text-color, var(--%NS%mat-sys-on-error));\n  font-family: var(--%NS%mat-badge-text-font, var(--%NS%mat-sys-label-small-font));\n  font-weight: var(--%NS%mat-badge-text-weight, var(--%NS%mat-sys-label-small-weight));\n  border-radius: var(--%NS%mat-badge-container-shape, var(--%NS%mat-sys-corner-full));\n}\n.mat-badge-above .mat-badge-content {\n  bottom: 100%;\n}\n.mat-badge-below .mat-badge-content {\n  top: 100%;\n}\n.mat-badge-before .mat-badge-content {\n  right: 100%;\n}\n[dir=rtl] .mat-badge-before .mat-badge-content {\n  right: auto;\n  left: 100%;\n}\n.mat-badge-after .mat-badge-content {\n  left: 100%;\n}\n[dir=rtl] .mat-badge-after .mat-badge-content {\n  left: auto;\n  right: 100%;\n}\n@media (forced-colors: active) {\n  .mat-badge-content {\n    outline: solid 1px;\n    border-radius: 0;\n  }\n}\n\n.mat-badge-disabled .mat-badge-content {\n  background-color: var(--%NS%mat-badge-disabled-state-background-color, color-mix(in srgb, var(--%NS%mat-sys-error) 38%, transparent));\n  color: var(--%NS%mat-badge-disabled-state-text-color, var(--%NS%mat-sys-on-error));\n}\n\n.mat-badge-hidden .mat-badge-content {\n  display: none;\n}\n\n.ng-animate-disabled .mat-badge-content,\n.mat-badge-content._mat-animation-noopable {\n  transition: none;\n}\n\n.mat-badge-content.mat-badge-active {\n  transform: none;\n}\n\n.mat-badge-small .mat-badge-content {\n  width: var(--%NS%mat-badge-legacy-small-size-container-size, unset);\n  height: var(--%NS%mat-badge-legacy-small-size-container-size, unset);\n  min-width: var(--%NS%mat-badge-small-size-container-size, 6px);\n  min-height: var(--%NS%mat-badge-small-size-container-size, 6px);\n  line-height: var(--%NS%mat-badge-small-size-line-height, 6px);\n  padding: var(--%NS%mat-badge-small-size-container-padding, 0);\n  font-size: var(--%NS%mat-badge-small-size-text-size, 0);\n  margin: var(--%NS%mat-badge-small-size-container-offset, -6px 0);\n}\n.mat-badge-small.mat-badge-overlap .mat-badge-content {\n  margin: var(--%NS%mat-badge-small-size-container-overlap-offset, -6px);\n}\n\n.mat-badge-medium .mat-badge-content {\n  width: var(--%NS%mat-badge-legacy-container-size, unset);\n  height: var(--%NS%mat-badge-legacy-container-size, unset);\n  min-width: var(--%NS%mat-badge-container-size, 16px);\n  min-height: var(--%NS%mat-badge-container-size, 16px);\n  line-height: var(--%NS%mat-badge-line-height, 16px);\n  padding: var(--%NS%mat-badge-container-padding, 0 4px);\n  font-size: var(--%NS%mat-badge-text-size, var(--%NS%mat-sys-label-small-size));\n  margin: var(--%NS%mat-badge-container-offset, -12px 0);\n}\n.mat-badge-medium.mat-badge-overlap .mat-badge-content {\n  margin: var(--%NS%mat-badge-container-overlap-offset, -12px);\n}\n\n.mat-badge-large .mat-badge-content {\n  width: var(--%NS%mat-badge-legacy-large-size-container-size, unset);\n  height: var(--%NS%mat-badge-legacy-large-size-container-size, unset);\n  min-width: var(--%NS%mat-badge-large-size-container-size, 16px);\n  min-height: var(--%NS%mat-badge-large-size-container-size, 16px);\n  line-height: var(--%NS%mat-badge-large-size-line-height, 16px);\n  padding: var(--%NS%mat-badge-large-size-container-padding, 0 4px);\n  font-size: var(--%NS%mat-badge-large-size-text-size, var(--%NS%mat-sys-label-small-size));\n  margin: var(--%NS%mat-badge-large-size-container-offset, -12px 0);\n}\n.mat-badge-large.mat-badge-overlap .mat-badge-content {\n  margin: var(--%NS%mat-badge-large-size-container-overlap-offset, -12px);\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_MatBadgeStyleLoader, [{
		type: Component,
		args: [{
			encapsulation: ViewEncapsulation.None,
			template: "",
			styles: [".mat-badge {\n  position: relative;\n}\n.mat-badge.mat-badge {\n  overflow: visible;\n}\n\n.mat-badge-content {\n  position: absolute;\n  text-align: center;\n  display: inline-block;\n  transition: transform 200ms ease-in-out;\n  transform: scale(0.6);\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  box-sizing: border-box;\n  pointer-events: none;\n  background-color: var(--mat-badge-background-color, var(--mat-sys-error));\n  color: var(--mat-badge-text-color, var(--mat-sys-on-error));\n  font-family: var(--mat-badge-text-font, var(--mat-sys-label-small-font));\n  font-weight: var(--mat-badge-text-weight, var(--mat-sys-label-small-weight));\n  border-radius: var(--mat-badge-container-shape, var(--mat-sys-corner-full));\n}\n.mat-badge-above .mat-badge-content {\n  bottom: 100%;\n}\n.mat-badge-below .mat-badge-content {\n  top: 100%;\n}\n.mat-badge-before .mat-badge-content {\n  right: 100%;\n}\n[dir=rtl] .mat-badge-before .mat-badge-content {\n  right: auto;\n  left: 100%;\n}\n.mat-badge-after .mat-badge-content {\n  left: 100%;\n}\n[dir=rtl] .mat-badge-after .mat-badge-content {\n  left: auto;\n  right: 100%;\n}\n@media (forced-colors: active) {\n  .mat-badge-content {\n    outline: solid 1px;\n    border-radius: 0;\n  }\n}\n\n.mat-badge-disabled .mat-badge-content {\n  background-color: var(--mat-badge-disabled-state-background-color, color-mix(in srgb, var(--mat-sys-error) 38%, transparent));\n  color: var(--mat-badge-disabled-state-text-color, var(--mat-sys-on-error));\n}\n\n.mat-badge-hidden .mat-badge-content {\n  display: none;\n}\n\n.ng-animate-disabled .mat-badge-content,\n.mat-badge-content._mat-animation-noopable {\n  transition: none;\n}\n\n.mat-badge-content.mat-badge-active {\n  transform: none;\n}\n\n.mat-badge-small .mat-badge-content {\n  width: var(--mat-badge-legacy-small-size-container-size, unset);\n  height: var(--mat-badge-legacy-small-size-container-size, unset);\n  min-width: var(--mat-badge-small-size-container-size, 6px);\n  min-height: var(--mat-badge-small-size-container-size, 6px);\n  line-height: var(--mat-badge-small-size-line-height, 6px);\n  padding: var(--mat-badge-small-size-container-padding, 0);\n  font-size: var(--mat-badge-small-size-text-size, 0);\n  margin: var(--mat-badge-small-size-container-offset, -6px 0);\n}\n.mat-badge-small.mat-badge-overlap .mat-badge-content {\n  margin: var(--mat-badge-small-size-container-overlap-offset, -6px);\n}\n\n.mat-badge-medium .mat-badge-content {\n  width: var(--mat-badge-legacy-container-size, unset);\n  height: var(--mat-badge-legacy-container-size, unset);\n  min-width: var(--mat-badge-container-size, 16px);\n  min-height: var(--mat-badge-container-size, 16px);\n  line-height: var(--mat-badge-line-height, 16px);\n  padding: var(--mat-badge-container-padding, 0 4px);\n  font-size: var(--mat-badge-text-size, var(--mat-sys-label-small-size));\n  margin: var(--mat-badge-container-offset, -12px 0);\n}\n.mat-badge-medium.mat-badge-overlap .mat-badge-content {\n  margin: var(--mat-badge-container-overlap-offset, -12px);\n}\n\n.mat-badge-large .mat-badge-content {\n  width: var(--mat-badge-legacy-large-size-container-size, unset);\n  height: var(--mat-badge-legacy-large-size-container-size, unset);\n  min-width: var(--mat-badge-large-size-container-size, 16px);\n  min-height: var(--mat-badge-large-size-container-size, 16px);\n  line-height: var(--mat-badge-large-size-line-height, 16px);\n  padding: var(--mat-badge-large-size-container-padding, 0 4px);\n  font-size: var(--mat-badge-large-size-text-size, var(--mat-sys-label-small-size));\n  margin: var(--mat-badge-large-size-container-offset, -12px 0);\n}\n.mat-badge-large.mat-badge-overlap .mat-badge-content {\n  margin: var(--mat-badge-large-size-container-overlap-offset, -12px);\n}\n"]
		}]
	}], null, null);
})();
var MatBadge = class {
	get color() {
		return this._color;
	}
	set color(value) {
		this._setColor(value);
		this._color = value;
	}
	get content() {
		return this._content;
	}
	set content(newContent) {
		this._updateRenderedContent(newContent);
	}
	get description() {
		return this._description;
	}
	set description(newDescription) {
		this._updateDescription(newDescription);
	}
	constructor() {
		var _config$overlap;
		_defineProperty(this, "_ngZone", inject(NgZone));
		_defineProperty(this, "_elementRef", inject(ElementRef));
		_defineProperty(this, "_ariaDescriber", inject(AriaDescriber));
		_defineProperty(this, "_renderer", inject(Renderer2));
		_defineProperty(this, "_animationsDisabled", _animationsDisabled());
		_defineProperty(this, "_idGenerator", inject(_IdGenerator));
		_defineProperty(this, "_color", void 0);
		_defineProperty(this, "overlap", void 0);
		_defineProperty(this, "disabled", false);
		_defineProperty(this, "position", void 0);
		_defineProperty(this, "_content", void 0);
		_defineProperty(this, "_description", void 0);
		_defineProperty(this, "size", void 0);
		_defineProperty(this, "hidden", false);
		_defineProperty(this, "_badgeElement", void 0);
		_defineProperty(this, "_inlineBadgeDescription", void 0);
		_defineProperty(this, "_isInitialized", false);
		_defineProperty(this, "_interactivityChecker", inject(InteractivityChecker));
		_defineProperty(this, "_document", inject(DOCUMENT));
		const config = inject(MAT_BADGE_CONFIG, { optional: true });
		const styleLoader = inject(_CdkPrivateStyleLoader);
		styleLoader.load(_MatBadgeStyleLoader);
		styleLoader.load(_VisuallyHiddenLoader);
		this._color = (config === null || config === void 0 ? void 0 : config.color) || "primary";
		this.overlap = (_config$overlap = config === null || config === void 0 ? void 0 : config.overlap) !== null && _config$overlap !== void 0 ? _config$overlap : true;
		this.position = (config === null || config === void 0 ? void 0 : config.position) || "above after";
		this.size = (config === null || config === void 0 ? void 0 : config.size) || "medium";
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			const nativeElement = this._elementRef.nativeElement;
			if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) throw Error("matBadge must be attached to an element node.");
		}
	}
	isAbove() {
		return this.position.indexOf("below") === -1;
	}
	isAfter() {
		return this.position.indexOf("before") === -1;
	}
	getBadgeElement() {
		return this._badgeElement;
	}
	ngOnInit() {
		this._clearExistingBadges();
		if (this.content && !this._badgeElement) {
			this._badgeElement = this._createBadgeElement();
			this._updateRenderedContent(this.content);
		}
		this._isInitialized = true;
	}
	ngAfterViewInit() {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			const nativeElement = this._elementRef.nativeElement;
			if (nativeElement.tagName.toLowerCase() === "mat-icon" && nativeElement.getAttribute("aria-hidden") === "true") console.warn(`Detected a matBadge on an "aria-hidden" "<mat-icon>". Consider setting aria-hidden="false" in order to surface the information assistive technology.\n${nativeElement.outerHTML}`);
		}
	}
	ngOnDestroy() {
		if (this._renderer.destroyNode) {
			var _this$_inlineBadgeDes;
			this._renderer.destroyNode(this._badgeElement);
			(_this$_inlineBadgeDes = this._inlineBadgeDescription) === null || _this$_inlineBadgeDes === void 0 || _this$_inlineBadgeDes.remove();
		}
		this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
	}
	_isHostInteractive() {
		return this._interactivityChecker.isFocusable(this._elementRef.nativeElement, { ignoreVisibility: true });
	}
	_createBadgeElement() {
		const badgeElement = this._renderer.createElement("span");
		const activeClass = "mat-badge-active";
		badgeElement.setAttribute("id", this._idGenerator.getId("mat-badge-content-"));
		badgeElement.setAttribute("aria-hidden", "true");
		badgeElement.classList.add(BADGE_CONTENT_CLASS);
		if (this._animationsDisabled) badgeElement.classList.add("_mat-animation-noopable");
		this._elementRef.nativeElement.appendChild(badgeElement);
		if (typeof requestAnimationFrame === "function" && !this._animationsDisabled) this._ngZone.runOutsideAngular(() => {
			requestAnimationFrame(() => {
				badgeElement.classList.add(activeClass);
			});
		});
		else badgeElement.classList.add(activeClass);
		return badgeElement;
	}
	_updateRenderedContent(newContent) {
		const newContentNormalized = `${newContent !== null && newContent !== void 0 ? newContent : ""}`.trim();
		if (this._isInitialized && newContentNormalized && !this._badgeElement) this._badgeElement = this._createBadgeElement();
		if (this._badgeElement) this._badgeElement.textContent = newContentNormalized;
		this._content = newContentNormalized;
	}
	_updateDescription(newDescription) {
		this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
		if (!newDescription || this._isHostInteractive()) this._removeInlineDescription();
		this._description = newDescription;
		if (this._isHostInteractive()) this._ariaDescriber.describe(this._elementRef.nativeElement, newDescription);
		else this._updateInlineDescription();
	}
	_updateInlineDescription() {
		var _this$_badgeElement;
		if (!this._inlineBadgeDescription) {
			this._inlineBadgeDescription = this._document.createElement("span");
			this._inlineBadgeDescription.classList.add("cdk-visually-hidden");
		}
		this._inlineBadgeDescription.textContent = this.description;
		(_this$_badgeElement = this._badgeElement) === null || _this$_badgeElement === void 0 || _this$_badgeElement.appendChild(this._inlineBadgeDescription);
	}
	_removeInlineDescription() {
		var _this$_inlineBadgeDes2;
		(_this$_inlineBadgeDes2 = this._inlineBadgeDescription) === null || _this$_inlineBadgeDes2 === void 0 || _this$_inlineBadgeDes2.remove();
		this._inlineBadgeDescription = void 0;
	}
	_setColor(colorPalette) {
		const classList = this._elementRef.nativeElement.classList;
		classList.remove(`mat-badge-${this._color}`);
		if (colorPalette) classList.add(`mat-badge-${colorPalette}`);
	}
	_clearExistingBadges() {
		const badges = this._elementRef.nativeElement.querySelectorAll(`:scope > .${BADGE_CONTENT_CLASS}`);
		for (const badgeElement of Array.from(badges)) if (badgeElement !== this._badgeElement) badgeElement.remove();
	}
};
_MatBadge = MatBadge;
_defineProperty(MatBadge, "ɵfac", function MatBadge_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatBadge)();
});
_defineProperty(MatBadge, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatBadge,
	selectors: [[
		"",
		"matBadge",
		""
	]],
	hostAttrs: [1, "mat-badge"],
	hostVars: 20,
	hostBindings: function MatBadge_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵclassProp("mat-badge-overlap", ctx.overlap)("mat-badge-above", ctx.isAbove())("mat-badge-below", !ctx.isAbove())("mat-badge-before", !ctx.isAfter())("mat-badge-after", ctx.isAfter())("mat-badge-small", ctx.size === "small")("mat-badge-medium", ctx.size === "medium")("mat-badge-large", ctx.size === "large")("mat-badge-hidden", ctx.hidden || !ctx.content)("mat-badge-disabled", ctx.disabled);
	},
	inputs: {
		color: [
			0,
			"matBadgeColor",
			"color"
		],
		overlap: [
			2,
			"matBadgeOverlap",
			"overlap",
			booleanAttribute
		],
		disabled: [
			2,
			"matBadgeDisabled",
			"disabled",
			booleanAttribute
		],
		position: [
			0,
			"matBadgePosition",
			"position"
		],
		content: [
			0,
			"matBadge",
			"content"
		],
		description: [
			0,
			"matBadgeDescription",
			"description"
		],
		size: [
			0,
			"matBadgeSize",
			"size"
		],
		hidden: [
			2,
			"matBadgeHidden",
			"hidden",
			booleanAttribute
		]
	}
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatBadge, [{
		type: Directive,
		args: [{
			selector: "[matBadge]",
			host: {
				"class": "mat-badge",
				"[class.mat-badge-overlap]": "overlap",
				"[class.mat-badge-above]": "isAbove()",
				"[class.mat-badge-below]": "!isAbove()",
				"[class.mat-badge-before]": "!isAfter()",
				"[class.mat-badge-after]": "isAfter()",
				"[class.mat-badge-small]": "size === \"small\"",
				"[class.mat-badge-medium]": "size === \"medium\"",
				"[class.mat-badge-large]": "size === \"large\"",
				"[class.mat-badge-hidden]": "hidden || !content",
				"[class.mat-badge-disabled]": "disabled"
			}
		}]
	}], () => [], {
		color: [{
			type: Input,
			args: ["matBadgeColor"]
		}],
		overlap: [{
			type: Input,
			args: [{
				alias: "matBadgeOverlap",
				transform: booleanAttribute
			}]
		}],
		disabled: [{
			type: Input,
			args: [{
				alias: "matBadgeDisabled",
				transform: booleanAttribute
			}]
		}],
		position: [{
			type: Input,
			args: ["matBadgePosition"]
		}],
		content: [{
			type: Input,
			args: ["matBadge"]
		}],
		description: [{
			type: Input,
			args: ["matBadgeDescription"]
		}],
		size: [{
			type: Input,
			args: ["matBadgeSize"]
		}],
		hidden: [{
			type: Input,
			args: [{
				alias: "matBadgeHidden",
				transform: booleanAttribute
			}]
		}]
	});
})();
var MatBadgeModule = class {};
_MatBadgeModule = MatBadgeModule;
_defineProperty(MatBadgeModule, "ɵfac", function MatBadgeModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatBadgeModule)();
});
_defineProperty(MatBadgeModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatBadgeModule,
	imports: [
		A11yModule,
		MatBadge,
		_MatBadgeStyleLoader
	],
	exports: [MatBadge, BidiModule]
}));
_defineProperty(MatBadgeModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [A11yModule, BidiModule] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatBadgeModule, [{
		type: NgModule,
		args: [{
			imports: [
				A11yModule,
				MatBadge,
				_MatBadgeStyleLoader
			],
			exports: [MatBadge, BidiModule]
		}]
	}], null, null);
})();
//#endregion
export { MAT_BADGE_CONFIG, MatBadge, MatBadgeModule };
