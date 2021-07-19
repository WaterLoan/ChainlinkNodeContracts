pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract APIConsumer is ChainlinkClient {
  
    uint256 public volume;
    
    uint256 private fee;
    
    /**
     * Network: Kovan
     * Chainlink - 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
     * Chainlink - 29fa9aa13bf1468788b7cc4a500a45b8
     * Fee: 0.1 LINK
     */
    constructor(address linkToken) public {
        setChainlinkToken(linkToken);
        fee = 0; // 0 LINK
    }
    
    function requestVolumeData(address oracle, string memory jobId) public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(stringToBytes32(jobId), address(this), this.fulfill.selector);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        volume = _volume;
    }
    
    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
          return 0x0;
        }
    
        assembly { // solhint-disable-line no-inline-assembly
          result := mload(add(source, 32))
        }
    }
}

