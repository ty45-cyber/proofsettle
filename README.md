# ProofSettle

**Verifiable cross-chain settlement infrastructure for applications that need proof before payment.**

ProofSettle enables an application to condition settlement on a cryptographically verified event occurring on another blockchain.

The architecture separates three responsibilities:

* **Attestcoin / Creditcoin USC** — proves that the external blockchain event actually occurred.
* **Deterministic smart-contract policy** — decides whether the verified evidence satisfies settlement requirements.
* **AI agent** — interprets verified state and coordinates the workflow without possessing authority to bypass protocol rules.

> **AI recommends. Cryptography proves. Smart contracts decide.**

---

## 1. Product

Businesses frequently depend on centralized systems to determine whether an order, delivery, milestone, invoice, or other obligation has been completed before releasing funds.

That creates a trust problem:

```text
External Event
      ↓
Centralized verification
      ↓
Manual decision
      ↓
Payment
```

ProofSettle changes this to:

```text
External Blockchain Event
          ↓
   Attestcoin / USC
          ↓
 Cryptographically Verified Evidence
          ↓
 Deterministic Settlement Policy
          ↓
       AI Agent
          ↓
    Creditcoin Settlement
```

The blockchain event becomes the source of truth.

---

# 2. Core Principle

ProofSettle deliberately prevents the AI layer from becoming the trust boundary.

The AI agent can:

* inspect verified evidence
* explain settlement conditions
* evaluate policy state
* recommend an action
* prepare a settlement request
* communicate the result to the user

The AI agent cannot:

* fabricate blockchain evidence
* modify verified transaction data
* bypass settlement policy
* authorize an invalid order
* settle the same obligation twice

The smart contract remains authoritative.

---

# 3. Example Use Case

A buyer agrees to pay a supplier when a delivery milestone is recorded.

### Step 1 — Order creation

The buyer creates:

```text
Order: PS-1042
Buyer: 0x...
Supplier: 0x...
Amount: $10,000
Required milestone: DELIVERY_CONFIRMED
```

### Step 2 — External event

The source-chain application records:

```text
DELIVERY_CONFIRMED
```

### Step 3 — Evidence verification

Attestcoin / Creditcoin USC verifies the source-chain evidence.

### Step 4 — Policy evaluation

ProofSettle validates:

```text
✓ Correct source chain
✓ Correct transaction
✓ Correct event
✓ Correct order
✓ Correct supplier
✓ Correct milestone
✓ Correct amount
✓ Not previously settled
```

### Step 5 — AI interpretation

The AI agent produces a human-readable recommendation:

```text
SETTLE

The required delivery milestone has been cryptographically
verified and all settlement policy conditions have passed.
```

### Step 6 — Settlement

The Creditcoin contract executes the permitted settlement.

---

# 4. Architecture

```text
                         SOURCE CHAIN
                       Ethereum Sepolia
                              │
                              │
                       Order / Event
                              │
                              ▼
                    ┌──────────────────┐
                    │    Attestcoin    │
                    │  USC Verification│
                    └────────┬─────────┘
                             │
                     Verified Evidence
                             │
                             ▼
                 ┌────────────────────────┐
                 │      ProofSettle        │
                 │                        │
                 │  Evidence Validation   │
                 │  Policy Enforcement    │
                 │  Replay Protection     │
                 │  Settlement Execution  │
                 └───────────┬────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
          Settlement                 AI Agent
                                      │
                                      ▼
                              Human Explanation
                                      │
                                      ▼
                                Next.js UI
```

---

# 5. Trust Model

ProofSettle follows a strict trust hierarchy.

### Level 1 — Cryptographic evidence

The source-chain event must be proven.

### Level 2 — Protocol validation

The proof must correspond to the expected transaction/event.

### Level 3 — Application policy

The verified event must satisfy the order's deterministic conditions.

### Level 4 — AI interpretation

The AI explains and coordinates the already-verified state.

Therefore:

```text
AI output ≠ authorization
```

