// Mock property data service - simulates external API calls

export interface PropertyBasicInfo {
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  propertyType: string;
  estimatedValue: number;
  confidence: number;
}

export interface SchoolData {
  elementarySchool: string;
  elementaryRating: number;
  middleSchool: string;
  middleRating: number;
  highSchool: string;
  highRating: number;
  confidence: number;
}

export interface CrimeData {
  crimeRate: number;
  crimeLevel: string;
  confidence: number;
}

export interface AmenitiesData {
  nearbyParks: number;
  transitScore: number;
  walkScore: number;
  confidence: number;
}

// Simulates fetching basic property info from public records
export async function fetchPropertyBasicInfo(address: string): Promise<PropertyBasicInfo | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

  // Mock data based on address hash
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (hash % 100) / 100;

  // Simulate 10% chance of missing data
  if (random < 0.1) {
    return null;
  }

  return {
    bedrooms: 2 + Math.floor(random * 5),
    bathrooms: 1 + Math.floor(random * 3.5),
    squareFeet: 1000 + Math.floor(random * 3000),
    yearBuilt: 1950 + Math.floor(random * 74),
    propertyType: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'][Math.floor(random * 4)],
    estimatedValue: 200000 + Math.floor(random * 800000),
    confidence: 0.7 + random * 0.3, // 70-100% confidence
  };
}

// Simulates fetching school ratings
export async function fetchSchoolData(address: string): Promise<SchoolData | null> {
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));

  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (hash % 100) / 100;

  // Simulate 15% chance of incomplete data
  if (random < 0.15) {
    return null;
  }

  return {
    elementarySchool: `${address.split(' ')[0]} Elementary`,
    elementaryRating: 5 + random * 5,
    middleSchool: `${address.split(' ')[0]} Middle School`,
    middleRating: 4 + random * 6,
    highSchool: `${address.split(' ')[0]} High School`,
    highRating: 6 + random * 4,
    confidence: 0.6 + random * 0.3, // 60-90% confidence
  };
}

// Simulates fetching crime statistics
export async function fetchCrimeData(address: string): Promise<CrimeData | null> {
  await new Promise(resolve => setTimeout(resolve, 250 + Math.random() * 250));

  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (hash % 100) / 100;

  // Simulate 20% chance of missing data
  if (random < 0.2) {
    return null;
  }

  const crimeRate = random * 100;
  let crimeLevel: string;
  if (crimeRate < 25) crimeLevel = 'Very Low';
  else if (crimeRate < 50) crimeLevel = 'Low';
  else if (crimeRate < 75) crimeLevel = 'Moderate';
  else crimeLevel = 'High';

  return {
    crimeRate,
    crimeLevel,
    confidence: 0.5 + random * 0.4, // 50-90% confidence
  };
}

// Simulates fetching nearby amenities
export async function fetchAmenitiesData(address: string): Promise<AmenitiesData | null> {
  await new Promise(resolve => setTimeout(resolve, 350 + Math.random() * 200));

  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (hash % 100) / 100;

  // Simulate 12% chance of missing data
  if (random < 0.12) {
    return null;
  }

  return {
    nearbyParks: Math.floor(random * 10),
    transitScore: Math.floor(20 + random * 80),
    walkScore: Math.floor(10 + random * 90),
    confidence: 0.65 + random * 0.35, // 65-100% confidence
  };
}
