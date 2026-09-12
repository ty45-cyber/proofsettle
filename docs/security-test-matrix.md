# Security Test Matrix

| Case | Expected |
|---|---|
| Correct source chain | PASS |
| Wrong source chain | REJECT |
| Trusted emitter | PASS |
| Unknown emitter | REJECT |
| Correct event topic | PASS |
| Wrong event topic | REJECT |
| Evidence/order mismatch | REJECT |
| Evidence amount mismatch | REJECT |
| Amount above policy max | REJECT |
| Missing/invalid receipt hash | REJECT |
| Reused evidence key | REJECT |
| Already-settled order | REJECT |
| AI recommends invalid settlement | Contract rejects |
