# CONTRA commitment test vectors v1

Freeze: CONTRA-2026-10-28-UX3C. Specification fixtures generated locally, not live votes, deployed-contract tests or secret reviewer nonces. Shared Rust/browser test oracles for the first eligible implementation. Canonical ABI: [CONTRACT_ABI_V1.md](CONTRACT_ABI_V1.md).

## Vote preimage

SHA-256 over a Borsh struct with these exact fields in order:

| Order | Field | Borsh type |
| --- | --- | --- |
| 1 | domain = CONTRA:VOTE:v1 | String |
| 2 | chain_id = testnet in deployed v1 | String |
| 3 | contract_account | AccountId encoded as String |
| 4 | case_id | [u8;32] |
| 5 | terms_digest | [u8;32] |
| 6 | round_id (0 primary, 1 fresh) | u8 |
| 7 | reviewer_account (immediate predecessor) | AccountId encoded as String |
| 8 | disposition (ACCEPT=0, REJECT=1, UNRESOLVED=2) | u8 |
| 9 | evidence_digest (round-specific) | [u8;32] |
| 10 | finding_digest (immutable offchain finding bytes) | [u8;32] |
| 11 | nonce (32 random bytes in production) | [u8;32] |

String = u32 little-endian byte length + UTF-8 bytes, arrays = raw fixed bytes, no JSON quotes/hex characters inside array encoding, no separator characters, no implicit struct tag, no trailing bytes. Hash strings are decoded before serialization; serialized length prefixes count bytes, not codepoints. Domain is case-sensitive and distinct from terms/case/challenge/payout domains. Nonce must be cryptographically random for real commitments and retained encrypted under reviewer control until reveal; do not reuse these public fixture values. Store only commitment until reveal. The contract reconstructs chain and current contract, case/terms/round evidence from its own state, not caller-supplied alternate context.

Round 0 evidence_digest = submitted manifest digest. Round 1 evidence_digest = SHA256(Borsh(ChallengeBundleV1)) with fields: domain:String CONTRA:CHALLENGE:v1; chain_id:String; contract_account:AccountId; case_id:Hash32; terms_digest:Hash32; original_manifest_digest:Hash32; criterion_id:u16; counterexample_digest:Hash32. This binds original and counterexample evidence and prevents a fresh-round vote from ignoring the contested claim. Criterion ID must exist, counterexample must be nonzero and different from the original manifest. Contract uses the recorded bundle hash for fresh reveals.

## Base fixture

All hex fields below contain exactly 32 bytes. This synthetic case_id and terms digest need not correspond to a funded case; the vectors test byte encoding only.

```json
{
  "domain": "CONTRA:VOTE:v1",
  "chain": "testnet",
  "contract": "contra.testnet",
  "case": "4444444444444444444444444444444444444444444444444444444444444444",
  "terms": "1111111111111111111111111111111111111111111111111111111111111111",
  "round": 0,
  "reviewer": "reviewer-a.testnet",
  "disposition": 0,
  "evidence": "2222222222222222222222222222222222222222222222222222222222222222",
  "finding": "3333333333333333333333333333333333333333333333333333333333333333",
  "nonce": "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
}
```

Base uses nonce bytes 00..1f, and repeated byte digests as shown. Challenge fixture adds criterion_id=1, counterexample_digest=5555555555555555555555555555555555555555555555555555555555555555. Challenge bundle length=182, SHA-256=b8a08010dc8f65de3f9d87983c9ecc8f05945788e237cfb79092bd53a2a6c3df.

Challenge bundle preimage, full hex:

```text
13000000434f4e5452413a4348414c4c454e47453a763107000000746573746e65740e000000636f6e7472612e746573746e657444444444444444444444444444444444444444444444444444444444444444441111111111111111111111111111111111111111111111111111111111111111222222222222222222222222222222222222222222222222222222222222222201005555555555555555555555555555555555555555555555555555555555555555
```

## Expected commitments

Each row replaces only the named base fields. V04 binds the fresh bundle digest AND round=1. V05 is an intentionally invalid live network context used for replay rejection.

