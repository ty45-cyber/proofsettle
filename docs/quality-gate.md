# Verification status

## Source-level checks

- Current USC interface pinned to the July 2026 official example revision.
- Domain policy suite covers positive path plus source-chain, emitter, topic, order, amount and receipt failures.
- Production contract rejects caller-supplied settlement facts by deriving them from decoder output over the authenticated transaction bytes.
- CI is configured for typecheck, tests and Next production build.

## Environment limitation in the build workspace

The workspace does not have Foundry installed, and the package registry did not complete `npm install` within the execution window. Therefore this artifact was **not** honestly certified here by a full dependency install, `forge test`, or `next build`. The repository is structured for those checks and the CI workflow will execute them in a normal networked development environment.
