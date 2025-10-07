import OpenAI from 'openai';
import type { AggregatedPropertyData } from './propertyAggregator';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePropertySummary(
  propertyData: AggregatedPropertyData
): Promise<string> {
  try {
    const { property, basicInfo, schools, crime, amenities, dataQuality } = propertyData;

    // Build context for the AI
    const context = `
Property Address: ${property.address}, ${property.city}, ${property.state} ${property.zipCode}

PROPERTY DETAILS:
- Type: ${basicInfo.propertyType || 'Unknown'}
- Bedrooms: ${basicInfo.bedrooms || 'N/A'}
- Bathrooms: ${basicInfo.bathrooms || 'N/A'}
- Square Feet: ${basicInfo.squareFeet?.toLocaleString() || 'N/A'}
- Year Built: ${basicInfo.yearBuilt || 'N/A'}
- Estimated Value: $${basicInfo.estimatedValue?.toLocaleString() || 'N/A'}

SCHOOLS:
- Elementary: ${schools.elementarySchool || 'N/A'} (Rating: ${schools.elementaryRating?.toFixed(1) || 'N/A'}/10)
- Middle: ${schools.middleSchool || 'N/A'} (Rating: ${schools.middleRating?.toFixed(1) || 'N/A'}/10)
- High: ${schools.highSchool || 'N/A'} (Rating: ${schools.highRating?.toFixed(1) || 'N/A'}/10)

SAFETY:
- Crime Level: ${crime.crimeLevel || 'N/A'}
- Crime Rate: ${crime.crimeRate?.toFixed(1) || 'N/A'} per 100k

WALKABILITY & AMENITIES:
- Walk Score: ${amenities.walkScore || 'N/A'}/100
- Transit Score: ${amenities.transitScore || 'N/A'}/100
- Nearby Parks: ${amenities.nearbyParks || 'N/A'}

DATA QUALITY:
- Overall Confidence: ${Math.round(dataQuality.overallConfidence * 100)}%
- Missing Data: ${dataQuality.missingDataSources.length > 0 ? dataQuality.missingDataSources.join(', ') : 'None'}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a real estate analyst helping potential home buyers. Generate a concise, insightful 3-4 paragraph summary of the property data provided. Focus on:
1. Key property highlights and value proposition
2. School quality and family-friendliness
3. Safety and neighborhood character
4. Walkability and lifestyle factors

Be honest about data gaps and mention the overall data confidence score. Write in a professional but friendly tone. Keep it under 200 words.`,
        },
        {
          role: 'user',
          content: context,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content || 'Unable to generate summary at this time.';
  } catch (error) {
    console.error('Error generating AI summary:', error);

    // Fallback summary if OpenAI fails
    return `This property at ${propertyData.property.address} offers ${propertyData.basicInfo.bedrooms || 'an unknown number of'} bedrooms and ${propertyData.basicInfo.bathrooms || 'unknown'} bathrooms. Data confidence for this property is ${Math.round(propertyData.dataQuality.overallConfidence * 100)}%. AI summary generation is currently unavailable - please ensure OPENAI_API_KEY is set in your environment variables.`;
  }
}
