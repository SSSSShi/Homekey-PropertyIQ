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

    // Generate demo summary to showcase the feature
    const { property, basicInfo, schools, crime, amenities, dataQuality } = propertyData;

    // Create a contextual demo summary based on actual data
    const schoolQuality = schools.elementaryRating && schools.middleRating && schools.highRating
      ? (schools.elementaryRating + schools.middleRating + schools.highRating) / 3
      : null;

    const safetyNote = crime.crimeLevel === 'Very Low' || crime.crimeLevel === 'Low'
      ? 'This area boasts strong safety ratings'
      : crime.crimeLevel === 'Moderate'
      ? 'The neighborhood shows moderate crime levels'
      : 'Safety is a consideration in this area';

    const schoolNote = schoolQuality
      ? schoolQuality >= 8
        ? 'with excellent schools earning high ratings across all levels'
        : schoolQuality >= 6
        ? 'with good schools that serve the community well'
        : 'though school ratings suggest room for improvement'
      : 'with local schools available';

    const walkNote = amenities.walkScore && amenities.walkScore >= 70
      ? 'The location excels in walkability and transit access, perfect for those who value urban convenience.'
      : amenities.walkScore && amenities.walkScore >= 50
      ? 'The area offers moderate walkability, with some amenities within reach.'
      : 'This location is more car-dependent, typical of suburban settings.';

    return `This ${basicInfo.propertyType || 'property'} at ${property.address} offers ${basicInfo.bedrooms || 'several'} bedrooms and ${basicInfo.bathrooms || 'multiple'} bathrooms across ${basicInfo.squareFeet?.toLocaleString() || 'substantial'} square feet, built in ${basicInfo.yearBuilt || 'the mid-century'}. Valued at approximately ${basicInfo.estimatedValue ? `$${basicInfo.estimatedValue.toLocaleString()}` : 'market rate'}, this home presents a solid opportunity in ${property.city}.

${safetyNote} ${schoolNote}, making it ${schoolQuality && schoolQuality >= 7 ? 'an attractive option for families' : 'worth considering for various buyer types'}. ${walkNote} ${amenities.nearbyParks ? `With ${amenities.nearbyParks} parks nearby, ` : ''}outdoor recreation is accessible.

Our data confidence for this property stands at ${Math.round(dataQuality.overallConfidence * 100)}%${dataQuality.missingDataSources.length > 0 ? `, though ${dataQuality.missingDataSources.join(' and ')} data is limited` : ', providing a reliable foundation for your decision'}.

**Note**: This is a demo summary. To enable real GPT-4 powered insights, add credits to your OpenAI account or use a valid API key with available quota.`;
  }
}
