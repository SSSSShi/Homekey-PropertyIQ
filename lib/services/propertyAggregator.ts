// Property data aggregator - combines data from multiple sources
import { prisma } from '@/lib/prisma';
import {
  fetchPropertyBasicInfo,
  fetchSchoolData,
  fetchCrimeData,
  fetchAmenitiesData,
} from './mockPropertyData';

export interface AggregatedPropertyData {
  property: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  basicInfo: {
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    yearBuilt?: number;
    propertyType?: string;
    estimatedValue?: number;
  };
  schools: {
    elementarySchool?: string;
    elementaryRating?: number;
    middleSchool?: string;
    middleRating?: number;
    highSchool?: string;
    highRating?: number;
  };
  crime: {
    crimeRate?: number;
    crimeLevel?: string;
  };
  amenities: {
    nearbyParks?: number;
    transitScore?: number;
    walkScore?: number;
  };
  dataQuality: {
    overallConfidence: number;
    basicInfoConfidence?: number;
    schoolsConfidence?: number;
    crimeConfidence?: number;
    amenitiesConfidence?: number;
    missingDataSources: string[];
  };
  lastUpdated: Date;
}

function parseAddress(address: string) {
  // Simple address parser
  const parts = address.split(',').map(p => p.trim());
  const street = parts[0] || address;
  const city = parts[1] || 'Unknown City';
  const stateZip = parts[2] || 'XX 00000';
  const [state, zipCode] = stateZip.split(' ').filter(Boolean);

  return {
    address: street,
    city,
    state: state || 'XX',
    zipCode: zipCode || '00000',
  };
}

export async function aggregatePropertyData(
  fullAddress: string
): Promise<AggregatedPropertyData> {
  const parsedAddress = parseAddress(fullAddress);

  // Fetch data from all sources in parallel
  const [basicInfo, schoolData, crimeData, amenitiesData] = await Promise.all([
    fetchPropertyBasicInfo(fullAddress),
    fetchSchoolData(fullAddress),
    fetchCrimeData(fullAddress),
    fetchAmenitiesData(fullAddress),
  ]);

  // Calculate confidence scores
  const missingDataSources: string[] = [];
  const confidences: number[] = [];

  if (basicInfo) {
    confidences.push(basicInfo.confidence);
  } else {
    missingDataSources.push('Property Records');
  }

  if (schoolData) {
    confidences.push(schoolData.confidence);
  } else {
    missingDataSources.push('School Ratings');
  }

  if (crimeData) {
    confidences.push(crimeData.confidence);
  } else {
    missingDataSources.push('Crime Statistics');
  }

  if (amenitiesData) {
    confidences.push(amenitiesData.confidence);
  } else {
    missingDataSources.push('Amenities Data');
  }

  const overallConfidence =
    confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / 4 // Average across all sources
      : 0;

  const aggregatedData: AggregatedPropertyData = {
    property: parsedAddress,
    basicInfo: {
      bedrooms: basicInfo?.bedrooms,
      bathrooms: basicInfo?.bathrooms,
      squareFeet: basicInfo?.squareFeet,
      yearBuilt: basicInfo?.yearBuilt,
      propertyType: basicInfo?.propertyType,
      estimatedValue: basicInfo?.estimatedValue,
    },
    schools: {
      elementarySchool: schoolData?.elementarySchool,
      elementaryRating: schoolData?.elementaryRating,
      middleSchool: schoolData?.middleSchool,
      middleRating: schoolData?.middleRating,
      highSchool: schoolData?.highSchool,
      highRating: schoolData?.highRating,
    },
    crime: {
      crimeRate: crimeData?.crimeRate,
      crimeLevel: crimeData?.crimeLevel,
    },
    amenities: {
      nearbyParks: amenitiesData?.nearbyParks,
      transitScore: amenitiesData?.transitScore,
      walkScore: amenitiesData?.walkScore,
    },
    dataQuality: {
      overallConfidence,
      basicInfoConfidence: basicInfo?.confidence,
      schoolsConfidence: schoolData?.confidence,
      crimeConfidence: crimeData?.confidence,
      amenitiesConfidence: amenitiesData?.confidence,
      missingDataSources,
    },
    lastUpdated: new Date(),
  };

  // Save to database
  try {
    const property = await prisma.property.upsert({
      where: { address: parsedAddress.address },
      update: { updatedAt: new Date() },
      create: {
        address: parsedAddress.address,
        city: parsedAddress.city,
        state: parsedAddress.state,
        zipCode: parsedAddress.zipCode,
      },
    });

    await prisma.propertySnapshot.create({
      data: {
        propertyId: property.id,
        bedrooms: basicInfo?.bedrooms,
        bathrooms: basicInfo?.bathrooms,
        squareFeet: basicInfo?.squareFeet,
        yearBuilt: basicInfo?.yearBuilt,
        propertyType: basicInfo?.propertyType,
        estimatedValue: basicInfo?.estimatedValue,
        elementarySchool: schoolData?.elementarySchool,
        elementaryRating: schoolData?.elementaryRating,
        middleSchool: schoolData?.middleSchool,
        middleRating: schoolData?.middleRating,
        highSchool: schoolData?.highSchool,
        highRating: schoolData?.highRating,
        crimeRate: crimeData?.crimeRate,
        crimeLevel: crimeData?.crimeLevel,
        nearbyParks: amenitiesData?.nearbyParks,
        transitScore: amenitiesData?.transitScore,
        walkScore: amenitiesData?.walkScore,
        dataConfidence: overallConfidence,
      },
    });
  } catch (error) {
    console.error('Error saving to database:', error);
  }

  return aggregatedData;
}
