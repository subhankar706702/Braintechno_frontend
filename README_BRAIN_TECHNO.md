# BRAIN TECHNO Frontend

Angular frontend for the BRAIN TECHNO digital business page and campaign platform.

## Editor

The template editor is a custom Zoho-style visual editor. It is not a copy of Zoho source code or proprietary assets.

### Supported editor blocks
- Section
- Heading
- Text
- Image
- Button
- Product
- Offer
- Gallery
- WhatsApp
- Contact
- Contact Form
- Map
- Divider
- Spacer

### Editor features
- Click-to-select blocks
- Stable selection state
- Drag elements from the left panel
- Drag/reorder blocks using the `⋮⋮` handle
- Move up/down
- Duplicate
- Delete
- Undo/Redo
- Desktop / Tablet / Mobile preview
- Zoom controls
- Image URL and local image upload
- Gallery URL list and local multi-image upload
- Responsive property editor
- Save design JSON
- HTML export
- JPG/PDF export
- MongoDB template save through the existing TemplateStorageService

## Design tokens
The UI uses the BRAIN TECHNO token system discussed for the project:

- Primary: `#FF4D6D`
- Primary hover: `#FF6680`
- Secondary: `#38BDF8`
- Success: `#22C55E`
- Warning: `#F59E0B`
- Danger: `#EF4444`
- Info: `#60A5FA`
- Light background: `#F5F7FA`
- Light surface: `#FFFFFF`
- Light surface 2: `#F8FAFC`
- Light border: `#E2E8F0`
- Primary text: `#0F172A`
- Secondary text: `#475569`
- Muted text: `#64748B`

Typography: `Inter`, `Noto Sans Bengali`, sans-serif.

## Run

```bash
npm install
npm start
```

Open the Angular app and go to the Templates editor route used by the existing application.

## Important

The editor is intentionally built inside the existing Angular application instead of introducing a new page-builder dependency. Existing template API/save/export flow is retained.
