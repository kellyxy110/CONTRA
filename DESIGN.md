# CONTRA interface system

This file records the durable implementation decisions for the active CONTRA interface. The approved Overview references remain `design/approved/overview-dark.jpeg` and `design/approved/overview-light.jpeg`. Explicit owner refinements take precedence where documented below.

## Product character

CONTRA is a serious contestation platform. The interface prioritises evidence, auditability, exact state and restrained confidence. It must never make fixture records look live or make a connected wallet look like transaction authority.

## Tokens

- Mint `#00EC97`: primary actions, selected navigation, verified state.
- Coral `#FF8678`: challenges and counterevidence only.
- Obsidian `#0B1110`: dark workspace.
- Deep slate `#16221D`: navigation and supporting surfaces.
- Soft white `#F5F7F5`: light surfaces and high contrast text.
- Inter, with system UI fallbacks. Main headings are 32px, section headings 18px, body 16px, dense tables 14px.
- Corners are restrained at 6px to 12px. Panels use borders and small tonal shifts, not heavy shadows.

## Canonical components

- Desktop navigation is expanded by default and uses the bottom textual Collapse or Expand control. Mobile navigation is independent.
- The active destination uses one mint treatment and `aria-current="page"`. Challenges retains only a coral icon accent while inactive.
- Theme preference uses three icon buttons for Light, Dark and System. Dark is the default.
- Data mode uses an explicit Testnet or Demo segmented control. Demo is labelled and has no wallet, contract, provider or financial authority.
- Case selection uses a searchable picker in each case-bound workspace. Long identifiers are truncated visually but remain inspectable.
- Review round selection uses the Primary or Appeal segmented control. It does not change protocol identities.
- Wallet selection is a modal list filtered to Testnet wallets that advertise NEP-413 support. Connecting authenticates only.
- Doughnut charts retain their ring in zero-data states and explain whether data is empty, loading, unavailable or denied.

## Responsive behaviour

- Four KPI cards remain one row when space allows, then two columns, then one column if text zoom requires it.
- Analysis panels are paired on desktop and stacked on narrow screens.
- Tables scroll within their labelled region.
- Navigation, dialogs and form actions maintain 44px touch targets where practical.
- Motion is removed under `prefers-reduced-motion`.

## Safety language

- AI findings are non-binding proposals.
- Demo values are simulated and isolated.
- Unavailable data is never represented as zero.
- UNKNOWN operations remain locked and are never described as retryable.
- Reviewer fixtures are never described as independent humans.

