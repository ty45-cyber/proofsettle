import type {EvidenceEnvelope, PolicyDecision, SettlementOrder} from './domain.js';

export interface AgentRecommendation {decision: 'SETTLE' | 'HOLD'; confidence: number; rationale: string[];}

export function recommendSettlement(order: SettlementOrder, decision: PolicyDecision, evidence: EvidenceEnvelope): AgentRecommendation {
  if (!decision.allowed) return {decision: 'HOLD', confidence: 1, rationale: ['Deterministic policy rejected the evidence.', decision.reason]};
  return {decision: 'SETTLE', confidence: 1, rationale: [`Verified source transaction ${evidence.receiptTxHash} binds to ${order.orderId}.`, `Amount ${evidence.amount} matches the order.`, 'The contract policy is satisfied; the agent recommends execution.']};
}
