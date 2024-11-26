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
    <div className="bg-[#030712] min-h-screen text-white">
      <AppHero
        title="Create & Monetize Value-driven Insights!"
        subtitle="An innovative way to support Data Driven Economy with SOON network on Solana"
      />
      <div className="flex justify-center items-center py-8">
        <div className="flex gap-8 items-center">
          {/* OpenAI Logo */}
          <div className="logo-container">
            <img
              className="h-12 md:h-16 filter invert contrast-125"
              alt="OpenAI Logo"
              src="/openai.webp"
            />
          </div>
          {/* TiDB Logo */}
          <div className="logo-container">
            <img
              className="h-12 md:h-16 filter invert contrast-125"
              alt="TiDB Logo"
              src="/tidb_bg_tp.png"
            />
          </div>
          {/* SOON Network Logo */}
          <div className="logo-container">
            <img
              className="h-12 md:h-16 filter contrast-125"
              alt="SOON Network Logo"
              src="/soon.svg"
            />
          </div>
        </div>
      </div>
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <div className="content-container">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                style={{
                  height: "300px",
                  border: "1px solid #eee",
                  padding: "5px",
                }}
                src="/analytics2.gif"
                alt="Hero Image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
