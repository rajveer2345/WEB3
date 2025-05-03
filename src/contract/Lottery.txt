// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Lottery {
    IERC20 public usdtToken;
    address public lotteryOperator;
    uint256 public constant ticketPrice = 10 * 10**18; // 10 USDT (assuming 18 decimals)
    uint256 public constant maxTickets = 100;
    uint256 public constant ticketCommission = 1 * 10**18; // 1 USDT per ticket commission
    uint256 public constant duration = 30 minutes;

    uint256 public expiration;
    uint256 public operatorTotalCommission = 0;
    address public lastWinner;
    uint256 public lastWinnerAmount;
    
    mapping(address => uint256) public winnings;
    address[] public tickets;

    modifier isOperator() {
        require(msg.sender == lotteryOperator, "Caller is not the lottery operator");
        _;
    }

    modifier isWinner() {
        require(IsWinner(), "Caller is not a winner");
        _;
    }

    constructor(address _usdtToken) {
        usdtToken = IERC20(_usdtToken);
        lotteryOperator = msg.sender;
        expiration = block.timestamp + duration;
    }

    function getTickets() public view returns (address[] memory) {
        return tickets;
    }

    function getWinningsForAddress(address addr) public view returns (uint256) {
        return winnings[addr];
    }

    function BuyTickets(uint256 numOfTicketsToBuy) public {
        require(numOfTicketsToBuy > 0, "Must buy at least 1 ticket");
        require(numOfTicketsToBuy <= RemainingTickets(), "Not enough tickets available");
        uint256 totalCost = numOfTicketsToBuy * ticketPrice;

        require(usdtToken.transferFrom(msg.sender, address(this), totalCost), "USDT transfer failed");

        for (uint256 i = 0; i < numOfTicketsToBuy; i++) {
            tickets.push(msg.sender);
        }
    }

    function DrawWinnerTicket() public isOperator {
        require(tickets.length > 0, "No tickets were purchased");

        bytes32 blockHash = blockhash(block.number - tickets.length);
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, blockHash)));
        uint256 winningTicket = randomNumber % tickets.length;

        address winner = tickets[winningTicket];
        lastWinner = winner;
        lastWinnerAmount = tickets.length * (ticketPrice - ticketCommission);
        winnings[winner] += lastWinnerAmount;
        operatorTotalCommission += tickets.length * ticketCommission;
        delete tickets;
        expiration = block.timestamp + duration;
    }

    function restartDraw() public isOperator {
        require(tickets.length == 0, "Can not restart while tickets exist");
        delete tickets;
        expiration = block.timestamp + duration;
    }

    function checkWinningsAmount() public view returns (uint256) {
        return winnings[msg.sender];
    }

    function WithdrawWinnings() public isWinner {
        uint256 reward2Transfer = winnings[msg.sender];
        winnings[msg.sender] = 0;
        require(usdtToken.transfer(msg.sender, reward2Transfer), "USDT transfer failed");
    }

    function RefundAll() public {
        require(block.timestamp >= expiration, "Lottery has not expired yet");

        for (uint256 i = 0; i < tickets.length; i++) {
            require(usdtToken.transfer(tickets[i], ticketPrice), "USDT refund failed");
        }
        delete tickets;
    }

    function WithdrawCommission() public isOperator {
        uint256 commission2Transfer = operatorTotalCommission;
        operatorTotalCommission = 0;
        require(usdtToken.transfer(msg.sender, commission2Transfer), "USDT transfer failed");
    }

    function IsWinner() public view returns (bool) {
        return winnings[msg.sender] > 0;
    }

    function CurrentWinningReward() public view returns (uint256) {
        return tickets.length * ticketPrice;
    }

    function RemainingTickets() public view returns (uint256) {
        return maxTickets - tickets.length;
    }
}
