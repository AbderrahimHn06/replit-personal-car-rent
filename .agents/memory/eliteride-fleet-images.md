---
name: EliteRide Fleet image upload
description: How vehicle images are stored and managed in Fleet.tsx, including the ImageUploadSection component contract.
---

## Rule
`FleetCar.images: string[]` stores up to 5 data-URL strings (base64 via FileReader). The first item is always the cover and is also synced to `FleetCar.image` (the single-cover field used everywhere in the UI).

## ImageUploadSection component
- Manages rich internal state: `VehicleImage[]` with `{ id, previewUrl, fileName, fileSize, isCover }`
- External interface: `images: string[]` in, `onChange(imgs: string[])` out (cover always first)
- Drag & drop zone + click-to-browse; validates type (JPG/PNG/WEBP) and size (max 10 MB)
- Preview grid: 2 cols mobile / 3 cols tablet / 5 cols desktop; each card has Remove + Set as Cover
- Auto-assigns cover to first image; auto-transfers cover when cover image is deleted

## VehicleFormFields `set()` signature
Accepts `string | number | boolean | object` — needed for the `prices` (object) and `images` (string[]) fields.

**Why:** FleetCar has mixed field types; a union setter avoids per-field handler boilerplate.

**How to apply:** Always use this setter for both AddVehicleModal and EditVehicleModal; never reach around it.
