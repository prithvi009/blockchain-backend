// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EscrowMarketplace {
    uint public escrowCount;

    enum EscrowStatus { AWAITING_PAYMENT, FUNDED, RELEASED, REFUNDED }

    struct Escrow {
        address buyer;
        address seller;
        uint amount;
        EscrowStatus status;
    }

    mapping(uint => Escrow) public escrows;

    event EscrowCreated(uint escrowId, address indexed buyer, address indexed seller, uint amount);
    event EscrowFunded(uint escrowId);
    event EscrowReleased(uint escrowId);
    event EscrowRefunded(uint escrowId);

    modifier onlyBuyer(uint escrowId) {
        require(msg.sender == escrows[escrowId].buyer, "Only buyer can call this");
        _;
    }

    modifier onlySeller(uint escrowId) {
        require(msg.sender == escrows[escrowId].seller, "Only seller can call this");
        _;
    }

    function createEscrow(address _seller) external payable returns (uint) {
        require(msg.value > 0, "Amount must be greater than 0");

        escrowCount++;
        escrows[escrowCount] = Escrow({
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            status: EscrowStatus.FUNDED
        });

        emit EscrowCreated(escrowCount, msg.sender, _seller, msg.value);
        emit EscrowFunded(escrowCount);

        return escrowCount;
    }

    function releaseFunds(uint escrowId) external onlyBuyer(escrowId) {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.FUNDED, "Invalid escrow state");

        escrow.status = EscrowStatus.RELEASED;
        payable(escrow.seller).transfer(escrow.amount);

        emit EscrowReleased(escrowId);
    }

    function refundBuyer(uint escrowId) external onlySeller(escrowId) {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.FUNDED, "Invalid escrow state");

        escrow.status = EscrowStatus.REFUNDED;
        payable(escrow.buyer).transfer(escrow.amount);

        emit EscrowRefunded(escrowId);
    }

    function getEscrow(uint escrowId) external view returns (
        address buyer,
        address seller,
        uint amount,
        EscrowStatus status
    ) {
        Escrow memory e = escrows[escrowId];
        return (e.buyer, e.seller, e.amount, e.status);
    }
}