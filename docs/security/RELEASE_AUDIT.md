# M11 release audit

Original audit baseline: `main` at `024eef7ec9e684eaab53e2a834c458f9ed5fc302`, 9 November 2026. Current release evidence refreshed 13 November 2026.

## Verified release properties

- MIT licence is present. Its SHA-256 is `9ecd3fd6d071c0a1cd886f729a506d315cc19d050664790db6869ca90ae31a6a`.
- The immutable owner reference remains unchanged at SHA-256 `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.
- `git fsck --full --no-dangling` passes.
- Documentation-link verification passes across 75 tracked Markdown files.
- Core source policy passes across 498 tracked files, with the corresponding hosted Security policy required on the release head.
- The dependency gate reports 13 low, zero moderate, zero high and zero critical findings. All 13 are the disclosed inherited NEAR JavaScript advisory graph. See [dependency audit](DEPENDENCY_AUDIT.md).
- Large tracked files are retained historical receipt journals, screenshots and evidence. They are not disposable build outputs.

Gitleaks scanned all 59 commits and about 28.30 MB with redaction enabled in 9 minutes 5 seconds. It reported zero leaks. A future finding would not authorise history rewriting. Any confirmed credential must be revoked first, then documented and removed from the active tree through a focused security response.

## Release boundary

The public Cloudflare service and NEAR Testnet contract are deployed, but the product is not production ready. Live operation-specific signing, six independently controlled reviewers and a genuine funded settlement remain external gates in [`project/BLOCKERS.md`](../../project/BLOCKERS.md). Local Sandbox evidence and controlled browser fixtures must not be presented as live network evidence.
