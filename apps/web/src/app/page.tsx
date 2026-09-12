'use client';
import {useMemo, useState} from 'react';

type State='waiting'|'verified'|'ready'|'executed'|'rejected';
const demo={order:'PS-1042',amount:'$10,000.00',buyer:'Acme Imports',supplier:'Kisumu Supply Co.',tx:'0x8fb1…d91a',query:'0x4f2e…71aa'};
export default function Home(){
 const [state,setState]=useState<State>('waiting');
 const [tampered,setTampered]=useState(false);
 const progress=useMemo(()=>state==='waiting'?1:state==='verified'?3:state==='ready'?4:5,[state]);
 function run(){setState(tampered?'rejected':'verified'); if(!tampered){setTimeout(()=>setState('ready'),700);setTimeout(()=>setState('executed'),1500)}}
 const status=state==='executed'?'SETTLEMENT EXECUTED':state==='ready'?'POLICY READY':state==='verified'?'MILESTONE VERIFIED':state==='rejected'?'PROOF REJECTED':'WAITING FOR VERIFIED MILESTONE';
 return <main><header><div className="brand"><span className="mark">P</span><span>ProofSettle</span></div><div className="badge">CTC / ATTESTCOIN</div></header>
 <section className="hero"><div><p className="eyebrow">VERIFIED CROSS-CHAIN SETTLEMENT</p><h1>AI recommends.<br/><span>Cryptography proves.</span></h1><p className="sub">Turn real on-chain milestones into deterministic settlement decisions on Creditcoin—without making an AI model the trust boundary.</p></div><div className="card score"><div className="score-head"><span>SETTLEMENT</span><strong>{status}</strong></div><div className="order"><div><span>Order</span><b>{demo.order}</b></div><div><span>Amount</span><b>{demo.amount}</b></div><div><span>Counterparty</span><b>{demo.supplier}</b></div></div><div className="timeline"><Step n="01" title="Source event" ok={progress>=1}/><Step n="02" title="Attestcoin proof" ok={progress>=3}/><Step n="03" title="Policy checks" ok={progress>=4}/><Step n="04" title="Settlement" ok={progress>=5}/></div><button onClick={run}>{state==='executed'?'Run again':'Run live settlement demo'}</button><label className="tamper"><input type="checkbox" checked={tampered} onChange={e=>setTampered(e.target.checked)}/> Simulate tampered evidence</label></div></section>
 <section className="grid"><Panel title="SOURCE EVENT"><KV k="Network" v="Ethereum Sepolia"/><KV k="Event" v="MilestoneCompleted"/><KV k="Transaction" v={demo.tx}/><KV k="Block" v="9,087,321"/></Panel><Panel title="ATTESTCOIN EVIDENCE"><KV k="Verification" v={tampered?'FAILED':'VALID'}/><KV k="Query ID" v={demo.query}/><KV k="Binding" v="order + emitter + amount"/><KV k="Replay" v="one-time evidence key"/></Panel><Panel title="POLICY ENGINE"><KV k="Source chain" v="✓ matched"/><KV k="Emitter" v="✓ trusted"/><KV k="Amount limit" v="✓ $15,000"/><KV k="Decision" v={state==='rejected'?'✕ HOLD':'✓ SETTLE'}/></Panel></section>
 <footer><span>ProofSettle</span><span>AI is advisory. Contracts are authoritative.</span></footer></main>}
function Step({n,title,ok}:{n:string,title:string,ok:boolean}){return <div className="step"><span className={ok?'dot ok':'dot'}>{ok?'✓':n}</span><span>{title}</span></div>}
function Panel({title,children}:{title:string,children:React.ReactNode}){return <div className="panel"><p>{title}</p>{children}</div>}
function KV({k,v}:{k:string,v:string}){return <div className="kv"><span>{k}</span><b>{v}</b></div>}
