# Redesign browser checks

`npm run test:browser` starts the local Node API in unavailable-chain mode and opens Chromium and Firefox at 320, 390, 768, 1024 and 1440 pixel widths. It checks that all eight readiness sectors render, percentage guide labels are absent, the document does not overflow horizontally, every desktop route works, the mobile More to Settlement route works, and no page error occurs. It saves full-page screenshots to `ci-output/frontend-*.png`.

Core CI installs the pinned Playwright Chromium and Firefox runtimes and uploads the screenshots with its reports. A passing run proves the shell and unavailable-chain navigation in both browsers. It does not prove wallet authentication, protected case writes, signed Testnet actions or visual identity with the owner's private reference. Review the screenshots against the supplied reference before merging or deploying.
