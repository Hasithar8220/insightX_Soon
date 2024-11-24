'use client'

import { AppHero } from '../ui/ui-layout'

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
]

export default function DashboardFeature() {
  return (
    <div>
      <AppHero
        title="Create & Monetize Value-driven insights!"
        subtitle="An innovative way to support Data Driven Economy with SOON network on Solana"
      />
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <div className="content-container">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                style={{ height: "300px", border: "1px solid #eee", padding: "5px" }}
                src="/analytics2.gif"
                alt="Hero Image"
              />
            </div>
          </div>
          {/* Uncomment if you want to use the links */}
          {/* {links.map((link, index) => (
            <div key={index}>
              <a href={link.href} className="link" target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}

