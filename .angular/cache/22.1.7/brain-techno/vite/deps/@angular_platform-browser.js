import { t as _defineProperty } from "./defineProperty-wQpB4Zl9.js";
import { $i as unwrapSafeValue, Ar as _sanitizeUrl, Br as bypassSanitizationTrustUrl, Fn as Injectable, Gc as RuntimeError, Ir as bypassSanitizationTrustHtml, Kc as SecurityContext, Lr as bypassSanitizationTrustResourceUrl, Ml as ɵɵinject, Ol as ɵɵdefineInjectable, Pn as Inject, Pr as allowSanitizationBypassAndThrow, Pt as CACHE_ACTIVE, Qc as _global, Rr as bypassSanitizationTrustScript, Wi as setClassMetadata, Yc as Version, Yt as APP_BOOTSTRAP_LISTENER, al as forwardRef, ao as ɵɵdefineService, bt as withI18nSupport$1, dr as Service, fn as Console, gc as DOCUMENT, hl as makeEnvironmentProviders, il as formatRuntimeError, jn as IS_ENABLED_BLOCKING_INITIAL_NAVIGATION, kr as _sanitizeHtml, ll as inject, tn as ApplicationRef, ut as provideStabilityDebugging, vc as ENVIRONMENT_INITIALIZER, vt as withDomHydration, xt as withIncrementalHydration$1, yt as withEventReplay$1, zr as bypassSanitizationTrustStyle } from "./core-D4fY0-5O.js";
import { s as getDOM } from "./_xhr-chunk-CM-cwqLh.js";
import { r as withHttpTransferCache } from "./http-CYKzjXan.js";
import { _ as provideCssVarNamespacing, a as bootstrapApplication, c as provideProtractorTestingSupport, d as DomRendererFactory2, f as EVENT_MANAGER_PLUGINS, g as SharedStylesHost, h as REMOVE_STYLES_ON_COMPONENT_DESTROY, i as KeyEventsPlugin, l as CSS_VAR_NAMESPACE, m as EventManagerPlugin, n as BrowserGetTestability, o as createApplication, p as EventManager, r as BrowserModule, s as platformBrowser, t as BrowserDomAdapter, u as DomEventsPlugin } from "./_browser-chunk-C5L3R0sI.js";
//#region node_modules/@angular/platform-browser/fesm2022/platform-browser.mjs
var _Meta;
var _Title;
var _CssVarNamespacer;
var _DomSanitizer;
var _DomSanitizerImpl;
/**
* @license Angular v22.1.7
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var Meta = class {
	constructor() {
		_defineProperty(this, "_doc", inject(DOCUMENT));
		_defineProperty(this, "_dom", getDOM());
		_defineProperty(this, "_cachedHead", void 0);
	}
	addTag(tag, forceCreation = false) {
		if (!tag) return null;
		return this._getOrCreateElement(tag, forceCreation);
	}
	addTags(tags, forceCreation = false) {
		return tags.filter((tag) => !!tag).map((tag) => this._getOrCreateElement(tag, forceCreation));
	}
	getTag(attrSelector) {
		if (!attrSelector) return null;
		const meta = this._doc.querySelector(buildMetaSelector(attrSelector));
		return isMetaTag(meta) ? meta : null;
	}
	getTags(attrSelector) {
		if (!attrSelector) return [];
		const list = this._doc.querySelectorAll(buildMetaSelector(attrSelector));
		return list ? Array.from(list).filter((elem) => isMetaTag(elem)) : [];
	}
	updateTag(tag, selector) {
		var _selector;
		validateMetaDefinition(tag);
		(_selector = selector) !== null && _selector !== void 0 || (selector = parseSelector(tag));
		const meta = this.getTag(selector);
		if (meta) {
			setMetaElementAttributes(tag, meta);
			return meta;
		}
		return this._getOrCreateElement(tag, true);
	}
	removeTag(attrSelector) {
		this.removeTagElement(this.getTag(attrSelector));
	}
	removeTagElement(meta) {
		if (meta) this._dom.remove(meta);
	}
	_getOrCreateElement(meta, forceCreation = false) {
		validateMetaDefinition(meta);
		if (!forceCreation) {
			const selector = parseSelector(meta);
			const elem = this.getTags(selector).filter((elem) => containsAttributes(meta, elem))[0];
			if (elem !== void 0) return elem;
		}
		const element = this._dom.createElement("meta");
		setMetaElementAttributes(meta, element);
		this._doc.getElementsByTagName("head")[0].appendChild(element);
		return element;
	}
};
_Meta = Meta;
_defineProperty(Meta, "ɵfac", function Meta_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _Meta)();
});
_defineProperty(Meta, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _Meta,
	factory: _Meta.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Meta, [{ type: Service }], null, null);
})();
function buildMetaSelector(attrSelector) {
	return `meta[${attrSelector}]`;
}
function setMetaElementAttributes(tag, el) {
	Object.keys(tag).forEach((prop) => el.setAttribute(getMetaKeyMap(prop), tag[prop]));
}
function validateMetaDefinition(tag) {
	for (const prop of Object.keys(tag)) {
		const attributeName = getMetaKeyMap(prop);
		if (attributeName.toLowerCase().startsWith("on")) throw new RuntimeError(5203, (typeof ngDevMode === "undefined" || ngDevMode) && `The Meta service does not allow setting event handler attribute '${attributeName}' for security reasons.`);
	}
}
function parseSelector(tag) {
	const attr = tag.name ? "name" : "property";
	return `${attr}=${escapeSelectorValue(String(tag[attr]))}`;
}
function escapeSelectorValue(value) {
	return `"${value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
}
function containsAttributes(tag, elem) {
	return Object.keys(tag).every((key) => elem.getAttribute(getMetaKeyMap(key)) === tag[key]);
}
function getMetaKeyMap(prop) {
	return Object.hasOwn(META_KEYS_MAP, prop) ? META_KEYS_MAP[prop] : prop;
}
function isMetaTag(tag) {
	return (tag === null || tag === void 0 ? void 0 : tag.nodeName.toLowerCase()) === "meta";
}
var META_KEYS_MAP = { httpEquiv: "http-equiv" };
var Title = class {
	constructor(_doc) {
		_defineProperty(this, "_doc", void 0);
		this._doc = _doc;
	}
	getTitle() {
		return this._doc.title;
	}
	setTitle(newTitle) {
		this._doc.title = newTitle || "";
	}
};
_Title = Title;
_defineProperty(Title, "ɵfac", function Title_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _Title)(ɵɵinject(DOCUMENT));
});
_defineProperty(Title, "ɵprov", /* @__PURE__ */ ɵɵdefineInjectable({
	token: _Title,
	factory: _Title.ɵfac,
	providedIn: "root"
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Title, [{
		type: Injectable,
		args: [{ providedIn: "root" }]
	}], () => [{
		type: void 0,
		decorators: [{
			type: Inject,
			args: [DOCUMENT]
		}]
	}], null);
})();
function exportNgVar(name, value) {
	if (typeof COMPILED === "undefined" || !COMPILED) {
		const ng = _global["ng"] = _global["ng"] || {};
		ng[name] = value;
	}
}
var ChangeDetectionPerfRecord = class {
	constructor(msPerTick, numTicks) {
		_defineProperty(this, "msPerTick", void 0);
		_defineProperty(this, "numTicks", void 0);
		this.msPerTick = msPerTick;
		this.numTicks = numTicks;
	}
};
var AngularProfiler = class {
	constructor(ref) {
		_defineProperty(this, "appRef", void 0);
		this.appRef = ref.injector.get(ApplicationRef);
	}
	timeChangeDetection(config) {
		const record = config && config["record"];
		const profileName = "Change Detection";
		if (record && "profile" in console && typeof console.profile === "function") console.profile(profileName);
		const start = performance.now();
		let numTicks = 0;
		while (numTicks < 5 || performance.now() - start < 500) {
			this.appRef.tick();
			numTicks++;
		}
		const end = performance.now();
		if (record && "profileEnd" in console && typeof console.profileEnd === "function") console.profileEnd(profileName);
		const msPerTick = (end - start) / numTicks;
		console.log(`ran ${numTicks} change detection cycles`);
		console.log(`${msPerTick.toFixed(2)} ms per check`);
		return new ChangeDetectionPerfRecord(msPerTick, numTicks);
	}
};
var PROFILER_GLOBAL_NAME = "profiler";
function enableDebugTools(ref) {
	exportNgVar(PROFILER_GLOBAL_NAME, new AngularProfiler(ref));
	return ref;
}
function disableDebugTools() {
	exportNgVar(PROFILER_GLOBAL_NAME, null);
}
var By = class {
	static all() {
		return () => true;
	}
	static css(selector) {
		return (debugElement) => {
			return debugElement.nativeElement != null ? elementMatches(debugElement.nativeElement, selector) : false;
		};
	}
	static directive(type) {
		return (debugNode) => debugNode.providerTokens.indexOf(type) !== -1;
	}
};
function elementMatches(n, selector) {
	if (getDOM().isElementNode(n)) return n.matches && n.matches(selector) || n.msMatchesSelector && n.msMatchesSelector(selector) || n.webkitMatchesSelector && n.webkitMatchesSelector(selector);
	return false;
}
var CssVarNamespacer = class {
	constructor() {
		var _inject;
		_defineProperty(this, "namespacePrefix", (_inject = inject(CSS_VAR_NAMESPACE, { optional: true })) !== null && _inject !== void 0 ? _inject : "");
	}
	namespace(name) {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			if (!name.startsWith("--")) throw new Error(`CSS variable names passed to \`CssVarNamespacer\` must start with '--', got: '${name}'`);
		}
		if (!this.namespacePrefix) return name;
		return `--${this.namespacePrefix}${name.substring(2)}`;
	}
};
_CssVarNamespacer = CssVarNamespacer;
_defineProperty(CssVarNamespacer, "ɵfac", function CssVarNamespacer_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CssVarNamespacer)();
});
_defineProperty(CssVarNamespacer, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _CssVarNamespacer,
	factory: _CssVarNamespacer.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CssVarNamespacer, [{ type: Service }], null, null);
})();
var HydrationFeatureKind;
(function(HydrationFeatureKind) {
	HydrationFeatureKind[HydrationFeatureKind["NoHttpTransferCache"] = 0] = "NoHttpTransferCache";
	HydrationFeatureKind[HydrationFeatureKind["HttpTransferCacheOptions"] = 1] = "HttpTransferCacheOptions";
	HydrationFeatureKind[HydrationFeatureKind["I18nSupport"] = 2] = "I18nSupport";
	HydrationFeatureKind[HydrationFeatureKind["EventReplay"] = 3] = "EventReplay";
	HydrationFeatureKind[HydrationFeatureKind["IncrementalHydration"] = 4] = "IncrementalHydration";
	HydrationFeatureKind[HydrationFeatureKind["NoIncrementalHydration"] = 5] = "NoIncrementalHydration";
})(HydrationFeatureKind || (HydrationFeatureKind = {}));
function hydrationFeature(ɵkind, ɵproviders = [], ɵoptions = {}) {
	return {
		ɵkind,
		ɵproviders
	};
}
function withNoHttpTransferCache() {
	return hydrationFeature(HydrationFeatureKind.NoHttpTransferCache);
}
function withHttpTransferCacheOptions(options) {
	return hydrationFeature(HydrationFeatureKind.HttpTransferCacheOptions, withHttpTransferCache(options));
}
function withI18nSupport() {
	return hydrationFeature(HydrationFeatureKind.I18nSupport, withI18nSupport$1());
}
function withEventReplay() {
	return hydrationFeature(HydrationFeatureKind.EventReplay, withEventReplay$1());
}
function withIncrementalHydration() {
	return hydrationFeature(HydrationFeatureKind.IncrementalHydration, withIncrementalHydration$1());
}
function withNoIncrementalHydration() {
	return hydrationFeature(HydrationFeatureKind.NoIncrementalHydration);
}
function provideEnabledBlockingInitialNavigationDetector() {
	return [{
		provide: ENVIRONMENT_INITIALIZER,
		useValue: () => {
			if (inject(IS_ENABLED_BLOCKING_INITIAL_NAVIGATION, { optional: true })) {
				const console = inject(Console);
				const message = formatRuntimeError(5001, "Configuration error: found both hydration and enabledBlocking initial navigation in the same application, which is a contradiction.");
				console.warn(message);
			}
		},
		multi: true
	}];
}
function provideClientHydration(...features) {
	const providers = [];
	const featuresKind = /* @__PURE__ */ new Set();
	for (const { ɵproviders, ɵkind } of features) {
		featuresKind.add(ɵkind);
		if (ɵproviders.length) providers.push(ɵproviders);
	}
	const hasHttpTransferCacheOptions = featuresKind.has(HydrationFeatureKind.HttpTransferCacheOptions);
	if (typeof ngDevMode !== "undefined" && ngDevMode) {
		if (featuresKind.has(HydrationFeatureKind.NoHttpTransferCache) && hasHttpTransferCacheOptions) throw new RuntimeError(5001, "Configuration error: found both withHttpTransferCacheOptions() and withNoHttpTransferCache() in the same call to provideClientHydration(), which is a contradiction.");
		if (featuresKind.has(HydrationFeatureKind.IncrementalHydration) && featuresKind.has(HydrationFeatureKind.NoIncrementalHydration)) throw new RuntimeError(5001, "Configuration error: found both withIncrementalHydration() and withNoIncrementalHydration() in the same call to provideClientHydration(), which is a contradiction.");
	}
	return makeEnvironmentProviders([
		typeof ngDevMode !== "undefined" && ngDevMode ? provideEnabledBlockingInitialNavigationDetector() : [],
		typeof ngDevMode !== "undefined" && ngDevMode ? provideStabilityDebugging() : [],
		withDomHydration(),
		featuresKind.has(HydrationFeatureKind.NoHttpTransferCache) || hasHttpTransferCacheOptions ? [] : withHttpTransferCache({}),
		featuresKind.has(HydrationFeatureKind.NoIncrementalHydration) ? [] : withIncrementalHydration$1(),
		providers,
		{
			provide: CACHE_ACTIVE,
			useValue: { isActive: true }
		},
		{
			provide: APP_BOOTSTRAP_LISTENER,
			multi: true,
			useFactory: () => {
				const appRef = inject(ApplicationRef);
				const cacheState = inject(CACHE_ACTIVE);
				return () => {
					appRef.whenStable().then(() => {
						cacheState.isActive = false;
					});
				};
			}
		}
	]);
}
var DomSanitizer = class {};
_DomSanitizer = DomSanitizer;
_defineProperty(DomSanitizer, "ɵfac", function DomSanitizer_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _DomSanitizer)();
});
_defineProperty(DomSanitizer, "ɵprov", /* @__PURE__ */ ɵɵdefineInjectable({
	token: _DomSanitizer,
	factory: function DomSanitizer_Factory(__ngFactoryType__) {
		let __ngConditionalFactory__ = null;
		if (__ngFactoryType__) __ngConditionalFactory__ = new (__ngFactoryType__ || _DomSanitizer)();
		else __ngConditionalFactory__ = ɵɵinject(DomSanitizerImpl);
		return __ngConditionalFactory__;
	},
	providedIn: "root"
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DomSanitizer, [{
		type: Injectable,
		args: [{
			providedIn: "root",
			useExisting: forwardRef(() => DomSanitizerImpl)
		}]
	}], null, null);
})();
var DomSanitizerImpl = class extends DomSanitizer {
	constructor(..._args) {
		super(..._args);
		_defineProperty(this, "_doc", inject(DOCUMENT));
	}
	sanitize(ctx, value) {
		if (value == null) return null;
		switch (ctx) {
			case SecurityContext.NONE: return value;
			case SecurityContext.HTML:
				if (allowSanitizationBypassAndThrow(value, "HTML")) return unwrapSafeValue(value);
				return _sanitizeHtml(this._doc, String(value)).toString();
			case SecurityContext.STYLE:
				if (allowSanitizationBypassAndThrow(value, "Style")) return unwrapSafeValue(value);
				return value;
			case SecurityContext.SCRIPT:
				if (allowSanitizationBypassAndThrow(value, "Script")) return unwrapSafeValue(value);
				throw new RuntimeError(5200, (typeof ngDevMode === "undefined" || ngDevMode) && "unsafe value used in a script context");
			case SecurityContext.URL:
				if (allowSanitizationBypassAndThrow(value, "URL")) return unwrapSafeValue(value);
				return _sanitizeUrl(String(value));
			case SecurityContext.RESOURCE_URL:
				if (allowSanitizationBypassAndThrow(value, "ResourceURL")) return unwrapSafeValue(value);
				throw new RuntimeError(-5201, (typeof ngDevMode === "undefined" || ngDevMode) && `unsafe value used in a resource URL context (see https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss)`);
			default: throw new RuntimeError(5202, (typeof ngDevMode === "undefined" || ngDevMode) && `Unexpected SecurityContext ${ctx} (see https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss)`);
		}
	}
	bypassSecurityTrustHtml(value) {
		return bypassSanitizationTrustHtml(value);
	}
	bypassSecurityTrustStyle(value) {
		return bypassSanitizationTrustStyle(value);
	}
	bypassSecurityTrustScript(value) {
		return bypassSanitizationTrustScript(value);
	}
	bypassSecurityTrustUrl(value) {
		return bypassSanitizationTrustUrl(value);
	}
	bypassSecurityTrustResourceUrl(value) {
		return bypassSanitizationTrustResourceUrl(value);
	}
};
_DomSanitizerImpl = DomSanitizerImpl;
_defineProperty(DomSanitizerImpl, "ɵfac", function DomSanitizerImpl_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _DomSanitizerImpl)();
});
_defineProperty(DomSanitizerImpl, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _DomSanitizerImpl,
	factory: _DomSanitizerImpl.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DomSanitizerImpl, [{ type: Service }], null, null);
})();
var VERSION = /* @__PURE__ */ new Version("22.1.7");
//#endregion
export { BrowserModule, By, CssVarNamespacer, DomSanitizer, EVENT_MANAGER_PLUGINS, EventManager, EventManagerPlugin, HydrationFeatureKind, Meta, REMOVE_STYLES_ON_COMPONENT_DESTROY, Title, VERSION, bootstrapApplication, createApplication, disableDebugTools, enableDebugTools, platformBrowser, provideClientHydration, provideCssVarNamespacing, provideProtractorTestingSupport, withEventReplay, withHttpTransferCacheOptions, withI18nSupport, withIncrementalHydration, withNoHttpTransferCache, withNoIncrementalHydration, BrowserDomAdapter as ɵBrowserDomAdapter, BrowserGetTestability as ɵBrowserGetTestability, DomEventsPlugin as ɵDomEventsPlugin, DomRendererFactory2 as ɵDomRendererFactory2, DomSanitizerImpl as ɵDomSanitizerImpl, KeyEventsPlugin as ɵKeyEventsPlugin, SharedStylesHost as ɵSharedStylesHost, getDOM as ɵgetDOM };
