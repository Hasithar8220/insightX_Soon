"use client";

import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58'; // Assuming you're using Base58 encoding for poll hashes


interface Poll {
  poll_hash: string;
  price: number;
  isForSale: boolean;
}

// Component code remains the same
const MarketplaceFeature = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loadingPolls, setLoadingPolls] = useState(true);

  useEffect(() => {
    const connection = new Connection('https://rpc.testnet.soo.network/rpc');
    const programId = new PublicKey('75RE6pzbiFtf7a4Yo5KL96PFMFCVF39AVmhzQdS2H6qm');

    const fetchPolls = async () => {
      try {
        const accountInfo = await connection.getAccountInfo(programId);

        console.log(accountInfo);

        if (accountInfo?.data) {
          const decodedPolls = decodePollsData(accountInfo.data);
          setPolls(decodedPolls);
        }
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
      setLoadingPolls(false);
    };

    fetchPolls();
  }, []);

 
  const decodePollsData = (buffer: Buffer): Poll[] => {
    const view = new DataView(buffer.buffer);
    const pollCount = view.getUint8(0); // Number of polls
  
    console.log('Poll Count',pollCount);
    // Assuming poll hash is 32 bytes long (adjust as needed)
    const pollSize = 32 + 4 + 1; // hash (32 bytes) + price (4 bytes) + isForSale (1 byte)
  
    const expectedSize = 1 + pollCount * pollSize;
  
    if (buffer.length < expectedSize) {
      console.error(`Buffer size ${buffer.length} is less than expected ${expectedSize}.`);
      return [];
    }
  
    const polls: Poll[] = [];
    let offset = 1; // Start after pollCount
  
    for (let i = 0; i < pollCount; i++) {
      if (offset + pollSize > buffer.length) {
        console.warn(`Not enough data for poll ${i + 1}. Remaining buffer too small.`);
        break;
      }
  
      try {
        // Extract poll hash as a Buffer
        const pollHashBuffer = buffer.slice(offset, offset + 32);
  
        // Convert poll hash to Base58 string
        const pollHash = bs58.encode(pollHashBuffer);
  
        offset += 32;
  
        const price = view.getUint32(offset, true); // Read price (4 bytes, little-endian)
        offset += 4;
  
        const isForSale = buffer[offset] === 1; // Read isForSale as 1 (true) or 0 (false)
        offset += 1;
  
        polls.push({
          poll_hash: pollHash,
          price,
          isForSale,
        });
      } catch (error) {
        console.error(`Error decoding poll ${i + 1}:`, error);
        break;
      }
    }
  
    return polls;
  };
  
  
  

  const buyPoll = (pollHash: string) => {
    alert(`Buying poll with hash: ${pollHash}`);
  };

  return (
    <div id="main-wrapper">
      <div className="wrapper style1">
        <div className="inner">
          <section className="container box feature1">
            <div className="row">
              <div className="col-12">
                <header className="first major">
                  <h2>Discover Key Business Insights for Growth</h2>
                </header>

                <div className="poll-list">
                  {loadingPolls ? (
                    <p>Loading...</p>
                  ) : (
                    polls.map((poll, index) => (
                      <div className="poll-item" key={index}>
                        <p>
                          <strong>ID:</strong> {poll.poll_hash}
                        </p>
                        <p>
                          <strong>Price:</strong> {poll.price} SOL
                        </p>
                        <p>
                          <strong>For Sale:</strong> {poll.isForSale ? 'Yes' : 'No'}
                        </p>
                        {poll.isForSale ? (
                          <button className='button' onClick={() => buyPoll(poll.poll_hash)}>Buy Now</button>
                        ) : (
                          <span className="step-label">Sold</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceFeature;
