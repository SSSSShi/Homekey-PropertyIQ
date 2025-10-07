import type { AggregatedPropertyData } from '@/lib/services/propertyAggregator';

interface PropertyBriefProps {
  data: AggregatedPropertyData;
}

export function PropertyBrief({ data }: PropertyBriefProps) {
  const { property, basicInfo, schools, crime, amenities, dataQuality, lastUpdated } = data;

  // Helper to format currency
  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper to format confidence score
  const formatConfidence = (value?: number) => {
    if (!value) return null;
    const percentage = Math.round(value * 100);
    const color = percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600';
    return <span className={color}>({percentage}% confidence)</span>;
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {property.address}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {property.city}, {property.state} {property.zipCode}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Overall Data Quality
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(dataQuality.overallConfidence * 100)}%
            </div>
          </div>
        </div>

        {dataQuality.missingDataSources.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Missing data from:</strong> {dataQuality.missingDataSources.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Basic Property Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Property Details
          </h3>
          {dataQuality.basicInfoConfidence && formatConfidence(dataQuality.basicInfoConfidence)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoCard label="Type" value={basicInfo.propertyType || 'N/A'} />
          <InfoCard label="Bedrooms" value={basicInfo.bedrooms?.toString() || 'N/A'} />
          <InfoCard label="Bathrooms" value={basicInfo.bathrooms?.toString() || 'N/A'} />
          <InfoCard label="Square Feet" value={basicInfo.squareFeet?.toLocaleString() || 'N/A'} />
          <InfoCard label="Year Built" value={basicInfo.yearBuilt?.toString() || 'N/A'} />
          <InfoCard label="Estimated Value" value={formatCurrency(basicInfo.estimatedValue)} highlight />
        </div>
      </div>

      {/* Schools */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nearby Schools
          </h3>
          {dataQuality.schoolsConfidence && formatConfidence(dataQuality.schoolsConfidence)}
        </div>
        <div className="space-y-4">
          <SchoolCard
            name={schools.elementarySchool}
            rating={schools.elementaryRating}
            level="Elementary"
          />
          <SchoolCard
            name={schools.middleSchool}
            rating={schools.middleRating}
            level="Middle"
          />
          <SchoolCard
            name={schools.highSchool}
            rating={schools.highRating}
            level="High"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Crime */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Safety
            </h3>
            {dataQuality.crimeConfidence && formatConfidence(dataQuality.crimeConfidence)}
          </div>
          {crime.crimeLevel ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Crime Level</span>
                <span className={`font-semibold ${
                  crime.crimeLevel === 'Very Low' || crime.crimeLevel === 'Low'
                    ? 'text-green-600'
                    : crime.crimeLevel === 'Moderate'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {crime.crimeLevel}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Crime Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {crime.crimeRate?.toFixed(1)} per 100k
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No crime data available</p>
          )}
        </div>

        {/* Amenities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Walkability & Transit
            </h3>
            {dataQuality.amenitiesConfidence && formatConfidence(dataQuality.amenitiesConfidence)}
          </div>
          {amenities.walkScore !== undefined ? (
            <div className="space-y-3">
              <ScoreBar label="Walk Score" score={amenities.walkScore} />
              <ScoreBar label="Transit Score" score={amenities.transitScore} />
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600 dark:text-gray-400">Nearby Parks</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {amenities.nearbyParks}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No amenities data available</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Data last updated: {new Date(lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}

function InfoCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</div>
      <div className={`font-semibold ${highlight ? 'text-blue-600 text-lg' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </div>
    </div>
  );
}

function SchoolCard({ name, rating, level }: { name?: string; rating?: number; level: string }) {
  if (!name) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-500 dark:text-gray-400">{level} School: Not available</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{name}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{level} School</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-lg font-bold text-blue-600">
          {rating ? `${rating.toFixed(1)}/10` : 'N/A'}
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score?: number }) {
  if (score === undefined) return null;

  const getColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-semibold text-gray-900 dark:text-white">{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div
          className={`${getColor(score)} h-2 rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
