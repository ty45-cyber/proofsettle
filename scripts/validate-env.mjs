const keys=['SOURCE_CHAIN_RPC_URL','CREDITCOIN_RPC_URL','USC_PROVER_URL'];
for(const k of keys) console.log(`${k}: ${process.env[k]?'configured':'not configured'}`);
