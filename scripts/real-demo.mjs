import 'dotenv/config';
import {createPublicClient, createWalletClient, http} from 'viem';
import {sepolia} from 'viem/chains';
import {privateKeyToAccount} from 'viem/accounts';

const required=['SOURCE_CHAIN_RPC_URL','SOURCE_PRIVATE_KEY','SOURCE_ORDER_REGISTRY_ADDRESS','USC_PROVER_URL','CREDITCOIN_RPC_URL','CREDITCOIN_VAULT_ADDRESS'];
const missing=required.filter(k=>!process.env[k]);
if(missing.length){console.error('Missing env:',missing.join(', ')); process.exit(1)}
const account=privateKeyToAccount(process.env.SOURCE_PRIVATE_KEY.startsWith('0x')?process.env.SOURCE_PRIVATE_KEY:`0x${process.env.SOURCE_PRIVATE_KEY}`);
const client=createPublicClient({chain:sepolia,transport:http(process.env.SOURCE_CHAIN_RPC_URL)});
const wallet=createWalletClient({account,chain:sepolia,transport:http(process.env.SOURCE_CHAIN_RPC_URL)});
console.log('ProofSettle real-demo configured');
console.log({sourceAccount:account.address,sourceChain:await client.getChainId(),orderRegistry:process.env.SOURCE_ORDER_REGISTRY_ADDRESS,creditcoinVault:process.env.CREDITCOIN_VAULT_ADDRESS,uscProver:process.env.USC_PROVER_URL});
console.log('Next step: call the deployed OrderRegistry.completeMilestone(), then build a USC proof for the receipt using @gluwa/usc-sdk 0.18.x and submit it to ProofSettleVault.');
void wallet;
