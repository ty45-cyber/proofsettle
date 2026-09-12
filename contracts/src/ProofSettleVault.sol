// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {USCBase} from './vendored/USCBase.sol';

interface IERC20 { function transfer(address to, uint256 value) external returns (bool); }

/// @notice Integration boundary for a linked EvmV1Decoder implementation.
/// @dev The decoder MUST parse the same encoded transaction bytes that the BlockProver authenticated.
interface IEvmV1SettlementDecoder {
    struct SettlementEvent {
        address emitter;
        bytes32 topic0;
        bytes32 orderId;
        address recipient;
        uint256 amount;
        uint256 receiptStatus;
        bool found;
    }
    function findSettlementEvent(bytes calldata encodedTransaction, bytes32 expectedEventTopic) external view returns (SettlementEvent memory);
}

contract ProofSettleVault is USCBase {
    struct Policy { address token; uint256 maxAmount; uint64 sourceChainKey; address expectedEmitter; bytes32 expectedEventTopic; }
    mapping(bytes32 => Policy) public policies;
    mapping(bytes32 => bool) public settledOrders;
    mapping(bytes32 => bool) public consumedEvidence;
    address public immutable decoder;
    address public owner;

    event PolicyRegistered(bytes32 indexed policyId, uint64 indexed sourceChainKey, address indexed emitter, bytes32 eventTopic, uint256 maxAmount, address token);
    event SettlementExecuted(bytes32 indexed orderId, bytes32 indexed queryId, address indexed recipient, uint256 amount);
    event SettlementRejected(bytes32 indexed orderId, bytes32 indexed queryId, bytes32 reason);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error NotOwner(); error InvalidPolicy(); error OrderAlreadySettled(); error EvidenceAlreadyConsumed(); error TransferFailed(); error SourceMismatch(); error EventNotFound(); error ReceiptFailed(); error AmountMismatch(); error AmountLimit(); error RecipientMismatch();
    modifier onlyOwner(){if(msg.sender!=owner)revert NotOwner();_;}

    constructor(address decoder_) {
        if(decoder_ == address(0)) revert InvalidPolicy();
        decoder = decoder_; owner = msg.sender; emit OwnershipTransferred(address(0), msg.sender);
    }

    function registerPolicy(bytes32 policyId, Policy calldata policy) external onlyOwner {
        if(policyId==bytes32(0)||policy.token==address(0)||policy.expectedEmitter==address(0)||policy.expectedEventTopic==bytes32(0)||policy.maxAmount==0||policy.sourceChainKey==0) revert InvalidPolicy();
        policies[policyId]=policy;
        emit PolicyRegistered(policyId,policy.sourceChainKey,policy.expectedEmitter,policy.expectedEventTopic,policy.maxAmount,policy.token);
    }

    /// @dev action is a routing hint only. The exact settlement event is discovered from the proven bytes.
    function _processAndEmitEvent(uint8 action, bytes32 queryId, bytes memory encodedTransaction) internal override {
        bytes32 policyId = bytes32(uint256(action));
        Policy memory policy = policies[policyId];
        if(policy.token==address(0)) revert InvalidPolicy();
        IEvmV1SettlementDecoder.SettlementEvent memory e = IEvmV1SettlementDecoder(decoder).findSettlementEvent(encodedTransaction, policy.expectedEventTopic);
        if(!e.found) revert EventNotFound();
        if(e.emitter!=policy.expectedEmitter) revert SourceMismatch();
        if(e.receiptStatus!=1) revert ReceiptFailed();
        if(e.amount==0 || e.amount>policy.maxAmount) revert AmountLimit();
        if(e.orderId==bytes32(0)||settledOrders[e.orderId]) revert OrderAlreadySettled();
        if(consumedEvidence[queryId]) revert EvidenceAlreadyConsumed();
        // The recipient is taken from the proven event, never from an untrusted execute() argument.
        consumedEvidence[queryId]=true; settledOrders[e.orderId]=true;
        if(!IERC20(policy.token).transfer(e.recipient,e.amount)) revert TransferFailed();
        emit SettlementExecuted(e.orderId,queryId,e.recipient,e.amount);
        action;
    }

    function transferOwnership(address newOwner) external onlyOwner { if(newOwner==address(0)) revert InvalidPolicy(); emit OwnershipTransferred(owner,newOwner); owner=newOwner; }
}
