import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "services" / "modal"))

from verification_core import digest, verify_request  # noqa: E402


def fixture():
    proposal = {
        "case_id": "1" * 64,
        "citations": ["3" * 64],
        "round_id": 0,
        "status": "AI proposed",
        "terms_digest": "2" * 64,
    }
    proposal_digest = digest(proposal)
    payload = {
        "allowed_citations": ["3" * 64, proposal_digest],
        "case_id": "1" * 64,
        "evidence_digest": "3" * 64,
        "model": "contra-deterministic-verifier-v1",
        "policy_version": 2,
        "prompt_version": "CONTRA_VERIFY_V1",
        "proposal": proposal,
        "proposal_digest": proposal_digest,
        "provider": "modal",
        "role": "verifier",
        "round_id": 0,
        "schema": "CONTRA_PROVIDER_VERIFICATION_REQUEST_V1",
        "terms_digest": "2" * 64,
    }
    return {"model": "contra-deterministic-verifier-v1", "input": {"messages": [{"role": "system", "content": "untrusted evidence"}, {"role": "user", "content": json.dumps(payload, separators=(",", ":"), sort_keys=True)}], "max_tokens": 384, "temperature": 0, "response_format": {"type": "json_schema"}}}


class VerificationTests(unittest.TestCase):
    def test_matching_immutable_proposal_is_valid(self):
        result = verify_request(fixture())
        self.assertTrue(result["result"]["valid"])
        self.assertEqual(result["usage"]["total_tokens"], 0)

    def test_changed_proposal_fails_digest_binding(self):
        body = fixture()
        payload = json.loads(body["input"]["messages"][1]["content"])
        payload["proposal"]["round_id"] = 1
        body["input"]["messages"][1]["content"] = json.dumps(payload)
        result = verify_request(body)
        self.assertFalse(result["result"]["valid"])
        self.assertIn("immutable proposal digest", " ".join(result["result"]["issues"]))

    def test_unapproved_citation_fails_closed(self):
        body = fixture()
        payload = json.loads(body["input"]["messages"][1]["content"])
        payload["proposal"]["citations"] = ["4" * 64]
        payload["proposal_digest"] = digest(payload["proposal"])
        payload["allowed_citations"][-1] = payload["proposal_digest"]
        body["input"]["messages"][1]["content"] = json.dumps(payload)
        self.assertFalse(verify_request(body)["result"]["valid"])

    def test_extra_request_field_is_rejected(self):
        body = fixture()
        payload = json.loads(body["input"]["messages"][1]["content"])
        payload["settle"] = True
        body["input"]["messages"][1]["content"] = json.dumps(payload)
        with self.assertRaisesRegex(ValueError, "fields"):
            verify_request(body)

    def test_nested_unapproved_citation_fails_closed(self):
        body = fixture()
        payload = json.loads(body["input"]["messages"][1]["content"])
        payload["proposal"]["criteria"] = [{"citations": ["5" * 64]}]
        payload["proposal_digest"] = digest(payload["proposal"])
        payload["allowed_citations"][-1] = payload["proposal_digest"]
        body["input"]["messages"][1]["content"] = json.dumps(payload)
        self.assertFalse(verify_request(body)["result"]["valid"])


if __name__ == "__main__":
    unittest.main()

