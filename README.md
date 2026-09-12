# ProofSettle

Cross-chain settlement infrastructure for the BUIDL CTC Fall 2026 hackathon.

> **AI recommends. Attestcoin proves. Creditcoin decides.**

ProofSettle turns an on-chain business milestone into a cryptographically verifiable settlement decision. The AI agent can explain and coordinate a decision, but deterministic policy checks and on-chain verification remain authoritative.

## Architecture

Ethereum Sepolia / any EVM source -> Attestcoin/USC proof -> Creditcoin ProofSettleVault -> policy checks -> settlement -> audit trail

The project deliberately avoids deprecated pre-2026 USC patterns. Current production integration uses the native USC SDK/proof flow documented by Gluwa.

## Monorepo

- `apps/web` — Next.js judge-facing settlement console
- `packages/core` — domain logic, policies, validation, agent contracts, USC adapter interfaces
- `contracts` — Solidity settlement vault and source-chain milestone registry
- `scripts` — real-chain integration helpers and config validation
- `docs` — architecture, security model, demo runbook, submission copy

## Fastest verification

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Real-chain mode

Copy `.env.example` to `.env`, provide RPC URLs and deployed contract addresses, then use `scripts/real-demo.mjs`. The script is intentionally credential-free until you supply your own funded deployer.

## Security posture

1. AI never becomes an authorization boundary.
2. Evidence is bound to a specific order, emitter, chain, event and amount.
3. Each settlement consumes a unique evidence key.
4. Refund/recovery is separate from automatic release.
5. The UI exposes proof metadata and policy decisions rather than hiding them behind a generic “success” state.

## License

MIT
