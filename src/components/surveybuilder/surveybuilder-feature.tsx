"use client";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toastify
import { useState, ChangeEvent } from 'react';
import CryptoJS from "crypto-js";
import { useWallet } from '@solana/wallet-adapter-react';
import { SYSVAR_RENT_PUBKEY } from '@solana/web3.js'; // Make sure this import exists at the top of your file
import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, SystemProgram } from '@solana/web3.js';



export default function SurveyBuilderWizard() {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    topic: string;
    objective: string;
    pollQuestion: string;
    pollOptions: string[];
    sampleSize: string;
    audience: string;
    price: string;
    publicLink: string;
    transactionLink: string;
    pollHash: string;
  }>({
    topic: '',
    objective: '',
    pollQuestion: '',
    pollOptions: [],
    sampleSize: '',
    audience: '',
    price: '',
    publicLink: '',
    transactionLink: '',
    pollHash: ''
  });

  const { publicKey, sendTransaction } = useWallet(); // Call useWallet at the top level


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePoll = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generatePoll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic,
          objective: formData.objective,
        }),
      });
  
      const data = await response.json();
      if (data.success && data.poll?.question && data.poll?.Options?.length > 0) {
        setFormData((prev) => ({
          ...prev,
          pollQuestion: data.poll.question,
          pollOptions: data.poll.Options,
        }));
        nextStep(); // Move to Step 2 after poll generation
      } else {
        toast.error('Error generating poll. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

 
  const savePoll = async () => {
    setLoading(true);

    try {
        if (!publicKey) {
            toast.error("Please connect your wallet");
            return;
        }

        const connection = new Connection('https://rpc.testnet.soo.network/rpc');
        const programId = new PublicKey('75RE6pzbiFtf7a4Yo5KL96PFMFCVF39AVmhzQdS2H6qm');

        // Hash the poll data
        const pollString = JSON.stringify(formData);
        const hash = CryptoJS.SHA256(pollString).toString(CryptoJS.enc.Hex);

        const instructionType = Buffer.from([0]); // "create poll" instruction
        const pollHashBytes = Buffer.from(hash, 'hex'); // 32-byte SHA-256 hash

        // Ensure price is converted to an integer in lamports
        const lamports = Math.floor(Number(formData.price) * 1e9); // Convert SOL to lamports
        const priceInLamports = BigInt(lamports); // Ensure the value is compatible with BigInt
        const price = Buffer.alloc(8);
        price.writeBigUInt64LE(priceInLamports, 0);

        const instructionData = Buffer.concat([instructionType, pollHashBytes, price]);

        const space = 77; // Poll account space
        const rentExemptLamports = await connection.getMinimumBalanceForRentExemption(space);

        const pollAccount = Keypair.generate(); // Generate poll account keypair

        // Create transaction instruction
        const instruction = new TransactionInstruction({
            programId,
            data: instructionData,
            keys: [
                { pubkey: publicKey, isSigner: true, isWritable: true },
                { pubkey: pollAccount.publicKey, isSigner: false, isWritable: true },
                { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
            ]
        });

        // Create and send transaction
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: publicKey,
                newAccountPubkey: pollAccount.publicKey,
                lamports: rentExemptLamports,
                space: space,
                programId,
            }),
            instruction
        );

        const signature = await sendTransaction(transaction, connection, { signers: [pollAccount] });
        await connection.confirmTransaction(signature, 'processed');

        console.log('Transaction Signature:', signature);

        const transactionLink = `https://explorer.testnet.soo.network/tx/${signature}`;
        const publicLink = `https://insightx.live/polls?id=${hash}`;
        formData.publicLink = publicLink;
        formData.transactionLink = transactionLink;

        // Show success toast with clickable transaction link
        toast.success(
            <div>
                Poll successfully submitted! 
                <a href={transactionLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4caf50' }}>View Transaction</a>
            </div>
        );
    } catch (error) {
        console.error("Error submitting poll:", error);
        toast.error("An error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
};

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="wizard-container">

{/* Web3 Styled Message Box */}
<div className="web3-msg-box">
  <h3>Survey Builder Instructions</h3>
  <ol>
    <li>
      <span className="step-label">Step1:</span> Type a topic and objective to retrieve a suitable poll question via OpenAI (GPT)
    </li>
    <li>
      <span className="step-label">Step2:</span> Review and confirm the poll
    </li>
    <li>
      <span className="step-label">Step3:</span> Set a price, target market, and list your poll in a marketplace. Copy the public URL to share with Audeince
    </li>
  </ol>
</div>



      {step === 1 && (
        <div className="wizard-steps active">
          <h2>Step 1: Create Poll</h2>
          <label>Topic</label>
          <input
            type="text"
            name="topic"
            placeholder="Workforce Trends & Hybrid Work"
            value={formData.topic}
            onChange={handleChange}
            required
          />
          <label>Objective</label>
          <textarea
            name="objective"
            placeholder="Enter your objective"
            value={formData.objective}
            onChange={handleChange}
            rows={2}
            required
          />
          <button
            className="button"
            disabled={!formData.topic || !formData.objective || loading}
            onClick={generatePoll}
          >
            {loading ? 'Generating...' : 'Generate Poll'}
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="wizard-steps active">
          <h2>Step 2: Poll Details - Generated from openAI - GPT3.5</h2>
          <label>Poll Question</label>
          <p>
  {formData.pollQuestion}
</p>

          <label>Poll Options</label>
          <ul>
            {formData.pollOptions.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
          <button className="button" onClick={prevStep}>
            Back
          </button>
          <button className="button" onClick={nextStep}>
            Next
          </button>
        </div>
      )}{step === 3 && (
        <div className="wizard-steps active">
          <h2>Step 3: List in a MarketPlace</h2>
          
          <label>Recommended Sample Size</label>
          <input
            type="number"
            name="sampleSize"
            placeholder="100"
            value={formData.sampleSize}
            onChange={handleChange}
            required
          />
          
          <label>Recommended Audience</label>
          <input
            type="text"
            name="audience"
            placeholder="Tech Startups"
            value={formData.audience}
            onChange={handleChange}
            required
          />
          
          <label>Price</label>
          <input
            type="number"
            name="price"
            placeholder="25"
            value={formData.price}
            onChange={handleChange}
            required
          />
          
          {formData.publicLink && (
            <div className="wizard-info">
              <p><strong>public link: </strong>{formData.publicLink}</p>
            </div>
          )}
      
      {/* {formData.publicLink && (
            <div className="wizard-info">
              <p><strong>transaction link: </strong>{formData.transactionLink}</p>
            </div>
          )} */}

          <div className="wizard-footer">
            <button className="button" onClick={prevStep}>
              Back
            </button>
            <button
              className="button"
              onClick={savePoll}
              disabled={!formData.sampleSize || !formData.audience || !formData.price}
            >
              Submit Poll
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}
