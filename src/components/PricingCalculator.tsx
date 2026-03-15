import { useState, useMemo } from 'react';

interface ProviderPricing {
  name: string;
  slug: string;
  rates: Record<string, number>;
  numberCost: number;
  verifyCost: number;
}

const providers: ProviderPricing[] = [
  {
    name: 'Twilio',
    slug: 'twilio',
    rates: { US: 0.0079, UK: 0.04, CA: 0.0075, AU: 0.055, IN: 0.04, Other: 0.05 },
    numberCost: 1.15,
    verifyCost: 0.05,
  },
  {
    name: 'Plivo',
    slug: 'plivo',
    rates: { US: 0.005, UK: 0.035, CA: 0.005, AU: 0.045, IN: 0.03, Other: 0.04 },
    numberCost: 0.8,
    verifyCost: 0.05,
  },
  {
    name: 'Vonage',
    slug: 'vonage',
    rates: { US: 0.0068, UK: 0.045, CA: 0.007, AU: 0.05, IN: 0.035, Other: 0.045 },
    numberCost: 1.0,
    verifyCost: 0.055,
  },
  {
    name: 'Telnyx',
    slug: 'telnyx',
    rates: { US: 0.004, UK: 0.03, CA: 0.004, AU: 0.04, IN: 0.025, Other: 0.035 },
    numberCost: 1.0,
    verifyCost: 0.03,
  },
  {
    name: 'Bandwidth',
    slug: 'bandwidth',
    rates: { US: 0.004, UK: 0.04, CA: 0.005, AU: 0.05, IN: 0.035, Other: 0.04 },
    numberCost: 0.75,
    verifyCost: 0.04,
  },
  {
    name: 'Sinch',
    slug: 'sinch',
    rates: { US: 0.006, UK: 0.038, CA: 0.006, AU: 0.048, IN: 0.03, Other: 0.042 },
    numberCost: 1.0,
    verifyCost: 0.045,
  },
];

const countries = ['US', 'UK', 'CA', 'AU', 'IN', 'Other'] as const;

export default function PricingCalculator() {
  const [volume, setVolume] = useState(10000);
  const [country, setCountry] = useState<string>('US');
  const [needOTP, setNeedOTP] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    return providers
      .map((p) => {
        const rate = p.rates[country] ?? p.rates.Other;
        let total = rate * volume + p.numberCost;
        if (needOTP) {
          total += p.verifyCost * volume;
        }
        return { name: p.name, slug: p.slug, total };
      })
      .sort((a, b) => a.total - b.total);
  }, [volume, country, needOTP]);

  const formatCurrency = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">SMS Pricing Calculator</h2>

        {/* Volume */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly SMS Volume
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={100}
              max={1000000}
              step={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
            />
            <input
              type="number"
              min={100}
              max={1000000}
              step={100}
              value={volume}
              onChange={(e) => setVolume(Math.max(100, Math.min(1000000, Number(e.target.value))))}
              className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{volume.toLocaleString()} messages/month</p>
        </div>

        {/* Country */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
          >
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* OTP Toggle */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button"
              role="switch"
              aria-checked={needOTP}
              onClick={() => setNeedOTP(!needOTP)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                needOTP ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  needOTP ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">Need OTP / Verify?</span>
          </label>
        </div>

        {/* Calculate */}
        <button
          onClick={() => setShowResults(true)}
          className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Calculate Costs
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="mt-8 bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
          <div className="bg-[var(--color-surface-dark)] px-6 py-4 border-b border-[var(--color-border)]">
            <h3 className="text-lg font-bold text-gray-900">Estimated Monthly Costs</h3>
            <p className="text-sm text-gray-500">
              {volume.toLocaleString()} SMS/month to {country}
              {needOTP ? ' + OTP/Verify' : ''}
            </p>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {results.map((r, i) => (
              <div
                key={r.slug}
                className={`flex items-center justify-between px-6 py-4 ${
                  i === 0 ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {i === 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold">
                      1
                    </span>
                  )}
                  {i > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">
                      {i + 1}
                    </span>
                  )}
                  <span className={`font-medium ${i === 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                    {r.name}
                  </span>
                  {i === 0 && (
                    <span className="text-xs font-semibold text-[var(--color-accent)] bg-green-100 px-2 py-0.5 rounded-full">
                      Cheapest
                    </span>
                  )}
                </div>
                <span className={`text-lg font-bold ${i === 0 ? 'text-[var(--color-accent)]' : 'text-gray-900'}`}>
                  {formatCurrency(r.total)}
                </span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-[var(--color-surface)] text-xs text-gray-400">
            Estimates based on published per-message rates + one phone number. Actual costs may vary with volume discounts, dedicated numbers, and additional fees.
          </div>
        </div>
      )}
    </div>
  );
}
