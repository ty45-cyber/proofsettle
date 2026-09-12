export type SettlementStatus = 'WAITING_FOR_MILESTONE' | 'PROOF_READY' | 'POLICY_READY' | 'EXECUTED' | 'REJECTED';

export interface SettlementOrder {
  readonly orderId: string;
  readonly buyer: `0x${string}`;
  readonly supplier: `0x${string}`;
  readonly amount: bigint;
  readonly token: `0x${string}`;
  readonly milestone: string;
  readonly status: SettlementStatus;
}

export interface EvidenceEnvelope {
  readonly evidenceKey: `0x${string}`;
  readonly queryId: `0x${string}`;
  readonly sourceChainId: number;
  readonly emitter: `0x${string}`;
  readonly eventTopic: `0x${string}`;
  readonly orderId: string;
  readonly amount: bigint;
  readonly receiptTxHash: `0x${string}`;
  readonly blockNumber: bigint;
}

export interface SettlementPolicy {
  readonly maxAmount: bigint;
  readonly expectedSourceChainId: number;
  readonly expectedEmitter: `0x${string}`;
  readonly expectedEventTopic: `0x${string}`;
}

export interface PolicyDecision {
  readonly allowed: boolean;
  readonly checks: readonly {name: string; passed: boolean; detail: string}[];
  readonly reason: string;
}

export function evaluatePolicy(order: SettlementOrder, evidence: EvidenceEnvelope, policy: SettlementPolicy): PolicyDecision {
  const checks = [
    { name: 'source_chain', passed: evidence.sourceChainId === policy.expectedSourceChainId, detail: `expected ${policy.expectedSourceChainId}, got ${evidence.sourceChainId}` },
    { name: 'trusted_emitter', passed: evidence.emitter.toLowerCase() === policy.expectedEmitter.toLowerCase(), detail: `expected ${policy.expectedEmitter}` },
    { name: 'event_topic', passed: evidence.eventTopic.toLowerCase() === policy.expectedEventTopic.toLowerCase(), detail: 'milestone event must match registered topic' },
    { name: 'order_binding', passed: evidence.orderId === order.orderId, detail: `evidence ${evidence.orderId}, order ${order.orderId}` },
    { name: 'amount_binding', passed: evidence.amount === order.amount, detail: `evidence ${evidence.amount}, order ${order.amount}` },
    { name: 'max_amount', passed: evidence.amount <= policy.maxAmount, detail: `limit ${policy.maxAmount}` },
    { name: 'receipt_present', passed: evidence.receiptTxHash.length === 66 && evidence.blockNumber > 0n, detail: 'source receipt metadata required' },
  ] as const;
  const allowed = checks.every((check) => check.passed);
  return {allowed, checks, reason: allowed ? 'All deterministic settlement conditions passed.' : `Settlement rejected: ${checks.filter((c) => !c.passed).map((c) => c.name).join(', ')}.`};
}
