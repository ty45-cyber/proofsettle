export function evaluatePolicy(order, evidence, policy) {
    const checks = [
        { name: 'source_chain', passed: evidence.sourceChainId === policy.expectedSourceChainId, detail: `expected ${policy.expectedSourceChainId}, got ${evidence.sourceChainId}` },
        { name: 'trusted_emitter', passed: evidence.emitter.toLowerCase() === policy.expectedEmitter.toLowerCase(), detail: `expected ${policy.expectedEmitter}` },
        { name: 'event_topic', passed: evidence.eventTopic.toLowerCase() === policy.expectedEventTopic.toLowerCase(), detail: 'milestone event must match registered topic' },
        { name: 'order_binding', passed: evidence.orderId === order.orderId, detail: `evidence ${evidence.orderId}, order ${order.orderId}` },
        { name: 'amount_binding', passed: evidence.amount === order.amount, detail: `evidence ${evidence.amount}, order ${order.amount}` },
        { name: 'max_amount', passed: evidence.amount <= policy.maxAmount, detail: `limit ${policy.maxAmount}` },
        { name: 'receipt_present', passed: evidence.receiptTxHash.length === 66 && evidence.blockNumber > 0n, detail: 'source receipt metadata required' },
    ];
    const allowed = checks.every((check) => check.passed);
    return { allowed, checks, reason: allowed ? 'All deterministic settlement conditions passed.' : `Settlement rejected: ${checks.filter((c) => !c.passed).map((c) => c.name).join(', ')}.` };
}
