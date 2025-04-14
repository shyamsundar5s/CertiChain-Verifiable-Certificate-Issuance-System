import { create } from 'ipfs-http-client';

// Initialize IPFS client
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export const uploadToIPFS = async (file) => {
  try {
    const added = await ipfs.add(file);
    return added.path; // This is the IPFS hash
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};
