"""Pure, deterministic validation for CONTRA's Modal verification boundary."""

from __future__ import annotations

import hashlib
import json
import re
from typing import Any

HASH32 = re.compile(r"^[0-9a-f]{64}$")
REQUEST_FIELDS = {
    "allowed_citations",
    "case_id",
    "evidence_digest",
    "model",
    "policy_version",
    "prompt_version",
    "proposal",
    "proposal_digest",
    "provider",
    "role",
    "round_id",
    "schema",
    "terms_digest",
}


def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True)


def digest(value: Any) -> str:
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()


def _hash(value: Any) -> bool:
    return isinstance(value, str) and HASH32.fullmatch(value) is not None


def _citations(value: Any) -> list[Any]:
    found: list[Any] = []
    if isinstance(value, dict):
        for key, item in value.items():
            if key == "citations":
                if not isinstance(item, list):
                    found.append(None)
                else:
                    found.extend(item)
            else:
                found.extend(_citations(item))
    elif isinstance(value, list):
        for item in value:
            found.extend(_citations(item))
    return found


def verify_request(body: Any) -> dict[str, Any]:
    issues: list[str] = []
    if not isinstance(body, dict) or set(body) != {"model", "input"}:
        raise ValueError("Modal request envelope is invalid")
    if len(canonical(body).encode("utf-8")) > 65536:
        raise ValueError("Modal request exceeds the verification limit")
    request_input = body.get("input")
    if not isinstance(request_input, dict) or set(request_input) != {"messages", "max_tokens", "response_format", "temperature"}:
        raise ValueError("Modal request input is invalid")
    messages = request_input.get("messages") if isinstance(request_input, dict) else None
    if not isinstance(messages, list) or len(messages) != 2 or not all(isinstance(item, dict) for item in messages) or messages[1].get("role") != "user":
        raise ValueError("Modal request messages are invalid")
    try:
        payload = json.loads(messages[1]["content"])
    except (KeyError, TypeError, json.JSONDecodeError) as error:
        raise ValueError("Modal request payload is not valid JSON") from error
    if not isinstance(payload, dict) or set(payload) != REQUEST_FIELDS:
        raise ValueError("Modal verification payload fields are invalid")

    proposal_digest = payload.get("proposal_digest")
    proposal = payload.get("proposal")
    citations = payload.get("allowed_citations")
    if not _hash(proposal_digest):
        raise ValueError("Proposal digest is invalid")
    if not isinstance(citations, list) or not citations or len(citations) > 17 or len(set(citations)) != len(citations) or not all(_hash(item) for item in citations):
        raise ValueError("Allowed citations are invalid")
    if proposal_digest not in citations:
        issues.append("Proposal digest is absent from the allowed citation set")
    if body.get("model") != "contra-deterministic-verifier-v1" or payload.get("model") != body.get("model"):
        issues.append("Verifier function identity is invalid")
    if not isinstance(proposal, dict) or digest(proposal) != proposal_digest:
        issues.append("Proposal bytes do not match the immutable proposal digest")
    else:
        identities = (
            ("case_id", payload.get("case_id")),
            ("terms_digest", payload.get("terms_digest")),
            ("round_id", payload.get("round_id")),
        )
        if any(proposal.get(field) != expected for field, expected in identities):
            issues.append("Proposal identity does not match the requested case and round")
        if proposal.get("status") != "AI proposed":
            issues.append("Proposal status is not a non-binding AI proposal")
        cited = _citations(proposal)
        if not cited or any(not _hash(item) or item not in citations for item in cited):
            issues.append("Proposal citations are absent or outside the allowed evidence set")

    if payload.get("schema") != "CONTRA_PROVIDER_VERIFICATION_REQUEST_V1" or payload.get("provider") != "modal" or payload.get("role") != "verifier":
        issues.append("Verification request identity is invalid")
    if payload.get("policy_version") != 2 or payload.get("prompt_version") != "CONTRA_VERIFY_V1":
        issues.append("Verification policy version is unsupported")

    return {
        "result": {
            "checked_finding_digest": proposal_digest,
            "citations": [proposal_digest],
            "issues": issues,
            "schema": "CONTRA_PROVIDER_VERIFICATION_V1",
            "valid": not issues,
        },
        "model": "contra-deterministic-verifier-v1",
        "usage": {"completion_tokens": 0, "prompt_tokens": 0, "total_tokens": 0},
    }

