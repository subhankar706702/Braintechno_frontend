# BRAIN TECHNO Editor – Element-local Architecture

The editor engine remains in:
- `braintechno-editor.component.ts`
- `braintechno-editor.component.html`
- `braintechno-editor.component.scss`

Each element is self-contained under `elements/<element>/`.

Typical element folder:
- `<element>-editor.component.ts`
- `<element>-editor.component.html`
- `<element>-editor.component.scss`
- `<element>.factory.ts`
- `<element>.repeat.ts` (when the element has repeat items)
- `<element>.renderer.ts`
- `<element>.presets.ts`
- any other element-specific helper files

Examples:
- `elements/tabs/` contains all Tabs files.
- `elements/timeline/` contains all Timeline files.
- `elements/navbar/` contains all Navbar files, including its presets.

`registry/element-presets.ts` remains only as the central preset aggregator used by the editor engine.
`models/` remains shared model/context code.
