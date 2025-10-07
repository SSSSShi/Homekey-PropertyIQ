'use client';

import { useState } from 'react';
import { PropertyBrief } from '@/components/PropertyBrief';
import type { AggregatedPropertyData } from '@/lib/services/propertyAggregator';

export default function Home() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [propertyData, setPropertyData] = useState<AggregatedPropertyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setPropertyData(null);

    try {
      const response = await fetch(`/api/property?address=${encodeURIComponent(address)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch property data');
      }

      const data = await response.json();
      setPropertyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            HomeKey
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive property insights in seconds
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter property address (e.g., 123 Main St, San Francisco, CA 94102)"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !address.trim()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Aggregating property data...</p>
          </div>
        )}

        {propertyData && !loading && (
          <PropertyBrief data={propertyData} />
        )}

        {!propertyData && !loading && !error && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <p className="text-lg">Enter an address to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
