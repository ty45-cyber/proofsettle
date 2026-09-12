// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract OrderRegistry {
    struct Order {
        address buyer;
        address supplier;
        uint256 amount;
        bytes32 milestone;
        bool created;
        bool settled;
    }

    mapping(bytes32 => Order) public orders;

    event OrderCreated(bytes32 indexed orderId, address indexed buyer, address indexed supplier, uint256 amount, bytes32 milestone);
    event MilestoneCompleted(bytes32 indexed orderId, address indexed supplier, uint256 amount, bytes32 milestone);
    event OrderSettled(bytes32 indexed orderId);

    error InvalidOrder();
    error NotSupplier();
    error AlreadySettled();

    function createOrder(bytes32 orderId, address supplier, uint256 amount, bytes32 milestone) external {
        if (orderId == bytes32(0) || supplier == address(0) || amount == 0 || milestone == bytes32(0) || orders[orderId].created) revert InvalidOrder();
        orders[orderId] = Order(msg.sender, supplier, amount, milestone, true, false);
        emit OrderCreated(orderId, msg.sender, supplier, amount, milestone);
    }

    function completeMilestone(bytes32 orderId) external {
        Order storage order = orders[orderId];
        if (!order.created || order.settled) revert InvalidOrder();
        if (msg.sender != order.supplier) revert NotSupplier();
        emit MilestoneCompleted(orderId, msg.sender, order.amount, order.milestone);
    }

    function markSettled(bytes32 orderId) external {
        Order storage order = orders[orderId];
        if (!order.created || order.settled) revert AlreadySettled();
        order.settled = true;
        emit OrderSettled(orderId);
    }
}
