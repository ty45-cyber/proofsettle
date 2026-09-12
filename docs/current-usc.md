# Current USC integration notes

Creditcoin CC3 testnet uses the native BlockProver precompile at `0x0000000000000000000000000000000000000FD2` for transaction inclusion/continuity verification. Current interfaces expose `verify`, `verifyAndEmit`, and `calculateTxIndex`. A query identifier is derived from `chainKey`, source block height, and Merkle-path transaction index.

ProofSettle follows the current pattern: verify first, mark the query id, then pass the exact proven encoded transaction to a decoder. It does **not** trust a caller to supply the emitter, amount, or recipient independently.

Source-chain `chainKey` is deliberately distinct from EVM `chainId`. For Sepolia on current CC3 testnet, examples document chain key `1`; CC3 testnet EVM chain ID is `102031`.
