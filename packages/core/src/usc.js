export class ConfiguredProofProvider {
    client;
    constructor(client) {
        this.client = client;
    }
    async generateProof(txHash, sourceChainKey) {
        if (!this.client.buildProof)
            throw new Error('USC proof builder not configured. Configure a live proof provider for real-chain mode.');
        const result = await this.client.buildProof(txHash, sourceChainKey);
        if (!result?.queryId || !result?.encodedProof)
            throw new Error('USC proof provider returned an invalid proof payload.');
        return result;
    }
}
