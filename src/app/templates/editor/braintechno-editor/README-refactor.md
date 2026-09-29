# BRAIN TECHNO Editor — Element-wise Refactor

This package keeps the existing editor JSON/schema and UI classes intact while moving each real editor element into its own folder.

## Preserved behavior
- Existing EditorBlock JSON shape
- Existing preset keys and labels
- Existing createBlock defaults
- Existing renderBlock output branches
- Existing property-panel markup (moved verbatim into per-element editor components)
- Existing shared SCSS classes
- Existing selection, drag/drop, nested block, undo/redo, save/change flow

## Architecture
Each element owns its factory, renderer and property editor component. The main editor remains the orchestrator.
The parent editor object is passed to element editor components through `elementContext` so existing helper methods retain the same `this` binding.

The main editor stylesheet is switched to `ViewEncapsulation.None` so the existing SCSS remains the single UI source of truth for child editor templates; no visual rules were rewritten.

## Note
Angular CLI build/runtime was not available in this isolated workspace, so the package was validated with structural checks and TypeScript/HTML extraction checks. Run `ng build` in the actual Angular project before replacing production files.
