import { NextRequest, NextResponse } from 'next/server';
import { aggregatePropertyData } from '@/lib/services/propertyAggregator';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const propertyData = await aggregatePropertyData(address);

    return NextResponse.json(propertyData);
  } catch (error) {
    console.error('Error fetching property data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property data' },
      { status: 500 }
    );
  }
}
