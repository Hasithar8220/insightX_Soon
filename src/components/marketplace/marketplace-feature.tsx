"use client";

import React, { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import * as bs58 from "bs58";

// Define the Poll structure
interface Poll {
  pollHash: Uint8Array;
  owner: PublicKey;
  price: number;
  isForSale: boolean;
  analyticsCount: number;
}

function deserializePoll(data: Uint8Array): Poll | null {
  if (data.length !== 77) return null;

  const pollHash = data.slice(0, 32);
  const owner = new PublicKey(data.slice(32, 64));

  // Extract 64-bit unsigned integer (price) in little-endian format
  const priceLamportsBuffer = Buffer.from(data.slice(64, 72));
  const priceLamports = BigInt('0x' + priceLamportsBuffer.reverse().toString('hex')); // Reverse the buffer for little-endian

  // Extract analytics count
  const analyticsCountBuffer = Buffer.from(data.slice(73, 77));
  const analyticsCount = BigInt('0x' + analyticsCountBuffer.reverse().toString('hex')); // Reverse the buffer for little-endian

  console.log('Price lamports:', priceLamports); // Log price in lamports
  console.log('Analytics count:', analyticsCount);

  const isForSale = data[72] !== 0;

  // Convert lamports to SOL (using BigInt)
  const priceSOLBigInt = priceLamports / BigInt(1e9);
  const priceSOL = parseFloat(priceSOLBigInt.toString());

  console.log('Price in SOL:', priceSOL);

  return {
    pollHash,
    owner,
    price: parseFloat(priceSOL.toFixed(2)), // Round to 2 decimals for display
    isForSale,
    analyticsCount: Number(analyticsCount),
  };
}




// Fetch polls for sale from accounts
async function getPollsForSale(
  connection: Connection,
  programId: PublicKey,
  userPublicKey: PublicKey
): Promise<Poll[]> {
  const accounts = await connection.getProgramAccounts(programId, {
    filters: [
      { memcmp: { offset: 32, bytes: userPublicKey.toBase58() } }, // Owner filter
    ],
  });

  const polls: Poll[] = [];
  for (const account of accounts) {
    const poll = deserializePoll(account.account.data);
    console.log(poll);
    if (poll && poll.isForSale) {
      polls.push(poll);
    }
  }

  console.log(polls);
  return polls;
}

const MarketplaceFeature = () => {
  const { publicKey } = useWallet(); // Solana wallet adapter
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    if (!publicKey) {
      console.log("No wallet connected. Cannot load polls.");
      setLoadingPolls(false);
      return;
    }

    const connection = new Connection("https://rpc.testnet.soo.network/rpc");
    const programId = new PublicKey("75RE6pzbiFtf7a4Yo5KL96PFMFCVF39AVmhzQdS2H6qm");

    const fetchPolls = async () => {
      try {
        const fetchedPolls = await getPollsForSale(connection, programId, publicKey);
        setPolls(fetchedPolls);
      } catch (error) {
        console.error("Error fetching polls:", error);
        setError("Failed to load polls. Please try again later.");
      } finally {
        setLoadingPolls(false);
      }
    };

    fetchPolls();
  }, [publicKey]);

  const buyPoll = (pollHash: Uint8Array) => {
    alert(`Buying poll with hash: ${bs58.encode(pollHash)}`);
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
                    <div className="spinner">Loading...</div>
                  ) : (
                    polls.map((poll, index) => (
                      <div className="poll-item" key={index}>
                        <p className="smallitalics">
                          <strong>ID:</strong> {bs58.encode(poll.pollHash)}
                        </p>
                                        
                        <p className="smallitalics">
                          <strong>Owner:</strong> {poll.owner.toBase58()}
                        </p>
                        <p><strong>Price:</strong> {poll.price} SOL</p>  
                        <p>
                          <strong>For Sale:</strong> {poll.isForSale ? "Yes" : "No"}
                        </p>
                        <p><strong>Analytics Count:</strong> {poll.analyticsCount.toString()}</p>

                        {poll.isForSale ? (
                          <button
                            className="button"
                            onClick={() => buyPoll(poll.pollHash)}
                          >
                            Buy Now
                          </button>
                        ) : (
                          <span className="step-label">Sold</span>
                        )}
                      </div>
                    ))
                  )}
                  {error && <p style={{ color: 'red' }}>{error}</p>}
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
