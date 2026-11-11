"""Protected Modal entry point for deterministic CONTRA proposal verification."""

import modal

from verification_core import verify_request

app = modal.App("contra-verifier")


@app.function(timeout=30)
@modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
def verify(body: dict) -> dict:
    return verify_request(body)