| ID | Difference from base | Preimage bytes | Expected SHA-256 |
| --- | --- | --- | --- |
| V01 | Base ACCEPT | 231 | 699b4c6db3682d7d671ac420251073d8008bc46fa0fcb4852b4c1f7a79a5a63c |
| V02 | disposition=1 | 231 | 9d76e11863fc01d500e90bd98d56bfa2a439dace3850a52204245e3a0a05c51b |
| V03 | disposition=2 | 231 | ae575c5f328c985128a4db76402d2ff359512722a2c8ad8779506937e6096318 |
| V04 | round=1; evidence=b8a08010dc8f65de3f9d87983c9ecc8f05945788e237cfb79092bd53a2a6c3df | 231 | 20bd896727d1ecf15ef1fac2b20377b0ce8dc6f85c90057bdd9dd918e96911d8 |
| V05 | chain=mainnet | 231 | 9561912888a8f62bb0736309e0d9e8e634a2d5fa93d96614714e0871066041d3 |
| V06 | contract=other.testnet | 230 | 080a39fa76bacdf52171647779576b0d18cce4b423c3d72cc5006b7ab1675995 |
| V07 | case=4545454545454545454545454545454545454545454545454545454545454545 | 231 | 5dd15cf6e1e144df5198f3e32cc05e7f938cbf51210bc9c3d4dd608bbf339f8e |
| V08 | reviewer=reviewer-b.testnet | 231 | 90f33729f229f17a9cccd077ac95598fd661f20fc68097c4310ca96151fbd4b9 |
| V09 | terms=1212121212121212121212121212121212121212121212121212121212121212 | 231 | eb19656da744c5ef16c3d8e776aa58ee079eb532ece0c2ef2156178221207224 |
| V10 | evidence=2323232323232323232323232323232323232323232323232323232323232323 | 231 | 2d098bec432db6360f012be7330a9039b8874dc2e6028760e06e9e6028d1766e |
| V11 | finding=3434343434343434343434343434343434343434343434343434343434343434 | 231 | 96dcdaa46f4e9a2132398842f5082696fbfa6be604d851454da760b912651868 |
| V12 | nonce=ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff | 231 | f05571b0f6574163a673f70a7840c00a9b8b66edec967138a25722607609865b |

V01 preimage, full hex:

```text
0e000000434f4e5452413a564f54453a763107000000746573746e65740e000000636f6e7472612e746573746e657444444444444444444444444444444444444444444444444444444444444444441111111111111111111111111111111111111111111111111111111111111111001200000072657669657765722d612e746573746e65740022222222222222222222222222222222222222222222222222222222222222223333333333333333333333333333333333333333333333333333333333333333000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
```

V04 fresh-round preimage, full hex:

```text
0e000000434f4e5452413a564f54453a763107000000746573746e65740e000000636f6e7472612e746573746e657444444444444444444444444444444444444444444444444444444444444444441111111111111111111111111111111111111111111111111111111111111111011200000072657669657765722d612e746573746e657400b8a08010dc8f65de3f9d87983c9ecc8f05945788e237cfb79092bd53a2a6c3df3333333333333333333333333333333333333333333333333333333333333333000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
```

The table's input changes plus the explicit schema reconstruct every row. SHA256 of empty bytes is e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; use as a hash primitive sanity check, never as a valid evidence object by default.

## Encoding and domain tests required (NOT RUN in contract)

CV01: Rust Borsh serialization and independently implemented browser byte builder match V01 and V04 byte-for-byte, then SHA-256 matches all V01-V12 hashes (AC12).
CV02: All changed-context vectors differ from V01. Committing V01 then revealing another chain/contract/case/terms/round/reviewer/evidence/finding/disposition/nonce must reject E_COMMITMENT or earlier context/phase/auth guard; no vote counted (AC12/13).
CV03: Uppercase/odd/wrong-length hex, invalid AccountId, numeric U64/U128 JSON, floating-point amount, noncanonical decimal, unknown fields, duplicate JSON keys, unknown disposition=3/round=2 and trailing Borsh bytes reject, without partial writes (AC05/12/29).
CV04: Literal hex ASCII instead of decoded digest bytes, big-endian prefixes, delimiter-joined text, JSON serialization, reordered terms fields and altered domain case do not match commitments. UTF-8 strings use byte counts; account IDs still obey ASCII syntax (AC12).
CV05: Same creator/request in create returns original ID/digest; changed terms/digest conflicts; distinct creator/network/contract/request changes creation key. preview and create encode exact FrozenTermsV1; funding validates stored digest (AC05-07).
CV06: Changing any criterion, deadline, fallback, party/operator ID, amount, evidence policy or committee snapshot changes terms_digest. Changing any original manifest/counterexample/criterion/case/terms changes fresh bundle hash (AC07/09/15/17).
CV07: Round-0 V01 cannot be revealed in fresh round; no nonce logging before/after reveal, no production fixture nonce reuse; reveal calldata is publicly visible, not confidential (AC12/17/29).

