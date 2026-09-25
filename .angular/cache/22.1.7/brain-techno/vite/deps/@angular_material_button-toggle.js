import { t as _defineProperty } from "./defineProperty-wQpB4Zl9.js";
import { $n as Output, Ca as ɵɵconditional, Cl as signal, Dr as ViewEncapsulation, Ea as ɵɵcontentQuery, En as ElementRef, In as Input, O as booleanAttribute, Oc as InjectionToken, S as ViewChild, Sc as EventEmitter, Ta as ɵɵconditionalCreate, Wi as setClassMetadata, Xo as ɵɵloadQuery, Yo as ɵɵlistener, Zo as ɵɵnextContext, a as ContentChildren, al as forwardRef, as as ɵɵprojectionDef, bo as ɵɵelementEnd, bs as ɵɵreference, cn as Component, da as ɵɵadvance, f as HostAttributeToken, go as ɵɵelement, is as ɵɵprojection, kl as ɵɵdefineInjector, ll as inject, no as ɵɵdefineDirective, os as ɵɵproperty, qn as NgModule, r as ChangeDetectorRef, ro as ɵɵdefineNgModule, sc as ɵɵviewQuery, to as ɵɵdefineComponent, ua as ɵɵProvidersFeature, vs as ɵɵqueryRefresh, wn as Directive, xa as ɵɵclassProp, xo as ɵɵelementStart, ya as ɵɵattribute } from "./core-D4fY0-5O.js";
import { i as Directionality, t as BidiModule } from "./bidi-B_7QWA7a.js";
import { t as _CdkPrivateStyleLoader } from "./_style-loader-chunk-Dcdj5QOX.js";
import { NG_VALUE_ACCESSOR } from "./@angular_forms.js";
import { l as FocusMonitor } from "./a11y-BIopVDGV.js";
import "./private-s4SC1d6c.js";
import { t as _animationsDisabled } from "./_animation-chunk-BiZmHWwH.js";
import { t as hasModifierKey } from "./keycodes-BvDTxKgo.js";
import { t as _IdGenerator } from "./_id-generator-chunk-IXLC5YKA.js";
import { n as SelectionModel, t as MatPseudoCheckbox } from "./_pseudo-checkbox-chunk-D0wtgxpI.js";
import { t as _StructuralStylesLoader } from "./_structural-styles-chunk-DtQOZjFP.js";
import "./platform-BSIMapkK.js";
import { n as MatRipple } from "./_ripple-chunk-ChB87teh.js";
import { t as MatRippleModule } from "./_ripple-module-chunk-CQ4PRYCi.js";
//#region node_modules/@angular/material/fesm2022/button-toggle.mjs
var _MatButtonToggleGroup;
var _MatButtonToggle;
var _MatButtonToggleModule;
var _c0 = ["button"];
var _c1 = ["*"];
function MatButtonToggle_Conditional_2_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵelementStart(0, "div", 2);
		ɵɵelement(1, "mat-pseudo-checkbox", 6);
		ɵɵelementEnd();
	}
	if (rf & 2) {
		const ctx_r0 = ɵɵnextContext();
		ɵɵadvance();
		ɵɵproperty("disabled", ctx_r0.disabled);
	}
}
var MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS = new InjectionToken("MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS", {
	providedIn: "root",
	factory: () => ({
		hideSingleSelectionIndicator: false,
		hideMultipleSelectionIndicator: false,
		disabledInteractive: false
	})
});
var MAT_BUTTON_TOGGLE_GROUP = new InjectionToken("MatButtonToggleGroup");
var MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => MatButtonToggleGroup),
	multi: true
};
var MatButtonToggleChange = class {
	constructor(source, value) {
		_defineProperty(this, "source", void 0);
		_defineProperty(this, "value", void 0);
		this.source = source;
		this.value = value;
	}
};
var MatButtonToggleGroup = class {
	get name() {
		return this._name;
	}
	set name(value) {
		this._name = value;
		this._markButtonsForCheck();
	}
	get value() {
		const selected = this._selectionModel ? this._selectionModel.selected : [];
		if (this.multiple) return selected.map((toggle) => toggle.value);
		return selected[0] ? selected[0].value : void 0;
	}
	set value(newValue) {
		this._setSelectionByValue(newValue);
		this.valueChange.emit(this.value);
	}
	get selected() {
		const selected = this._selectionModel ? this._selectionModel.selected : [];
		return this.multiple ? selected : selected[0] || null;
	}
	get multiple() {
		return this._multiple;
	}
	set multiple(value) {
		this._multiple = value;
		this._markButtonsForCheck();
	}
	get disabled() {
		return this._disabled;
	}
	set disabled(value) {
		this._disabled = value;
		this._markButtonsForCheck();
	}
	get disabledInteractive() {
		return this._disabledInteractive;
	}
	set disabledInteractive(value) {
		this._disabledInteractive = value;
		this._markButtonsForCheck();
	}
	get dir() {
		return this._dir && this._dir.value === "rtl" ? "rtl" : "ltr";
	}
	get hideSingleSelectionIndicator() {
		return this._hideSingleSelectionIndicator;
	}
	set hideSingleSelectionIndicator(value) {
		this._hideSingleSelectionIndicator = value;
		this._markButtonsForCheck();
	}
	get hideMultipleSelectionIndicator() {
		return this._hideMultipleSelectionIndicator;
	}
	set hideMultipleSelectionIndicator(value) {
		this._hideMultipleSelectionIndicator = value;
		this._markButtonsForCheck();
	}
	constructor() {
		var _defaultOptions$hideS, _defaultOptions$hideM;
		_defineProperty(this, "_changeDetector", inject(ChangeDetectorRef));
		_defineProperty(this, "_dir", inject(Directionality, { optional: true }));
		_defineProperty(this, "_multiple", false);
		_defineProperty(this, "_disabled", false);
		_defineProperty(this, "_disabledInteractive", false);
		_defineProperty(this, "_selectionModel", void 0);
		_defineProperty(this, "_rawValue", void 0);
		_defineProperty(this, "_controlValueAccessorChangeFn", () => {});
		_defineProperty(this, "_onTouched", () => {});
		_defineProperty(this, "_buttonToggles", void 0);
		_defineProperty(this, "appearance", void 0);
		_defineProperty(this, "_name", inject(_IdGenerator).getId("mat-button-toggle-group-"));
		_defineProperty(this, "vertical", false);
		_defineProperty(this, "valueChange", new EventEmitter());
		_defineProperty(this, "change", new EventEmitter());
		_defineProperty(this, "_hideSingleSelectionIndicator", void 0);
		_defineProperty(this, "_hideMultipleSelectionIndicator", void 0);
		const defaultOptions = inject(MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, { optional: true });
		this.appearance = defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : "standard";
		this._hideSingleSelectionIndicator = (_defaultOptions$hideS = defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.hideSingleSelectionIndicator) !== null && _defaultOptions$hideS !== void 0 ? _defaultOptions$hideS : false;
		this._hideMultipleSelectionIndicator = (_defaultOptions$hideM = defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.hideMultipleSelectionIndicator) !== null && _defaultOptions$hideM !== void 0 ? _defaultOptions$hideM : false;
	}
	ngOnInit() {
		this._selectionModel = new SelectionModel(this.multiple, void 0, false);
	}
	ngAfterContentInit() {
		this._selectionModel.select(...this._buttonToggles.filter((toggle) => toggle.checked));
		if (!this.multiple) this._initializeTabIndex();
	}
	writeValue(value) {
		this.value = value;
		this._changeDetector.markForCheck();
	}
	registerOnChange(fn) {
		this._controlValueAccessorChangeFn = fn;
	}
	registerOnTouched(fn) {
		this._onTouched = fn;
	}
	setDisabledState(isDisabled) {
		this.disabled = isDisabled;
	}
	_keydown(event) {
		if (this.multiple || this.disabled || hasModifierKey(event)) return;
		const buttonId = event.target.id;
		const index = this._buttonToggles.toArray().findIndex((toggle) => {
			return toggle.buttonId === buttonId;
		});
		let nextButton = null;
		switch (event.keyCode) {
			case 32:
			case 13:
				nextButton = this._buttonToggles.get(index) || null;
				break;
			case 38:
				nextButton = this._getNextButton(index, -1);
				break;
			case 37:
				nextButton = this._getNextButton(index, this.dir === "ltr" ? -1 : 1);
				break;
			case 40:
				nextButton = this._getNextButton(index, 1);
				break;
			case 39:
				nextButton = this._getNextButton(index, this.dir === "ltr" ? 1 : -1);
				break;
			default: return;
		}
		if (nextButton) {
			event.preventDefault();
			nextButton._onButtonClick();
			nextButton.focus();
		}
	}
	_emitChangeEvent(toggle) {
		const event = new MatButtonToggleChange(toggle, this.value);
		this._rawValue = event.value;
		this._controlValueAccessorChangeFn(event.value);
		this.change.emit(event);
	}
	_syncButtonToggle(toggle, select, isUserInput = false, deferEvents = false) {
		if (!this.multiple && this.selected && !toggle.checked) this.selected.checked = false;
		if (this._selectionModel) if (select) this._selectionModel.select(toggle);
		else this._selectionModel.deselect(toggle);
		else deferEvents = true;
		if (deferEvents) Promise.resolve().then(() => this._updateModelValue(toggle, isUserInput));
		else this._updateModelValue(toggle, isUserInput);
	}
	_isSelected(toggle) {
		return this._selectionModel && this._selectionModel.isSelected(toggle);
	}
	_isPrechecked(toggle) {
		if (typeof this._rawValue === "undefined") return false;
		if (this.multiple && Array.isArray(this._rawValue)) return this._rawValue.some((value) => toggle.value != null && value === toggle.value);
		return toggle.value === this._rawValue;
	}
	_initializeTabIndex() {
		this._buttonToggles.forEach((toggle) => {
			toggle.tabIndex = -1;
		});
		if (this.selected) this.selected.tabIndex = 0;
		else for (let i = 0; i < this._buttonToggles.length; i++) {
			const toggle = this._buttonToggles.get(i);
			if (!toggle.disabled) {
				toggle.tabIndex = 0;
				break;
			}
		}
	}
	_getNextButton(startIndex, offset) {
		const items = this._buttonToggles;
		for (let i = 1; i <= items.length; i++) {
			const index = (startIndex + offset * i + items.length) % items.length;
			const item = items.get(index);
			if (item && !item.disabled) return item;
		}
		return null;
	}
	_setSelectionByValue(value) {
		this._rawValue = value;
		if (!this._buttonToggles) return;
		const toggles = this._buttonToggles.toArray();
		if (this.multiple && value) {
			if (!Array.isArray(value) && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error("Value must be an array in multiple-selection mode.");
			this._clearSelection();
			value.forEach((currentValue) => this._selectValue(currentValue, toggles));
		} else {
			this._clearSelection();
			this._selectValue(value, toggles);
		}
		if (!this.multiple && toggles.every((toggle) => toggle.tabIndex === -1)) {
			for (const toggle of toggles) if (!toggle.disabled) {
				toggle.tabIndex = 0;
				break;
			}
		}
	}
	_clearSelection() {
		this._selectionModel.clear();
		this._buttonToggles.forEach((toggle) => {
			toggle.checked = false;
			if (!this.multiple) toggle.tabIndex = -1;
		});
	}
	_selectValue(value, toggles) {
		for (const toggle of toggles) if (toggle.value === value) {
			toggle.checked = true;
			this._selectionModel.select(toggle);
			if (!this.multiple) toggle.tabIndex = 0;
			break;
		}
	}
	_updateModelValue(toggle, isUserInput) {
		if (isUserInput) this._emitChangeEvent(toggle);
		this.valueChange.emit(this.value);
	}
	_markButtonsForCheck() {
		var _this$_buttonToggles;
		(_this$_buttonToggles = this._buttonToggles) === null || _this$_buttonToggles === void 0 || _this$_buttonToggles.forEach((toggle) => toggle._markForCheck());
	}
};
_MatButtonToggleGroup = MatButtonToggleGroup;
_defineProperty(MatButtonToggleGroup, "ɵfac", function MatButtonToggleGroup_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatButtonToggleGroup)();
});
_defineProperty(MatButtonToggleGroup, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatButtonToggleGroup,
	selectors: [["mat-button-toggle-group"]],
	contentQueries: function MatButtonToggleGroup_ContentQueries(rf, ctx, dirIndex) {
		if (rf & 1) ɵɵcontentQuery(dirIndex, MatButtonToggle, 5);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._buttonToggles = _t);
		}
	},
	hostAttrs: [1, "mat-button-toggle-group"],
	hostVars: 6,
	hostBindings: function MatButtonToggleGroup_HostBindings(rf, ctx) {
		if (rf & 1) ɵɵlistener("keydown", function MatButtonToggleGroup_keydown_HostBindingHandler($event) {
			return ctx._keydown($event);
		});
		if (rf & 2) {
			ɵɵattribute("role", ctx.multiple ? "group" : "radiogroup")("aria-disabled", ctx.disabled);
			ɵɵclassProp("mat-button-toggle-vertical", ctx.vertical)("mat-button-toggle-group-appearance-standard", ctx.appearance === "standard");
		}
	},
	inputs: {
		appearance: "appearance",
		name: "name",
		vertical: [
			2,
			"vertical",
			"vertical",
			booleanAttribute
		],
		value: "value",
		multiple: [
			2,
			"multiple",
			"multiple",
			booleanAttribute
		],
		disabled: [
			2,
			"disabled",
			"disabled",
			booleanAttribute
		],
		disabledInteractive: [
			2,
			"disabledInteractive",
			"disabledInteractive",
			booleanAttribute
		],
		hideSingleSelectionIndicator: [
			2,
			"hideSingleSelectionIndicator",
			"hideSingleSelectionIndicator",
			booleanAttribute
		],
		hideMultipleSelectionIndicator: [
			2,
			"hideMultipleSelectionIndicator",
			"hideMultipleSelectionIndicator",
			booleanAttribute
		]
	},
	outputs: {
		valueChange: "valueChange",
		change: "change"
	},
	exportAs: ["matButtonToggleGroup"],
	features: [ɵɵProvidersFeature([MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, {
		provide: MAT_BUTTON_TOGGLE_GROUP,
		useExisting: _MatButtonToggleGroup
	}])]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButtonToggleGroup, [{
		type: Directive,
		args: [{
			selector: "mat-button-toggle-group",
			providers: [MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, {
				provide: MAT_BUTTON_TOGGLE_GROUP,
				useExisting: MatButtonToggleGroup
			}],
			host: {
				"class": "mat-button-toggle-group",
				"(keydown)": "_keydown($event)",
				"[attr.role]": "multiple ? 'group' : 'radiogroup'",
				"[attr.aria-disabled]": "disabled",
				"[class.mat-button-toggle-vertical]": "vertical",
				"[class.mat-button-toggle-group-appearance-standard]": "appearance === \"standard\""
			},
			exportAs: "matButtonToggleGroup"
		}]
	}], () => [], {
		_buttonToggles: [{
			type: ContentChildren,
			args: [forwardRef(() => MatButtonToggle), { descendants: true }]
		}],
		appearance: [{ type: Input }],
		name: [{ type: Input }],
		vertical: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		value: [{ type: Input }],
		valueChange: [{ type: Output }],
		multiple: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		disabled: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		disabledInteractive: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		change: [{ type: Output }],
		hideSingleSelectionIndicator: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		hideMultipleSelectionIndicator: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}]
	});
})();
var MatButtonToggle = class {
	get buttonId() {
		return `${this.id}-button`;
	}
	get tabIndex() {
		return this._tabIndex();
	}
	set tabIndex(value) {
		this._tabIndex.set(value);
	}
	get appearance() {
		return this.buttonToggleGroup ? this.buttonToggleGroup.appearance : this._appearance;
	}
	set appearance(value) {
		this._appearance = value;
	}
	get checked() {
		return this.buttonToggleGroup ? this.buttonToggleGroup._isSelected(this) : this._checked;
	}
	set checked(value) {
		if (value !== this._checked) {
			this._checked = value;
			if (this.buttonToggleGroup) this.buttonToggleGroup._syncButtonToggle(this, this._checked);
			this._changeDetectorRef.markForCheck();
		}
	}
	get disabled() {
		return this._disabled || this.buttonToggleGroup && this.buttonToggleGroup.disabled;
	}
	set disabled(value) {
		this._disabled = value;
	}
	get disabledInteractive() {
		return this._disabledInteractive || this.buttonToggleGroup !== null && this.buttonToggleGroup.disabledInteractive;
	}
	set disabledInteractive(value) {
		this._disabledInteractive = value;
	}
	constructor() {
		var _defaultOptions$disab;
		_defineProperty(this, "_changeDetectorRef", inject(ChangeDetectorRef));
		_defineProperty(this, "_elementRef", inject(ElementRef));
		_defineProperty(this, "_focusMonitor", inject(FocusMonitor));
		_defineProperty(this, "_idGenerator", inject(_IdGenerator));
		_defineProperty(this, "_animationDisabled", _animationsDisabled());
		_defineProperty(this, "_checked", false);
		_defineProperty(this, "ariaLabel", void 0);
		_defineProperty(this, "ariaLabelledby", null);
		_defineProperty(this, "_buttonElement", void 0);
		_defineProperty(this, "buttonToggleGroup", void 0);
		_defineProperty(this, "id", void 0);
		_defineProperty(this, "name", void 0);
		_defineProperty(this, "value", void 0);
		_defineProperty(this, "_tabIndex", void 0);
		_defineProperty(this, "disableRipple", false);
		_defineProperty(this, "_appearance", void 0);
		_defineProperty(this, "_disabled", false);
		_defineProperty(this, "_disabledInteractive", void 0);
		_defineProperty(this, "change", new EventEmitter());
		inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
		const toggleGroup = inject(MAT_BUTTON_TOGGLE_GROUP, { optional: true });
		const defaultTabIndex = inject(new HostAttributeToken("tabindex"), { optional: true }) || "";
		const defaultOptions = inject(MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, { optional: true });
		this._tabIndex = signal(parseInt(defaultTabIndex) || 0, ...ngDevMode ? [{ debugName: "_tabIndex" }] : []);
		this.buttonToggleGroup = toggleGroup;
		this._appearance = defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : "standard";
		this._disabledInteractive = (_defaultOptions$disab = defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.disabledInteractive) !== null && _defaultOptions$disab !== void 0 ? _defaultOptions$disab : false;
	}
	ngOnInit() {
		const group = this.buttonToggleGroup;
		this.id = this.id || this._idGenerator.getId("mat-button-toggle-");
		if (group) {
			if (group._isPrechecked(this)) this.checked = true;
			else if (group._isSelected(this) !== this._checked) group._syncButtonToggle(this, this._checked);
		}
	}
	ngAfterViewInit() {
		if (!this._animationDisabled) this._elementRef.nativeElement.classList.add("mat-button-toggle-animations-enabled");
		this._focusMonitor.monitor(this._elementRef, true);
	}
	ngOnDestroy() {
		const group = this.buttonToggleGroup;
		this._focusMonitor.stopMonitoring(this._elementRef);
		if (group && group._isSelected(this)) group._syncButtonToggle(this, false, false, true);
	}
	focus(options) {
		this._buttonElement.nativeElement.focus(options);
	}
	_onButtonClick() {
		if (this.disabled) return;
		const newChecked = this.isSingleSelector() ? true : !this._checked;
		if (newChecked !== this._checked) {
			this._checked = newChecked;
			if (this.buttonToggleGroup) {
				this.buttonToggleGroup._syncButtonToggle(this, this._checked, true);
				this.buttonToggleGroup._onTouched();
			}
		}
		if (this.isSingleSelector()) {
			const focusable = this.buttonToggleGroup._buttonToggles.find((toggle) => {
				return toggle.tabIndex === 0;
			});
			if (focusable) focusable.tabIndex = -1;
			this.tabIndex = 0;
		}
		this.change.emit(new MatButtonToggleChange(this, this.value));
	}
	_markForCheck() {
		this._changeDetectorRef.markForCheck();
	}
	_getButtonName() {
		if (this.isSingleSelector()) return this.buttonToggleGroup.name;
		return this.name || null;
	}
	isSingleSelector() {
		return this.buttonToggleGroup && !this.buttonToggleGroup.multiple;
	}
};
_MatButtonToggle = MatButtonToggle;
_defineProperty(MatButtonToggle, "ɵfac", function MatButtonToggle_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatButtonToggle)();
});
_defineProperty(MatButtonToggle, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatButtonToggle,
	selectors: [["mat-button-toggle"]],
	viewQuery: function MatButtonToggle_Query(rf, ctx) {
		if (rf & 1) ɵɵviewQuery(_c0, 5);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._buttonElement = _t.first);
		}
	},
	hostAttrs: [
		"role",
		"presentation",
		1,
		"mat-button-toggle"
	],
	hostVars: 14,
	hostBindings: function MatButtonToggle_HostBindings(rf, ctx) {
		if (rf & 1) ɵɵlistener("focus", function MatButtonToggle_focus_HostBindingHandler() {
			return ctx.focus();
		});
		if (rf & 2) {
			ɵɵattribute("aria-label", null)("aria-labelledby", null)("id", ctx.id)("name", null);
			ɵɵclassProp("mat-button-toggle-standalone", !ctx.buttonToggleGroup)("mat-button-toggle-checked", ctx.checked)("mat-button-toggle-disabled", ctx.disabled)("mat-button-toggle-disabled-interactive", ctx.disabledInteractive)("mat-button-toggle-appearance-standard", ctx.appearance === "standard");
		}
	},
	inputs: {
		ariaLabel: [
			0,
			"aria-label",
			"ariaLabel"
		],
		ariaLabelledby: [
			0,
			"aria-labelledby",
			"ariaLabelledby"
		],
		id: "id",
		name: "name",
		value: "value",
		tabIndex: "tabIndex",
		disableRipple: [
			2,
			"disableRipple",
			"disableRipple",
			booleanAttribute
		],
		appearance: "appearance",
		checked: [
			2,
			"checked",
			"checked",
			booleanAttribute
		],
		disabled: [
			2,
			"disabled",
			"disabled",
			booleanAttribute
		],
		disabledInteractive: [
			2,
			"disabledInteractive",
			"disabledInteractive",
			booleanAttribute
		]
	},
	outputs: { change: "change" },
	exportAs: ["matButtonToggle"],
	ngContentSelectors: _c1,
	decls: 7,
	vars: 13,
	consts: [
		["button", ""],
		[
			"type",
			"button",
			1,
			"mat-button-toggle-button",
			"mat-focus-indicator",
			3,
			"click",
			"id",
			"disabled"
		],
		[1, "mat-button-toggle-checkbox-wrapper"],
		[1, "mat-button-toggle-label-content"],
		[1, "mat-button-toggle-focus-overlay"],
		[
			"matRipple",
			"",
			1,
			"mat-button-toggle-ripple",
			3,
			"matRippleTrigger",
			"matRippleDisabled"
		],
		[
			"state",
			"checked",
			"aria-hidden",
			"true",
			"appearance",
			"minimal",
			3,
			"disabled"
		]
	],
	template: function MatButtonToggle_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵprojectionDef();
			ɵɵelementStart(0, "button", 1, 0);
			ɵɵlistener("click", function MatButtonToggle_Template_button_click_0_listener() {
				return ctx._onButtonClick();
			});
			ɵɵconditionalCreate(2, MatButtonToggle_Conditional_2_Template, 2, 1, "div", 2);
			ɵɵelementStart(3, "span", 3);
			ɵɵprojection(4);
			ɵɵelementEnd()();
			ɵɵelement(5, "span", 4)(6, "span", 5);
		}
		if (rf & 2) {
			const button_r2 = ɵɵreference(1);
			ɵɵproperty("id", ctx.buttonId)("disabled", ctx.disabled && !ctx.disabledInteractive || null);
			ɵɵattribute("role", ctx.isSingleSelector() ? "radio" : "button")("tabindex", ctx.disabled && !ctx.disabledInteractive ? -1 : ctx.tabIndex)("aria-pressed", !ctx.isSingleSelector() ? ctx.checked : null)("aria-checked", ctx.isSingleSelector() ? ctx.checked : null)("name", ctx._getButtonName())("aria-label", ctx.ariaLabel)("aria-labelledby", ctx.ariaLabelledby)("aria-disabled", ctx.disabled && ctx.disabledInteractive ? "true" : null);
			ɵɵadvance(2);
			ɵɵconditional(ctx.buttonToggleGroup && (!ctx.buttonToggleGroup.multiple && !ctx.buttonToggleGroup.hideSingleSelectionIndicator || ctx.buttonToggleGroup.multiple && !ctx.buttonToggleGroup.hideMultipleSelectionIndicator) ? 2 : -1);
			ɵɵadvance(4);
			ɵɵproperty("matRippleTrigger", button_r2)("matRippleDisabled", ctx.disableRipple || ctx.disabled);
		}
	},
	dependencies: [MatRipple, MatPseudoCheckbox],
	styles: [".mat-button-toggle-standalone,\n.mat-button-toggle-group {\n  position: relative;\n  display: inline-flex;\n  flex-direction: row;\n  white-space: nowrap;\n  overflow: hidden;\n  -webkit-tap-highlight-color: transparent;\n  border-radius: var(--%NS%mat-button-toggle-legacy-shape);\n  transform: translateZ(0);\n}\n.mat-button-toggle-standalone:not([class*=mat-elevation-z]),\n.mat-button-toggle-group:not([class*=mat-elevation-z]) {\n  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n}\n@media (forced-colors: active) {\n  .mat-button-toggle-standalone,\n  .mat-button-toggle-group {\n    outline: solid 1px;\n  }\n}\n\n.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,\n.mat-button-toggle-group-appearance-standard {\n  border-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));\n  border: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));\n}\n.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,\n.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox {\n  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-button-toggle-selected-state-text-color, var(--%NS%mat-sys-on-secondary-container));\n}\n.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),\n.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]) {\n  box-shadow: none;\n}\n@media (forced-colors: active) {\n  .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,\n  .mat-button-toggle-group-appearance-standard {\n    outline: 0;\n  }\n}\n\n.mat-button-toggle-vertical {\n  flex-direction: column;\n}\n.mat-button-toggle-vertical .mat-button-toggle-label-content {\n  display: block;\n}\n\n.mat-button-toggle {\n  white-space: nowrap;\n  position: relative;\n  color: var(--%NS%mat-button-toggle-legacy-text-color);\n  font-family: var(--%NS%mat-button-toggle-legacy-label-text-font);\n  font-size: var(--%NS%mat-button-toggle-legacy-label-text-size);\n  line-height: var(--%NS%mat-button-toggle-legacy-label-text-line-height);\n  font-weight: var(--%NS%mat-button-toggle-legacy-label-text-weight);\n  letter-spacing: var(--%NS%mat-button-toggle-legacy-label-text-tracking);\n  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-button-toggle-legacy-selected-state-text-color);\n}\n.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay {\n  opacity: var(--%NS%mat-button-toggle-legacy-focus-state-layer-opacity);\n}\n.mat-button-toggle .mat-icon svg {\n  vertical-align: top;\n}\n\n.mat-button-toggle-checkbox-wrapper {\n  display: inline-block;\n  justify-content: flex-start;\n  align-items: center;\n  width: 0;\n  height: 18px;\n  line-height: 18px;\n  overflow: hidden;\n  box-sizing: border-box;\n  position: absolute;\n  top: 50%;\n  left: 16px;\n  transform: translate3d(0, -50%, 0);\n}\n[dir=rtl] .mat-button-toggle-checkbox-wrapper {\n  left: auto;\n  right: 16px;\n}\n.mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {\n  left: 12px;\n}\n[dir=rtl] .mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {\n  left: auto;\n  right: 12px;\n}\n.mat-button-toggle-checked .mat-button-toggle-checkbox-wrapper {\n  width: 18px;\n}\n.mat-button-toggle-animations-enabled .mat-button-toggle-checkbox-wrapper {\n  transition: width 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-button-toggle-vertical .mat-button-toggle-checkbox-wrapper {\n  transition: none;\n}\n\n.mat-button-toggle-checked {\n  color: var(--%NS%mat-button-toggle-legacy-selected-state-text-color);\n  background-color: var(--%NS%mat-button-toggle-legacy-selected-state-background-color);\n}\n\n.mat-button-toggle-disabled {\n  pointer-events: none;\n  color: var(--%NS%mat-button-toggle-legacy-disabled-state-text-color);\n  background-color: var(--%NS%mat-button-toggle-legacy-disabled-state-background-color);\n  --%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--%NS%mat-button-toggle-legacy-disabled-state-text-color);\n}\n.mat-button-toggle-disabled.mat-button-toggle-checked {\n  background-color: var(--%NS%mat-button-toggle-legacy-disabled-selected-state-background-color);\n}\n\n.mat-button-toggle-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-button-toggle-appearance-standard {\n  color: var(--%NS%mat-button-toggle-text-color, var(--%NS%mat-sys-on-surface));\n  background-color: var(--%NS%mat-button-toggle-background-color, transparent);\n  font-family: var(--%NS%mat-button-toggle-label-text-font, var(--%NS%mat-sys-label-large-font));\n  font-size: var(--%NS%mat-button-toggle-label-text-size, var(--%NS%mat-sys-label-large-size));\n  line-height: var(--%NS%mat-button-toggle-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));\n  font-weight: var(--%NS%mat-button-toggle-label-text-weight, var(--%NS%mat-sys-label-large-weight));\n  letter-spacing: var(--%NS%mat-button-toggle-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));\n}\n.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {\n  border-left: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));\n}\n[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {\n  border-left: none;\n  border-right: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));\n}\n.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {\n  border-left: none;\n  border-right: none;\n  border-top: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));\n}\n.mat-button-toggle-appearance-standard.mat-button-toggle-checked {\n  color: var(--%NS%mat-button-toggle-selected-state-text-color, var(--%NS%mat-sys-on-secondary-container));\n  background-color: var(--%NS%mat-button-toggle-selected-state-background-color, var(--%NS%mat-sys-secondary-container));\n}\n.mat-button-toggle-appearance-standard.mat-button-toggle-disabled {\n  color: var(--%NS%mat-button-toggle-disabled-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n  background-color: var(--%NS%mat-button-toggle-disabled-state-background-color, transparent);\n}\n.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox {\n  --%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--%NS%mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n}\n.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked {\n  color: var(--%NS%mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n  background-color: var(--%NS%mat-button-toggle-disabled-selected-state-background-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));\n}\n.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {\n  background-color: var(--%NS%mat-button-toggle-state-layer-color, var(--%NS%mat-sys-on-surface));\n}\n.mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {\n  opacity: var(--%NS%mat-button-toggle-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-button-toggle-appearance-standard.cdk-keyboard-focused .mat-button-toggle-focus-overlay {\n  opacity: var(--%NS%mat-button-toggle-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n@media (hover: none) {\n  .mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {\n    display: none;\n  }\n}\n\n.mat-button-toggle-label-content {\n  -webkit-user-select: none;\n  user-select: none;\n  display: inline-block;\n  padding: 0 16px;\n  line-height: var(--%NS%mat-button-toggle-legacy-height);\n  position: relative;\n}\n.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {\n  padding: 0 12px;\n  line-height: var(--%NS%mat-button-toggle-height, 40px);\n}\n\n.mat-button-toggle-label-content > * {\n  vertical-align: middle;\n}\n\n.mat-button-toggle-focus-overlay {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: inherit;\n  pointer-events: none;\n  opacity: 0;\n  background-color: var(--%NS%mat-button-toggle-legacy-state-layer-color);\n}\n\n@media (forced-colors: active) {\n  .mat-button-toggle-checked .mat-button-toggle-focus-overlay {\n    border-bottom: solid 500px;\n    opacity: 0.5;\n    height: 0;\n  }\n  .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay {\n    opacity: 0.6;\n  }\n  .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {\n    border-bottom: solid 500px;\n  }\n}\n.mat-button-toggle .mat-button-toggle-ripple {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n\n.mat-button-toggle-button {\n  border: 0;\n  background: none;\n  color: inherit;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  outline: none;\n  width: 100%;\n  cursor: pointer;\n}\n.mat-button-toggle-animations-enabled .mat-button-toggle-button {\n  transition: padding 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-button-toggle-vertical .mat-button-toggle-button {\n  transition: none;\n}\n.mat-button-toggle-disabled .mat-button-toggle-button {\n  cursor: default;\n}\n.mat-button-toggle-button::-moz-focus-inner {\n  border: 0;\n}\n.mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {\n  padding-left: 30px;\n}\n[dir=rtl] .mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {\n  padding-left: 0;\n  padding-right: 30px;\n}\n\n.mat-button-toggle-standalone.mat-button-toggle-appearance-standard {\n  --%NS%mat-focus-indicator-border-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));\n}\n\n.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:last-of-type .mat-button-toggle-button::before {\n  border-top-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));\n  border-bottom-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));\n}\n.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:first-of-type .mat-button-toggle-button::before {\n  border-top-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));\n  border-bottom-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));\n}\n\n.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:last-of-type .mat-button-toggle-button::before {\n  border-bottom-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));\n  border-bottom-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));\n}\n.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:first-of-type .mat-button-toggle-button::before {\n  border-top-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));\n  border-top-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButtonToggle, [{
		type: Component,
		args: [{
			selector: "mat-button-toggle",
			encapsulation: ViewEncapsulation.None,
			exportAs: "matButtonToggle",
			host: {
				"[class.mat-button-toggle-standalone]": "!buttonToggleGroup",
				"[class.mat-button-toggle-checked]": "checked",
				"[class.mat-button-toggle-disabled]": "disabled",
				"[class.mat-button-toggle-disabled-interactive]": "disabledInteractive",
				"[class.mat-button-toggle-appearance-standard]": "appearance === \"standard\"",
				"class": "mat-button-toggle",
				"[attr.aria-label]": "null",
				"[attr.aria-labelledby]": "null",
				"[attr.id]": "id",
				"[attr.name]": "null",
				"(focus)": "focus()",
				"role": "presentation"
			},
			imports: [MatRipple, MatPseudoCheckbox],
			template: "<button #button class=\"mat-button-toggle-button mat-focus-indicator\"\n        type=\"button\"\n        [id]=\"buttonId\"\n        [attr.role]=\"isSingleSelector() ? 'radio' : 'button'\"\n        [attr.tabindex]=\"disabled && !disabledInteractive ? -1 : tabIndex\"\n        [attr.aria-pressed]=\"!isSingleSelector() ? checked : null\"\n        [attr.aria-checked]=\"isSingleSelector() ? checked : null\"\n        [disabled]=\"(disabled && !disabledInteractive) || null\"\n        [attr.name]=\"_getButtonName()\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        [attr.aria-disabled]=\"disabled && disabledInteractive ? 'true' : null\"\n        (click)=\"_onButtonClick()\">\n  @if (buttonToggleGroup && (\n    !buttonToggleGroup.multiple && !buttonToggleGroup.hideSingleSelectionIndicator ||\n    buttonToggleGroup.multiple && !buttonToggleGroup.hideMultipleSelectionIndicator)\n  ) {\n    <div class=\"mat-button-toggle-checkbox-wrapper\">\n      <mat-pseudo-checkbox\n        [disabled]=\"disabled\"\n        state=\"checked\"\n        aria-hidden=\"true\"\n        appearance=\"minimal\"/>\n    </div>\n  }\n\n  <span class=\"mat-button-toggle-label-content\">\n    <ng-content></ng-content>\n  </span>\n</button>\n\n<span class=\"mat-button-toggle-focus-overlay\"></span>\n<span class=\"mat-button-toggle-ripple\" matRipple\n     [matRippleTrigger]=\"button\"\n     [matRippleDisabled]=\"disableRipple || disabled\">\n</span>\n",
			styles: [".mat-button-toggle-standalone,\n.mat-button-toggle-group {\n  position: relative;\n  display: inline-flex;\n  flex-direction: row;\n  white-space: nowrap;\n  overflow: hidden;\n  -webkit-tap-highlight-color: transparent;\n  border-radius: var(--mat-button-toggle-legacy-shape);\n  transform: translateZ(0);\n}\n.mat-button-toggle-standalone:not([class*=mat-elevation-z]),\n.mat-button-toggle-group:not([class*=mat-elevation-z]) {\n  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n}\n@media (forced-colors: active) {\n  .mat-button-toggle-standalone,\n  .mat-button-toggle-group {\n    outline: solid 1px;\n  }\n}\n\n.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,\n.mat-button-toggle-group-appearance-standard {\n  border-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));\n  border: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));\n}\n.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,\n.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox {\n  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-button-toggle-selected-state-text-color, var(--mat-sys-on-secondary-container));\n}\n.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),\n.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]) {\n  box-shadow: none;\n}\n@media (forced-colors: active) {\n  .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,\n  .mat-button-toggle-group-appearance-standard {\n    outline: 0;\n  }\n}\n\n.mat-button-toggle-vertical {\n  flex-direction: column;\n}\n.mat-button-toggle-vertical .mat-button-toggle-label-content {\n  display: block;\n}\n\n.mat-button-toggle {\n  white-space: nowrap;\n  position: relative;\n  color: var(--mat-button-toggle-legacy-text-color);\n  font-family: var(--mat-button-toggle-legacy-label-text-font);\n  font-size: var(--mat-button-toggle-legacy-label-text-size);\n  line-height: var(--mat-button-toggle-legacy-label-text-line-height);\n  font-weight: var(--mat-button-toggle-legacy-label-text-weight);\n  letter-spacing: var(--mat-button-toggle-legacy-label-text-tracking);\n  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-button-toggle-legacy-selected-state-text-color);\n}\n.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay {\n  opacity: var(--mat-button-toggle-legacy-focus-state-layer-opacity);\n}\n.mat-button-toggle .mat-icon svg {\n  vertical-align: top;\n}\n\n.mat-button-toggle-checkbox-wrapper {\n  display: inline-block;\n  justify-content: flex-start;\n  align-items: center;\n  width: 0;\n  height: 18px;\n  line-height: 18px;\n  overflow: hidden;\n  box-sizing: border-box;\n  position: absolute;\n  top: 50%;\n  left: 16px;\n  transform: translate3d(0, -50%, 0);\n}\n[dir=rtl] .mat-button-toggle-checkbox-wrapper {\n  left: auto;\n  right: 16px;\n}\n.mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {\n  left: 12px;\n}\n[dir=rtl] .mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {\n  left: auto;\n  right: 12px;\n}\n.mat-button-toggle-checked .mat-button-toggle-checkbox-wrapper {\n  width: 18px;\n}\n.mat-button-toggle-animations-enabled .mat-button-toggle-checkbox-wrapper {\n  transition: width 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-button-toggle-vertical .mat-button-toggle-checkbox-wrapper {\n  transition: none;\n}\n\n.mat-button-toggle-checked {\n  color: var(--mat-button-toggle-legacy-selected-state-text-color);\n  background-color: var(--mat-button-toggle-legacy-selected-state-background-color);\n}\n\n.mat-button-toggle-disabled {\n  pointer-events: none;\n  color: var(--mat-button-toggle-legacy-disabled-state-text-color);\n  background-color: var(--mat-button-toggle-legacy-disabled-state-background-color);\n  --mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--mat-button-toggle-legacy-disabled-state-text-color);\n}\n.mat-button-toggle-disabled.mat-button-toggle-checked {\n  background-color: var(--mat-button-toggle-legacy-disabled-selected-state-background-color);\n}\n\n.mat-button-toggle-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-button-toggle-appearance-standard {\n  color: var(--mat-button-toggle-text-color, var(--mat-sys-on-surface));\n  background-color: var(--mat-button-toggle-background-color, transparent);\n  font-family: var(--mat-button-toggle-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-toggle-label-text-size, var(--mat-sys-label-large-size));\n  line-height: var(--mat-button-toggle-label-text-line-height, var(--mat-sys-label-large-line-height));\n  font-weight: var(--mat-button-toggle-label-text-weight, var(--mat-sys-label-large-weight));\n  letter-spacing: var(--mat-button-toggle-label-text-tracking, var(--mat-sys-label-large-tracking));\n}\n.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {\n  border-left: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));\n}\n[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {\n  border-left: none;\n  border-right: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));\n}\n.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {\n  border-left: none;\n  border-right: none;\n  border-top: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));\n}\n.mat-button-toggle-appearance-standard.mat-button-toggle-checked {\n  color: var(--mat-button-toggle-selected-state-text-color, var(--mat-sys-on-secondary-container));\n  background-color: var(--mat-button-toggle-selected-state-background-color, var(--mat-sys-secondary-container));\n}\n.mat-button-toggle-appearance-standard.mat-button-toggle-disabled {\n  color: var(--mat-button-toggle-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-toggle-disabled-state-background-color, transparent);\n}\n.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox {\n  --mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked {\n  color: var(--mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-toggle-disabled-selected-state-background-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {\n  background-color: var(--mat-button-toggle-state-layer-color, var(--mat-sys-on-surface));\n}\n.mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {\n  opacity: var(--mat-button-toggle-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-button-toggle-appearance-standard.cdk-keyboard-focused .mat-button-toggle-focus-overlay {\n  opacity: var(--mat-button-toggle-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n@media (hover: none) {\n  .mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {\n    display: none;\n  }\n}\n\n.mat-button-toggle-label-content {\n  -webkit-user-select: none;\n  user-select: none;\n  display: inline-block;\n  padding: 0 16px;\n  line-height: var(--mat-button-toggle-legacy-height);\n  position: relative;\n}\n.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {\n  padding: 0 12px;\n  line-height: var(--mat-button-toggle-height, 40px);\n}\n\n.mat-button-toggle-label-content > * {\n  vertical-align: middle;\n}\n\n.mat-button-toggle-focus-overlay {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: inherit;\n  pointer-events: none;\n  opacity: 0;\n  background-color: var(--mat-button-toggle-legacy-state-layer-color);\n}\n\n@media (forced-colors: active) {\n  .mat-button-toggle-checked .mat-button-toggle-focus-overlay {\n    border-bottom: solid 500px;\n    opacity: 0.5;\n    height: 0;\n  }\n  .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay {\n    opacity: 0.6;\n  }\n  .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {\n    border-bottom: solid 500px;\n  }\n}\n.mat-button-toggle .mat-button-toggle-ripple {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n\n.mat-button-toggle-button {\n  border: 0;\n  background: none;\n  color: inherit;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  outline: none;\n  width: 100%;\n  cursor: pointer;\n}\n.mat-button-toggle-animations-enabled .mat-button-toggle-button {\n  transition: padding 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-button-toggle-vertical .mat-button-toggle-button {\n  transition: none;\n}\n.mat-button-toggle-disabled .mat-button-toggle-button {\n  cursor: default;\n}\n.mat-button-toggle-button::-moz-focus-inner {\n  border: 0;\n}\n.mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {\n  padding-left: 30px;\n}\n[dir=rtl] .mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {\n  padding-left: 0;\n  padding-right: 30px;\n}\n\n.mat-button-toggle-standalone.mat-button-toggle-appearance-standard {\n  --mat-focus-indicator-border-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));\n}\n\n.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:last-of-type .mat-button-toggle-button::before {\n  border-top-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));\n  border-bottom-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));\n}\n.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:first-of-type .mat-button-toggle-button::before {\n  border-top-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));\n  border-bottom-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));\n}\n\n.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:last-of-type .mat-button-toggle-button::before {\n  border-bottom-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));\n  border-bottom-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));\n}\n.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:first-of-type .mat-button-toggle-button::before {\n  border-top-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));\n  border-top-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));\n}\n"]
		}]
	}], () => [], {
		ariaLabel: [{
			type: Input,
			args: ["aria-label"]
		}],
		ariaLabelledby: [{
			type: Input,
			args: ["aria-labelledby"]
		}],
		_buttonElement: [{
			type: ViewChild,
			args: ["button"]
		}],
		id: [{ type: Input }],
		name: [{ type: Input }],
		value: [{ type: Input }],
		tabIndex: [{ type: Input }],
		disableRipple: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		appearance: [{ type: Input }],
		checked: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		disabled: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		disabledInteractive: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		change: [{ type: Output }]
	});
})();
var MatButtonToggleModule = class {};
_MatButtonToggleModule = MatButtonToggleModule;
_defineProperty(MatButtonToggleModule, "ɵfac", function MatButtonToggleModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatButtonToggleModule)();
});
_defineProperty(MatButtonToggleModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatButtonToggleModule,
	imports: [
		MatRippleModule,
		MatButtonToggleGroup,
		MatButtonToggle
	],
	exports: [
		BidiModule,
		MatButtonToggleGroup,
		MatButtonToggle
	]
}));
_defineProperty(MatButtonToggleModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [
	MatRippleModule,
	MatButtonToggle,
	BidiModule
] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButtonToggleModule, [{
		type: NgModule,
		args: [{
			imports: [
				MatRippleModule,
				MatButtonToggleGroup,
				MatButtonToggle
			],
			exports: [
				BidiModule,
				MatButtonToggleGroup,
				MatButtonToggle
			]
		}]
	}], null, null);
})();
//#endregion
export { MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, MAT_BUTTON_TOGGLE_GROUP, MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule };
