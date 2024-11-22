"use client";
import { useState, ChangeEvent } from 'react';

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
  }>({
    topic: '',
    objective: '',
    pollQuestion: '',
    pollOptions: [],
    sampleSize: '',
    audience: '',
    price: '',
    publicLink: '',
  });

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
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          pollQuestion: data.poll.question,
          pollOptions: data.poll.Options,
        }));
        nextStep(); // Move to Step 2 after poll generation
      } else {
        alert('Error generating poll. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="wizard-container">
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
          <h2>Step 2: Poll Details</h2>
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
      )}
    </div>
  );
}
