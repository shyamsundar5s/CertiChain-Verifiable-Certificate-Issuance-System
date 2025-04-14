import React, { useState } from 'react';
import Web3 from 'web3';
import CertiChainABI from './CertiChainABI.json'; // Import ABI

const CertiChainAddress = 'YOUR_SMART_CONTRACT_ADDRESS'; // Replace with deployed contract address

export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState('');
  const [certificateData, setCertificateData] = useState(null);

  const handleVerify = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      const contract = new web3.eth.Contract(CertiChainABI, CertiChainAddress);

      const result = await contract.methods.verifyCertificate(certificateId).call();
      setCertificateData(result);
    } catch (error) {
      console.error('Error verifying certificate:', error);
    }
  };

  return (
    <div>
      <label>Certificate ID:</label>
      <input
        type="text"
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
        required
      />
      <button onClick={handleVerify}>Verify Certificate</button>

      {certificateData && (
        <div>
          <h3>Certificate Details:</h3>
          <p>Student Name: {certificateData.studentName}</p>
          <p>Course Name: {certificateData.courseName}</p>
          <p>Issued By: {certificateData.issuedBy}</p>
          <p>Issue Date: {new Date(certificateData.issueDate * 1000).toLocaleDateString()}</p>
          <p>
            Certificate File: 
            <a href={`https://ipfs.io/ipfs/${certificateData.ipfsHash}`} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
