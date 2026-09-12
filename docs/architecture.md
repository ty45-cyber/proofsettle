# Architecture

## Trust boundaries

- **Source chain:** emits the business event.
- **Attestcoin/USC:** supplies cryptographic proof of source-chain state.
- **ProofSettleVault:** deterministic authorization boundary.
- **AI agent:** recommendation and explanation only.
- **Frontend:** observability and user interaction, never authority.

## Core invariant

A settlement may execute only when all of the following are true: proof verifies, query ID matches the unique evidence key, source chain matches, trusted emitter matches, event topic matches, order ID matches, amount matches, amount stays under policy limit, and that evidence/order has not already been consumed.

## Failure path

Tampering or malformed evidence stops at the contract boundary. A UI “green” state is never sufficient to authorize a payout.
