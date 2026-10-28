# Design reference integrity contract

The owner selected this exact screenshot as CONTRA's source design reference. It MUST remain byte-for-byte unchanged.

- Canonical file: `design/reference/control-ai-policy-dashboard.jpeg`
- Original filename preserved at: `design/reference/IMG_7408.jpeg` (identical bytes)
- Source upload: `IMG_7408.jpeg`
- Format: JPEG
- Original dimensions: 1200 x 900 pixels
- Original byte count: 165435
- SHA-256: `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`

## Exact check

```sh
sha256sum design/reference/control-ai-policy-dashboard.jpeg
```

Expected digest:

```text
ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a
```

Do not crop, replace, adjust color, modify metadata, compress, annotate or upscale the file. Any re-encoding that changes bytes fails the check. Render it unmodified as an internal design reference; implement a separate coded CONTRA UI that adopts the layout and NEAR-aligned palette. Do not present the static screenshot as an interactive product.

The source screenshot's original colors and contents must stay intact in the reference file. Changing colors in the newly implemented interface is authorized. Changing colors inside the image is not.

Both reference files must retain exactly this SHA-256: `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.
