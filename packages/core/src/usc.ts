/**
 * Thin boundary around Gluwa's current USC SDK. Keeping this as a port makes the domain testable
 * without pretending a local fixture is a cryptographic proof.
 */
export interface ProofProvider {
  generateProof(txHash: `0x${string}`, sourceChainKey: number): Promise<{queryId: `0x${string}`; encodedProof: `0x${string}`}>;
}

export class ConfiguredProofProvider implements ProofProvider {
  constructor(private readonly client: {buildProof?: Function}) {}
  async generateProof(txHash: `0x${string}`, sourceChainKey: number) {
    if (!this.client.buildProof) throw new Error('USC proof builder not configured. Configure a live proof provider for real-chain mode.');
    const result = await this.client.buildProof(txHash, sourceChainKey);
    if (!result?.queryId || !result?.encodedProof) throw new Error('USC proof provider returned an invalid proof payload.');
    return result as {queryId: `0x${string}`; encodedProof: `0x${string}`};
  }
}
