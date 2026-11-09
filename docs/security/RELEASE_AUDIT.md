# M11 release audit

Audit baseline: `main` at `024eef7ec9e684eaab53e2a834c458f9ed5fc302`, 9 November 2026.

## Verified release properties

- MIT licence is present. Its SHA-256 is `9ecd3fd6d071c0a1cd886f729a506d315cc19d050664790db6869ca90ae31a6a`.
- The immutable owner reference remains unchanged at SHA-256 `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.
- `git fsck --full --no-dangling` passes.
- Documentation-link verification passes across 53 tracked Markdown files at the audit baseline. This branch adds four linked operational and security documents that enter the same check once staged.
- Core and Security source policies pass across 418 tracked files at the audit baseline.
- The dependency gate reports 15 low, zero moderate, zero high and zero critical findings. All 15 are the disclosed inherited NEAR JavaScript advisory graph. See [dependency audit](DEPENDENCY_AUDIT.md).
- Large tracked files are retained historical receipt journals, screenshots and evidence. They are not disposable build outputs.

Gitleaks scanned all 59 commits and about 28.30 MB with redaction enabled in 9 minutes 5 seconds. It reported zero leaks. A future finding would not authorise history rewriting. Any confirmed credential must be revoked first, then documented and removed from the active tree through a focused security response.

## Release boundary

The repository is a testnet release candidate, not a deployed or production-ready service. Testnet signing, hosting, provider inference and independent-reviewer participation remain external gates in [`project/BLOCKERS.md`](../../project/BLOCKERS.md). Local Sandbox evidence must not be presented as live network evidence.
