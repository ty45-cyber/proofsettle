# 3-minute judge runbook

1. Show one pending `PS-1042` order.
2. Trigger `MilestoneCompleted` on the source chain.
3. Open the evidence panel and show the source tx/block metadata.
4. Generate the USC proof with the current Gluwa SDK/proof service.
5. Submit the proof to Creditcoin and show the policy gates turning green.
6. Execute settlement once.
7. Toggle “Simulate tampered evidence” and rerun; demonstrate HOLD/REJECT.
8. Show the explorer links / transaction hashes.

The local UI can be run without credentials for design review. Real cryptographic verification requires the supplied environment and live network deployments.
