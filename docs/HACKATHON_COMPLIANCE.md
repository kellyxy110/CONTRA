# NEAR Hackathon compliance checklist

Live source: `https://nearhackathon.com/HACKATHON.md`  
Last fetched and read: 2026-11-07 UTC  
Upstream SHA-256 at that fetch: `903794f4b656b456eaee087941517d024a33633641d167b90c3f060d381d9aed`

## Eligibility and repository

- [x] NEAR-native Rust escrow, contestation, challenge and deterministic settlement are present.
- [x] Primary track is `security`; additional applicable track is `open`.
- [x] Actual history is preserved. Implementation began 2026-10-28, inside the eligible period that began with the 2026-10-19 announcement.
- [x] Repository `kellyxy110/CONTRA` was verified public on 2026-11-03.
- [x] MIT license is present.
- [ ] Confirm the default branch exposes this implementation or an immediate reproducible path before submission.
- [ ] Confirm whether the team lead is entering another independent project. If yes, add mutual README disclosure. Maximum two projects per person.

## Truthful verification

- [x] Local Sandbox results, deterministic fixtures, testnet state and provider state are labelled separately.
- [x] No controlled fixture account is described as an independent operator.
- [x] No testnet transaction, deployment or paid-provider result is claimed without evidence.
- [x] README provides prerequisites, commands and expected results.
- [ ] Complete authorised testnet and live-provider evidence for AC31 and AC32, or retain their blocked status.
- [ ] Produce the final video and UI work after M05 through M07 core verification.

## Security and submission

- [x] No mainnet execution is authorised.
- [x] No submission, X post, signing, deployment or paid usage occurs without owner authorisation.
- [x] Secrets belong only in server environment variables and are excluded from Git.
- [x] Working tree and full Git patch history credential-pattern scans returned no findings on 2026-11-07.
- [ ] Repeat the full repository history credential scan before release freeze.
- [ ] Fetch the live `HACKATHON.md` again immediately before submission.
- [ ] Collect the owner-decided project name, lead name, email, team size, payout account, repository URL, X demo URL, description and contact consent.
- [ ] Display the complete JSON payload to the owner and obtain explicit approval before the single submission.
- [ ] Use the official change-request process instead of a second submission if correction is needed.
