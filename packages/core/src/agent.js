export function recommendSettlement(order, decision, evidence) {
    if (!decision.allowed)
        return { decision: 'HOLD', confidence: 1, rationale: ['Deterministic policy rejected the evidence.', decision.reason] };
    return { decision: 'SETTLE', confidence: 1, rationale: [`Verified source transaction ${evidence.receiptTxHash} binds to ${order.orderId}.`, `Amount ${evidence.amount} matches the order.`, 'The contract policy is satisfied; the agent recommends execution.'] };
}
