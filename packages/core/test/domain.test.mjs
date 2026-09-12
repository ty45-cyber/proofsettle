import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePolicy } from '../dist/domain.js';

const order = {orderId:'PS-1042',buyer:'0x1111111111111111111111111111111111111111',supplier:'0x2222222222222222222222222222222222222222',amount:10000n,token:'0x3333333333333333333333333333333333333333',milestone:'DELIVERED',status:'WAITING_FOR_MILESTONE'};
const evidence = {evidenceKey:'0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',queryId:'0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',sourceChainId:11155111,emitter:order.supplier,eventTopic:'0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',orderId:'PS-1042',amount:10000n,receiptTxHash:'0x'+'1'.repeat(64),blockNumber:9000000n};
const policy = {maxAmount:15000n,expectedSourceChainId:11155111,expectedEmitter:order.supplier,expectedEventTopic:evidence.eventTopic};

test('accepts a fully bound settlement',()=>assert.equal(evaluatePolicy(order,evidence,policy).allowed,true));
test('rejects amount mismatch',()=>assert.equal(evaluatePolicy(order,{...evidence,amount:9999n},policy).allowed,false));
test('rejects untrusted emitter',()=>assert.equal(evaluatePolicy(order,{...evidence,emitter:'0x4444444444444444444444444444444444444444'},policy).allowed,false));
test('rejects wrong chain',()=>assert.equal(evaluatePolicy(order,{...evidence,sourceChainId:1},policy).allowed,false));
test('rejects invalid receipt metadata',()=>assert.equal(evaluatePolicy(order,{...evidence,receiptTxHash:'0x00'},policy).allowed,false));
