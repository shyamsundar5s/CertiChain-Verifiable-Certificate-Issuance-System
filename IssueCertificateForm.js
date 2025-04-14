import React, { useState } from 'react';
import Web3 from 'web3';
import CertiChainABI from './CertiChainABI.json'; // Import ABI
import { uploadToIPFS } from './ipfsUpload';

const CertiChainAddress = 'YOUR_SMART_CONTRACT_ADDRESS'; // Replace with deployed contract address

export default function IssueCertificateForm() {
  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [certificateFile, setCertificateFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!certificateFile) {
      alert('Please upload a certificate file.');
      return;
    }

    try {
      // Upload file to IPFS
      const ipfsHash = await uploadToIPFS(certificateFile);

      // Interact with the smart contract
      const web3 = new Web3(Web3.givenProvider);
      const contract = new web3.eth.Contract(CertiChainABI, CertiChainAddress);
      const accounts = await web3.eth.requestAccounts();

      await contract.methods
        .issueCertificate(studentName, courseName, ipfsHash)
        .send({ from: accounts[0] });

      alert('Certificate issued successfully!');
    } catch (error) {
      console.error('Error issuing certificate:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Student Name:</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Course Name:</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Upload Certificate (PDF):</label>
        <input type="file" onChange={(e) => setCertificateFile(e.target.files[0])} required />
      </div>
      <button type="submit">Issue Certificate</button>
    </form>
  );
}