Instead:

```text
Verified Evidence
        +
Deterministic Policy
        =
Authorization
```

---

# 6. Repository Structure

```text
proofsettle/
│
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── lib/
│       ├── public/
│       ├── package.json
│       └── ...
│
├── contracts/
│   ├── src/
│   │   ├── OrderRegistry.sol
│   │   ├── ProofSettleVault.sol
│   │   └── interfaces/
│   │
│   ├── test/
│   ├── script/
│   └── foundry.toml
│
├── agent/
│   ├── src/
│   ├── tests/
│   └── package.json
│
├── scripts/
│   ├── demo/
│   ├── deployment/
│   └── verification/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── DEMO.md
│   └── DEPLOYMENT.md
│
├── .github/
│   └── workflows/
│
├── .env.example
├── package.json
└── README.md
```

---

# 7. Production Build Phases

The project is developed in explicit phases.

This prevents premature feature expansion and ensures every phase produces a verifiable improvement to the product.

---

## Phase 0 — Foundation

### Objective

Establish a reproducible engineering environment.

### Deliverables

* repository structure
* TypeScript configuration
* Next.js application
* Solidity/Foundry configuration
* environment configuration
* linting
* type checking
* CI
* documentation baseline

### Exit criteria

```text
✓ Repository installs successfully
✓ Frontend starts locally
✓ TypeScript passes
✓ Contracts compile
✓ CI executes successfully
```

---

# Phase 1 — Source-Chain Order Registry

### Objective

Create the source-chain event that ProofSettle will eventually prove.

### Components

`OrderRegistry.sol`

Responsibilities:

* create orders
* register buyer
* register supplier
* define amount
* define required milestone
* record milestone completion
* emit deterministic events

### Security requirements

* validate addresses
* validate amounts
* prevent invalid order transitions
* prevent unauthorized milestone submission
* emit indexed events
* maintain explicit order state

### Exit criteria

```text
✓ Order can be created
✓ Authorized milestone can be submitted
✓ Invalid transitions are rejected
✓ Events contain all required verification data
✓ Contract tests pass
```

---

# Phase 2 — Evidence Verification

### Objective

Connect the application to Creditcoin's Universal Smart Contract / Attestcoin verification mechanism.

The contract must verify external-chain evidence rather than trusting caller-supplied claims.

### Verification requirements

ProofSettle must validate:

```text
source chain
transaction
transaction index
event
event emitter
event payload
order identifier
amount
milestone
```

### Critical security rule

Never treat these values as trusted merely because they were submitted by the caller:

```text
emitter
amount
orderId
milestone
```

They must be derived from or validated against the proven transaction data.

### Exit criteria

```text
✓ Valid external event accepted
✓ Invalid proof rejected
✓ Incorrect emitter rejected
✓ Incorrect amount rejected
✓ Incorrect order rejected
✓ Incorrect milestone rejected
```

---

# Phase 3 — Deterministic Settlement Policy

### Objective

Turn verified evidence into an enforceable settlement decision.

### Policy example

```text
IF

verified_event == true
AND
order_exists == true
AND
order_status == APPROVED
AND
supplier == verified_supplier
AND
milestone == required_milestone
AND
amount <= approved_amount
AND
settled == false

THEN

settlement_allowed == true
```

The policy executes entirely on-chain.

### Exit criteria

```text
✓ Valid evidence settles
✓ Invalid evidence cannot settle
✓ Excess amount cannot settle
✓ Wrong supplier cannot settle
✓ Wrong milestone cannot settle
✓ Already-settled order cannot settle
```

---

# Phase 4 — Replay Protection

### Objective

Guarantee that one verified obligation cannot be settled multiple times.

Each settlement request must have a unique identity.

Example:

```text
settlementId =
hash(
    sourceChain,
    transactionHash,
    orderId,
    milestone
)
```

The contract records consumed settlement identifiers.

```text
UNCONSUMED
     ↓
 VERIFIED
     ↓
 SETTLED
     ↓
 CONSUMED
```

