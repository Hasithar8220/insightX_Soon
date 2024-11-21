"use client";
import React, { useState, useEffect } from 'react';

// Define a type for the poll object
interface Poll {
  id: number;
  title: string;
  description: string;
  price: number;
  isForSale: boolean;
  analyticsCount: number;
}

const MarketplaceFeature = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loadingPolls, setLoadingPolls] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setPolls([
        {
          id: 1,
          title: 'Poll Title 1',
          description: 'Description for Poll 1',
          price: 1000,
          isForSale: true,
          analyticsCount: 25,
        },
        {
          id: 2,
          title: 'Poll Title 2',
          description: 'Description for Poll 2',
          price: 2000,
          isForSale: false,
          analyticsCount: 50,
        },
      ]);
      setLoadingPolls(false);
    }, 2000);
  }, []);

  const buyPoll = (pollId: number) => {
    alert(`Buying poll with ID: ${pollId}`);
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
                    polls.map((poll) => (
                      <div className="poll-item" key={poll.id}>
                        {poll.title && <h3>{poll.title}</h3>}
                        {poll.description && <p>{poll.description}</p>}
                        <p>
                          <strong>Price:</strong> {poll.price} TRX
                        </p>
                        <p>
                          <strong>For Sale:</strong> {poll.isForSale ? 'Yes' : 'No'}
                        </p>
                        <p>
                          <strong>Analytics:</strong> {poll.analyticsCount} responses
                        </p>
                        {poll.isForSale ? (
                          <button onClick={() => buyPoll(poll.id)}>Buy Now</button>
                        ) : (
                          <span className="testnet">Sold</span>
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
