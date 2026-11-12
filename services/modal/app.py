"""Protected Modal entry point for deterministic CONTRA proposal verification."""

from pathlib import Path

import modal

from verification_core import verify_request

image = (
    modal.Image.debian_slim(python_version="3.13")
    .pip_install("fastapi[standard]==0.121.1")
    .add_local_file(Path(__file__).with_name("verification_core.py"), "/root/verification_core.py", copy=True)
)
app = modal.App("contra-verifier")


@app.function(image=image, timeout=30)
@modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
def verify(body: dict) -> dict:
    return verify_request(body)