Any attempt to reuse the same settlement proof must fail.

### Exit criteria

```text
✓ First settlement succeeds
✓ Second identical settlement reverts
✓ Different valid settlement remains possible
✓ Replay state is observable on-chain
```

---

# Phase 5 — AI Agent

### Objective

Add intelligence without introducing an additional trust dependency.

The agent receives:

```text
order state
+
verified evidence
+
policy state
+
settlement status
```

It returns:

```json
{
  "decision": "SETTLE",
  "orderId": "PS-1042",
  "amount": "10000",
  "policyChecks": [
    "verified_event",
    "correct_order",
    "correct_supplier",
    "correct_milestone",
    "amount_valid",
    "not_settled"
  ],
  "reason": "All deterministic settlement conditions passed."
}
```

### Agent constraints

The agent must never be the final authorization layer.

The correct flow is:

```text
AI recommendation
        ↓
Smart-contract policy
        ↓
Settlement
```

Not:

```text
AI recommendation
        ↓
Unrestricted wallet
        ↓
Settlement
```

### Exit criteria

```text
✓ Agent reads verified state
✓ Agent produces structured recommendation
✓ Agent explains policy results
✓ Agent cannot bypass contract policy
✓ Agent failure does not compromise settlement security
```

---

# Phase 6 — Judge-Facing Application

### Objective

Make the cryptographic infrastructure understandable within seconds.

The primary screen should expose the settlement lifecycle.

### Dashboard

```text
PROOFSETTLE

Order #PS-1042
$10,000
Buyer → Supplier

STATUS
Waiting for verified milestone
```

After evidence is submitted:

```text
SOURCE CHAIN
Ethereum Sepolia

TRANSACTION
0x...

EVENT
DELIVERY_CONFIRMED

ATTESTCOIN
✓ Transaction verified
✓ Event verified
✓ Evidence valid
```

Then:

```text
SETTLEMENT POLICY

✓ Correct order
✓ Correct supplier
✓ Correct milestone
✓ Amount within limit
✓ Replay check passed

7 / 7 CONDITIONS PASSED
```

Finally:

```text
SETTLEMENT

✓ AUTHORIZED
✓ EXECUTED

Creditcoin transaction:
0x...
```

### Exit criteria

A judge should understand:

1. what happened
2. what was proven
3. why settlement was allowed
4. what transaction executed

without reading the source code.

---

# Phase 7 — Adversarial Security Testing

This phase is mandatory before production deployment.

ProofSettle must demonstrate not only that valid transactions work, but that invalid transactions fail.

### Test matrix

| Attack                   | Expected result |
| ------------------------ | --------------- |
| Valid proof              | ACCEPT          |
| Invalid proof            | REJECT          |
| Wrong transaction        | REJECT          |
| Wrong event              | REJECT          |
| Wrong emitter            | REJECT          |
| Wrong order              | REJECT          |
| Wrong supplier           | REJECT          |
| Wrong amount             | REJECT          |
| Wrong milestone          | REJECT          |
| Duplicate settlement     | REJECT          |
| Unauthorized milestone   | REJECT          |
| Invalid state transition | REJECT          |

### Security objective

The strongest demo is not:

> "Look, the payment worked."

It is:

> "Look, the payment worked because the evidence was valid—and here is the same transaction failing when we alter the evidence."

---

# Phase 8 — Testnet Deployment

### Networks

Primary source chain:

```text
Ethereum Sepolia
```

Settlement environment:

```text
Creditcoin testnet
```

USC / Attestcoin verification must use the currently deployed protocol configuration rather than deprecated examples.

### Deployment order

```text
1. Deploy OrderRegistry
2. Deploy ProofSettleVault
3. Configure USC / verification dependencies
4. Register settlement policy
5. Create demonstration order
6. Trigger source-chain milestone
7. Generate verification evidence
8. Submit proof
9. Execute settlement
10. Capture transaction hashes
```

### Deployment artifacts