Local document preparation computes bytes/hashes with Node crypto, independently reconstructs bytes with Python struct/hashlib, and checks the same bytes with OpenSSL. All 12 vote fixtures plus the challenge bundle agree. The initial OpenSSL check lacked a hex-decoder executable, was detected and corrected before reporting success. This is serialization/hash fixture validation only. It does not demonstrate Rust/browser interoperability, authentication, NEAR runtime behavior or sandbox financial invariants. Those tests are mandatory on November 1 or later.

Reference: [Borsh encoding specification](https://borsh.io/), reviewed 2026-10-28.


## Creation, terms and payout golden fixtures

The following inputs are synthetic future-window fixtures, not actual accounts, registry attestations, deposits or transactions. The six listed snapshots are ordered exactly as primary then fresh. The ordinary TermsInput uses the ABI field order; fallback ordinals are both zero. Creation identity, terms and payout use independent domains. P01 assumes an unchallenged ACCEPT/PRIMARY payout solely to test serialization.

```json
{
  "key": {
    "domain": "CONTRA:CASE:v1",
    "chain_id": "testnet",
    "contract_account": "contra.testnet",
    "creator_id": "creator.testnet",
    "request_id": "6666666666666666666666666666666666666666666666666666666666666666"
  },
  "terms_input": {
    "beneficiary_id": "beneficiary.testnet",
    "creator_operator_id": "0101010101010101010101010101010101010101010101010101010101010101",
    "beneficiary_operator_id": "0202020202020202020202020202020202020202020202020202020202020202",
    "amount_yocto": "5000000000000000000000000",
    "fund_by_ns": "1793491800000000000",
    "submit_by_ns": "1793492400000000000",
    "primary_commit_end_ns": "1793493000000000000",
    "primary_reveal_end_ns": "1793493600000000000",
    "challenge_end_ns": "1793494200000000000",
    "fresh_commit_end_ns": "1793494800000000000",
    "fresh_reveal_end_ns": "1793495400000000000",
    "criteria": [
      {
        "criterion_id": 1,
        "kind": "GENERAL",
        "requirement_digest": "7777777777777777777777777777777777777777777777777777777777777777"
      },
      {
        "criterion_id": 2,
        "kind": "KEYBOARD",
        "requirement_digest": "8888888888888888888888888888888888888888888888888888888888888888"
      }
    ],
    "evidence_policy_digest": "9999999999999999999999999999999999999999999999999999999999999999",
    "policy_version": 1,
    "base_fallback": "BASE_REFUND_V1",
    "challenge_fallback": "KEEP_PRIMARY_V1"
  },
  "primary_committee": [
    {
      "reviewer_id": "reviewer-01.testnet",
      "operator_id": "1010101010101010101010101010101010101010101010101010101010101010",
      "revision": "1",
      "disclosure_digest": "2020202020202020202020202020202020202020202020202020202020202020"
    },
    {
      "reviewer_id": "reviewer-02.testnet",
      "operator_id": "1111111111111111111111111111111111111111111111111111111111111111",
      "revision": "1",
      "disclosure_digest": "2121212121212121212121212121212121212121212121212121212121212121"
    },
    {
      "reviewer_id": "reviewer-03.testnet",
      "operator_id": "1212121212121212121212121212121212121212121212121212121212121212",
      "revision": "1",
      "disclosure_digest": "2222222222222222222222222222222222222222222222222222222222222222"
    }
  ],
  "fresh_committee": [
    {
      "reviewer_id": "reviewer-04.testnet",
      "operator_id": "1313131313131313131313131313131313131313131313131313131313131313",
      "revision": "1",
      "disclosure_digest": "2323232323232323232323232323232323232323232323232323232323232323"
    },
    {
      "reviewer_id": "reviewer-05.testnet",
      "operator_id": "1414141414141414141414141414141414141414141414141414141414141414",
      "revision": "1",
      "disclosure_digest": "2424242424242424242424242424242424242424242424242424242424242424"
    },
    {
      "reviewer_id": "reviewer-06.testnet",
      "operator_id": "1515151515151515151515151515151515151515151515151515151515151515",
      "revision": "1",
      "disclosure_digest": "2525252525252525252525252525252525252525252525252525252525252525"
    }
  ],
  "payout_intent": {
    "domain": "CONTRA:PAYOUT:v1",
    "chain_id": "testnet",
    "contract_account": "contra.testnet",
    "case_id": "1505d5e364c6eec87cb326c396558298e0e8202861d7685411cdca58750e32f1",
    "terms_digest": "d000c104d8515b781858ec92322365c8275ecaaab49cea3cc593cd9410f1d1e3",
    "recipient_id": "beneficiary.testnet",
    "amount_yocto": "5000000000000000000000000",
    "disposition": "ACCEPT",
    "resolution_basis": "PRIMARY"
  }
}
```

### C01

Length 98 bytes; SHA-256 `1505d5e364c6eec87cb326c396558298e0e8202861d7685411cdca58750e32f1`.

```text
0e000000434f4e5452413a434153453a763107000000746573746e65740e000000636f6e7472612e746573746e65740f00000063726561746f722e746573746e65746666666666666666666666666666666666666666666666666666666666666666
```

### T01

Length 938 bytes; SHA-256 `d000c104d8515b781858ec92322365c8275ecaaab49cea3cc593cd9410f1d1e3`.

```text
0f000000434f4e5452413a5445524d533a763107000000746573746e65740e000000636f6e7472612e746573746e657466666666666666666666666666666666666666666666666666666666666666660f00000063726561746f722e746573746e65741300000062656e65666963696172792e746573746e65740101010101010101010101010101010101010101010101010101010101010101020202020202020202020202020202020202020202020202020202020202020200000025a4000a8bca220400000000000070932e4ac3e31800e05ce1d5c3e3180050269461c4e31800c0ef46edc4e3180030b9f978c5e31800a082ac04c6e31800104c5f90c6e31802000000010000777777777777777777777777777777777777777777777777777777777777777702000188888888888888888888888888888888888888888888888888888888888888889999999999999999999999999999999999999999999999999999999999999999010000001300000072657669657765722d30312e746573746e65741010101010101010101010101010101010101010101010101010101010101010010000000000000020202020202020202020202020202020202020202020202020202020202020201300000072657669657765722d30322e746573746e65741111111111111111111111111111111111111111111111111111111111111111010000000000000021212121212121212121212121212121212121212121212121212121212121211300000072657669657765722d30332e746573746e65741212121212121212121212121212121212121212121212121212121212121212010000000000000022222222222222222222222222222222222222222222222222222222222222221300000072657669657765722d30342e746573746e65741313131313131313131313131313131313131313131313131313131313131313010000000000000023232323232323232323232323232323232323232323232323232323232323231300000072657669657765722d30352e746573746e65741414141414141414141414141414141414141414141414141414141414141414010000000000000024242424242424242424242424242424242424242424242424242424242424241300000072657669657765722d30362e746573746e6574151515151515151515151515151515151515151515151515151515151515151501000000000000002525252525252525252525252525252525252525252525252525252525252525
```

### P01

Length 154 bytes; SHA-256 `124236de5e8e68eb3f366382b4c5b0e8d335ecfc83543cb6e2c647ae9415ba9c`.

```text
10000000434f4e5452413a5041594f55543a763107000000746573746e65740e000000636f6e7472612e746573746e65741505d5e364c6eec87cb326c396558298e0e8202861d7685411cdca58750e32f1d000c104d8515b781858ec92322365c8275ecaaab49cea3cc593cd9410f1d1e31300000062656e65666963696172792e746573746e657400000025a4000a8bca220400000000000000
```

CV08 (NOT RUN in contract): independently reconstruct C01/T01/P01 in Rust/browser, match bytes and hashes; ID01/ID05 funding consent and SR03 immutable intent use these canonical fixtures. Hash and byte checks during document preparation do not execute those contract methods.
