"use client";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toastify
import React, { useState, useEffect } from "react";
import { SYSVAR_RENT_PUBKEY } from '@solana/web3.js'; // Make sure this import exists at the top of your file
import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, SystemProgram } from '@solana/web3.js';
import { useWallet } from "@solana/wallet-adapter-react";
import * as bs58 from "bs58";

// Define the Poll structure
interface Poll {
  topic: string;
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

  console.log('Price lamports:', priceLamports);
  console.log('Analytics count:', analyticsCount);

  const isForSale = data[72] !== 0;

  // Convert lamports to SOL with precision
  const priceSOL = Number(priceLamports) / 1e9;

  console.log('Price in SOL:', priceSOL);

  const topic ="";

  return {
    topic,
    pollHash,
    owner,
    price: parseFloat(priceSOL.toFixed(9)), // Format to display up to 9 decimal places
    isForSale,
    analyticsCount: Number(analyticsCount),
  };


}





// Fetch polls for sale from accounts
async function getPollsForSale(
  connection: Connection,
  programId: PublicKey
): Promise<Poll[]> {
  const accounts = await connection.getProgramAccounts(programId);

  const polls: Poll[] = [];
  for (const account of accounts) {
    const poll = deserializePoll(account.account.data);
    
    if (poll && poll.isForSale) {
      poll.topic = "Your poll topic here"; // Modify to reflect how you're storing/retrieving this data
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
  const [searchQuery, setSearchQuery] = useState<string>('');
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
        const fetchedPolls = await getPollsForSale(connection, programId);
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






const buyPoll = async (
  pollHash: Uint8Array,
  publicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
) => {
  try {
    const connection = new Connection("https://rpc.testnet.soo.network/rpc");

    const poll = polls.find((p) => bs58.encode(p.pollHash) === bs58.encode(pollHash));
    if (!poll) {
      toast.error("Poll not found.");
      return;
    }

    if (!poll.isForSale) {
      toast.warn("This poll is not for sale.");
      return;
    }

    // Create a transaction to transfer funds
    const transaction = new Transaction();
    transaction.feePayer = publicKey;

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: poll.owner,
        lamports: BigInt(poll.price * 1e9), // Convert price to lamports
      })
    );

    // Fetch the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // Sign and send the transaction
    const signedTransaction = await signTransaction(transaction);
    const txId = await connection.sendRawTransaction(signedTransaction.serialize());
    await connection.confirmTransaction(txId);

    // Show success toast with clickable transaction link
    const transactionLink = `https://explorer.testnet.soo.network/tx/${txId}`;
    toast.success(
      <div>
        Transaction successful!{" "}
        <a href={transactionLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4caf50' }}>
          View Transaction
        </a>
      </div>
    );
  } catch (error) {
    console.error("Error buying poll:", error);
    toast.error("Failed to complete the transaction. Please try again.");
  }
};

  

  
  
  const {  signTransaction } = useWallet();
  return (
    <div id="main-wrapper">
      <div className="wrapper style1">
        <div className="inner">
          <section className="container box feature1">
            <div className="row">
              <div className="col-12">
                <header className="first major mp_header">
                  <h2 className="text-5xl font-bold mt-20">Discover Key Business Insights for Growth</h2>
                </header>

                {/* <div className="search-bar">
  <input
    type="text"
    placeholder="Search for a poll by topic"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div> */}

                <div className="poll-list">
                  {loadingPolls ? (
                    <div className="spinner">Loading...</div>
                  ) : (
                    polls.map((poll, index) => (
                      <div className="poll-item" key={index}>
                      <div className="poll-header mb-10">
                        <p>
                          <strong>Topic:</strong> {poll.topic}
                        </p>
                        <p><strong>Price:</strong> {poll.price} SOL</p>
                      </div>
                      <div className="poll-footer mb-10">
                        <p className="smallitalics">
                          <strong>ID:</strong> {bs58.encode(poll.pollHash)}
                        </p>
                        <p className="smallitalics">
                          <strong>Owner:</strong> {poll.owner.toBase58()}
                        </p>
                      </div>
                      {poll.isForSale ? (
                        <button
                          className="button"
                          onClick={() => {
                            if (publicKey && signTransaction) {
                              buyPoll(poll.pollHash, publicKey, signTransaction);
                            } else {
                              alert("Please connect your wallet.");
                            }
                          }}
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