Record:

```text
network
chain ID
contract address
deployment transaction
block number
deployment timestamp
```

These values should be committed to a deployment manifest where appropriate.

---

# Phase 9 — Production Hardening

Before submission, verify:

### Application

```text
✓ Production build
✓ No TypeScript errors
✓ No console errors
✓ Responsive UI
✓ Loading states
✓ Error states
✓ Empty states
✓ Wallet/network handling
```

### Smart contracts

```text
✓ Compilation
✓ Unit tests
✓ Negative tests
✓ Replay protection
✓ Access control
✓ Event correctness
✓ No uncontrolled external calls
```

### Infrastructure

```text
✓ Environment variables documented
✓ Secrets excluded from repository
✓ Deployment configuration verified
✓ CI passing
✓ Production URL available
```

### Security

```text
✓ No private keys in source
✓ No API secrets in frontend
✓ No hard-coded production credentials
✓ AI cannot bypass policy
✓ External evidence is cryptographically verified
```

---

# Phase 10 — Hackathon Submission

The final submission should contain evidence, not promises.

## Required proof

### Live application

A publicly accessible production URL.

### Source code

Public GitHub repository.

### Smart-contract addresses

Source-chain and Creditcoin deployments.

### Transaction hashes

At minimum:

```text
Order creation
Milestone event
Evidence verification
Settlement
```

### Demo video

Target duration:

**2–3 minutes**

---

# 11. Judge Demo

The recommended demo sequence:

## 0:00–0:20 — Problem

Explain:

> "A payment should not happen simply because an application says a milestone happened. It should happen because the blockchain can prove that it happened."

## 0:20–0:50 — Create obligation

Create:

```text
Order #PS-1042
$10,000
Delivery milestone required
```

## 0:50–1:20 — Trigger external event

Submit the delivery milestone on Sepolia.

Show the transaction.

## 1:20–1:45 — Verify

Show:

```text
Attestcoin
✓ Proof valid
✓ Event valid
✓ Payload valid
```

## 1:45–2:10 — AI

Show the AI agent explaining:

```text
All settlement conditions passed.
Settlement is permitted.
```

## 2:10–2:30 — Execute

Execute the Creditcoin settlement.

Show the transaction hash.

## 2:30–3:00 — Attack

Attempt to settle again.

Result:

```text
REJECTED

Settlement proof already consumed.
```

This final moment demonstrates that the system is enforcing a real security property rather than displaying a simulated workflow.

---

# 12. Failure Handling

ProofSettle should fail closed.

If verification cannot be completed:

```text
DO NOT SETTLE
```

If evidence is malformed:

```text
DO NOT SETTLE
```

If policy fails:

```text
DO NOT SETTLE
```

If the AI is unavailable:

```text
Settlement security remains intact.
```

The system must never convert uncertainty into authorization.

---

# 13. Environment Variables

Create a local `.env.local` from `.env.example`.

Never commit secrets.

Example configuration:

```text
NEXT_PUBLIC_SOURCE_CHAIN_ID=
NEXT_PUBLIC_CREDITCOIN_CHAIN_ID=
NEXT_PUBLIC_ORDER_REGISTRY=
NEXT_PUBLIC_PROOF_SETTLE_VAULT=
NEXT_PUBLIC_USC_PRECOMPILE=
NEXT_PUBLIC_RPC_URL=
AI_API_KEY=
DEPLOYER_PRIVATE_KEY=
```

Private keys and API keys must only exist in secure deployment environments.

---

# 14. Local Development

Install dependencies:

```bash
npm install
```

Run the web application:

```bash
npm run dev
```

Build the production application:

```bash
npm run build
```

Run type checking:

```bash
npm run typecheck
```

Run tests:

```bash
npm test
```

Compile contracts:

```bash
cd contracts
forge build
```

Run contract tests:

```bash
forge test
```

---

# 15. Production Verification Checklist

Before declaring the deployment complete:

