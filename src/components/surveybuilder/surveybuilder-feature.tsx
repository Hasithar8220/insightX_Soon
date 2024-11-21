'use client';

import { useState } from 'react';

export default function SurveyBuilderWizard() {
  const [step, setStep] = useState(1);
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
    pollOptions: [], // Explicitly typed as a string array
    sampleSize: '',
    audience: '',
    price: '',
    publicLink: '',
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="wizard-container">
      {/* Step 1 */}
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
          <span className="smallfonts">Minimum length is 30 characters</span>

          <label>Objective</label>
          <textarea
  name="objective"
  placeholder="Enter your objective"
  value={formData.objective}
  onChange={handleChange}
  rows={2} // Use a number here instead of a string
  required
/>

          <div className="wizard-footer">
            <button className="button" disabled={!formData.topic || !formData.objective} onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="wizard-steps active">
          <h2>Step 2: Poll Details</h2>
          <label>Poll Question</label>
          <input
            type="text"
            name="pollQuestion"
            placeholder="Enter your poll question"
            value={formData.pollQuestion}
            onChange={handleChange}
            required
          />
          <label>Poll Options</label>
          <textarea
            name="pollOptions"
            placeholder="Option 1, Option 2, etc."
            value={formData.pollOptions.join(', ')}
            onChange={(e) =>
              setFormData({ ...formData, pollOptions: e.target.value.split(',').map((opt) => opt.trim()) })
            }
            rows={3}
            required
          />
          <div className="wizard-footer">
            <button className="button" onClick={prevStep}>
              Back
            </button>
            <button className="button" disabled={!formData.pollQuestion} onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="wizard-steps active">
          <h2>Step 3: Complete</h2>
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

          <div className="wizard-info">{formData.publicLink && <p>{formData.publicLink}</p>}</div>
          <div className="wizard-footer">
            <button className="button" onClick={prevStep}>
              Back
            </button>
            <button
              className="button"
              disabled={!formData.sampleSize || !formData.audience || !formData.price}
              onClick={() => alert('Form Submitted!')}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
