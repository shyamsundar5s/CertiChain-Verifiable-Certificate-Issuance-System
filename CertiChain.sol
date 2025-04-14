// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertiChain {
    struct Certificate {
        string studentName;
        string courseName;
        string ipfsHash;
        uint256 issueDate;
        address issuedBy;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(address => bool) public authorizedUniversities;

    uint256 public certificateCounter;

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorizedUniversity() {
        require(authorizedUniversities[msg.sender], "Not an authorized university");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to whitelist universities
    function whitelistUniversity(address universityAddress) public onlyOwner {
        authorizedUniversities[universityAddress] = true;
    }

    // Function to issue certificate
    function issueCertificate(
        string memory studentName,
        string memory courseName,
        string memory ipfsHash
    ) public onlyAuthorizedUniversity {
        certificateCounter++;
        certificates[certificateCounter] = Certificate({
            studentName: studentName,
            courseName: courseName,
            ipfsHash: ipfsHash,
            issueDate: block.timestamp,
            issuedBy: msg.sender
        });
    }

    // Verify certificate by ID
    function verifyCertificate(uint256 certificateId) public view returns (Certificate memory) {
        require(certificateId > 0 && certificateId <= certificateCounter, "Certificate does not exist");
        return certificates[certificateId];
    }
}