```text
[ ] npm install
[ ] npm run typecheck
[ ] npm run test
[ ] npm run build

[ ] forge build
[ ] forge test

[ ] Deploy source-chain contract
[ ] Deploy Creditcoin contract
[ ] Configure USC verification
[ ] Create real order
[ ] Produce real source-chain event
[ ] Verify real evidence
[ ] Execute real settlement
[ ] Test replay rejection
[ ] Test invalid evidence rejection

[ ] Verify production URL
[ ] Verify wallet connection
[ ] Verify transaction links
[ ] Verify contract addresses
[ ] Verify GitHub repository

[ ] Record transaction hashes
[ ] Record contract addresses
[ ] Record testnet configuration
[ ] Record demo steps

[ ] Record final demo video
[ ] Complete DoraHacks submission
```

---

# 16. Security Philosophy

ProofSettle follows five rules.

### Rule 1 — Never trust the caller

Caller-provided evidence is untrusted input.

### Rule 2 — Verify before interpreting

AI should operate on verified protocol state.

### Rule 3 — Deterministic authorization

Financial authorization belongs in deterministic code.

### Rule 4 — Fail closed

Unknown state means no settlement.

### Rule 5 — Every settlement is auditable

A judge, user, or integrator should be able to trace:

```text
Order
 ↓
Source event
 ↓
Proof
 ↓
Policy
 ↓
Settlement
```

---

# 17. Why Creditcoin

ProofSettle is designed around a problem that requires more than simply putting an application on another EVM chain.

The critical requirement is:

> **Can an application make a financial decision using verifiable information originating from another blockchain?**

Creditcoin's Universal Smart Contract architecture provides the verification infrastructure needed to bring external blockchain evidence into application logic.

ProofSettle therefore uses Creditcoin as the **verification-aware settlement execution layer**, rather than merely deploying an unrelated application to the network.

---

# 18. Competitive Differentiation

ProofSettle is intentionally not positioned as another generic:

* AI chatbot
* crypto wallet
* credit score
* lending protocol
* trading bot
* payment dashboard

Its central primitive is:

```text
VERIFIED EVENT
      ↓
PROGRAMMABLE POLICY
      ↓
AUTOMATED SETTLEMENT
```

AI is an accelerator around that primitive rather than the product's trust foundation.

---

# 19. Future Expansion

The MVP proves one settlement workflow.

The production platform can eventually support:

### Trade finance

```text
Shipment verified
      ↓
Invoice released
```

### Escrow

```text
Milestone verified
      ↓
Escrow released
```

### Insurance

```text
Claim event verified
      ↓
Policy payout executed
```

### Supply chains

```text
Delivery verified
      ↓
Supplier paid
```

### Agent commerce

```text
Agent completes verified task
      ↓
Payment policy evaluated
      ↓
Settlement executed
```

### RWA infrastructure

```text
Verified real-world event
      ↓
Financial policy
      ↓
On-chain action
```

---

# 20. Product North Star

The long-term objective is not simply to automate payments.

It is to make **verified external events programmable financial primitives**.

Today:

```text
Event → Proof → Settlement
```

Tomorrow:

```text
Event
 ↓
Identity
 ↓
Policy
 ↓
Credit
 ↓
Settlement
 ↓
Audit
```

ProofSettle is the settlement layer for that future.

---

# 21. Final Definition of Done

ProofSettle is considered production-ready for the hackathon when all of the following are true:

```text
✓ Real source-chain event
✓ Real Attestcoin / USC verification
✓ Real Creditcoin contract
✓ Deterministic policy enforcement
✓ Replay protection
✓ Negative-path security tests
✓ AI recommendation layer
✓ Production frontend
✓ Public deployment
✓ Public repository
✓ Reproducible build
✓ Real transaction evidence
✓ 2–3 minute judge demonstration
```

The final standard is simple:

> **If a judge can independently follow the evidence from the source-chain event to the Creditcoin settlement and see the protocol reject a forged or replayed settlement, ProofSettle has done its job.**
