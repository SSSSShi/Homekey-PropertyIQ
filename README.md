# HomeKey - Real Estate Property Brief Generator

A full-stack application that aggregates scattered real estate property information from multiple sources into a clear, comprehensive property brief.

## 🎯 Challenge Overview

Real estate property information is often scattered across multiple sources, incomplete, or inconsistent. HomeKey solves this by aggregating data from multiple sources and presenting it with confidence scoring to help buyers make informed decisions.

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite + Prisma ORM
- **Data Sources**: Mock APIs (simulating external property data services)

### System Design

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       v
┌─────────────────────────────────────┐
│       Next.js Frontend (RSC)        │
│  - Address search interface         │
│  - Property brief display           │
│  - Confidence indicators            │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│      API Route (/api/property)      │
│  - Request validation               │
│  - Orchestrates data aggregation    │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│    Property Aggregator Service      │
│  - Parallel API calls               │
│  - Data normalization               │
│  - Confidence scoring               │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       v               v
┌─────────────┐  ┌──────────┐
│  Mock APIs  │  │ Database │
│  - Property │  │ (SQLite) │
│  - Schools  │  │  Prisma  │
│  - Crime    │  └──────────┘
│  - Amenities│
└─────────────┘
```

## 🚀 Features

### 1. Multi-Source Data Aggregation
- **Property Records**: Basic info (beds, baths, sq ft, year built, estimated value)
- **School Ratings**: Elementary, middle, and high school ratings
- **Crime Statistics**: Crime rates and safety levels
- **Amenities**: Walk score, transit score, nearby parks

### 2. Data Quality Indicators
- **Confidence Scoring**: Each data source returns a confidence score (0-1)
- **Overall Confidence**: Weighted average across all sources
- **Missing Data Transparency**: Clear indicators when data is unavailable
- **Source Attribution**: Users know where data came from

### 3. User Experience
- **Fast Response**: Parallel API calls for sub-second aggregation
- **Progressive Loading**: Loading states for better UX
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode Support**: Built-in theme support

### 4. Data Persistence
- Properties and snapshots stored in SQLite database
- Historical data tracking via snapshot system
- Efficient query patterns with Prisma

## 📁 Project Structure

```
homekey/
├── app/
│   ├── api/
│   │   └── property/
│   │       └── route.ts          # API endpoint
│   ├── generated/
│   │   └── prisma/               # Generated Prisma client
│   └── page.tsx                  # Main search interface
├── components/
│   └── PropertyBrief.tsx         # Property display component
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   └── services/
│       ├── mockPropertyData.ts   # Mock external APIs
│       └── propertyAggregator.ts # Data aggregation logic
├── prisma/
│   └── schema.prisma             # Database schema
└── README.md
```

## 🔑 Key Design Decisions

### 1. **Mock APIs Instead of Real Integrations**
**Decision**: Implemented mock data sources with realistic latency and failure rates.

**Rationale**:
- Demonstrates architecture without API key requirements
- Shows error handling and missing data scenarios
- Allows for reproducible demo experience
- Production version would simply swap mock services for real API clients

**Trade-offs**:
- Mock data is deterministic based on address hash
- Doesn't show real API rate limiting or caching strategies

### 2. **SQLite + Prisma Over PostgreSQL**
**Decision**: Used SQLite as the database with Prisma ORM.

**Rationale**:
- Zero configuration - works out of the box
- Perfect for technical assessment and demos
- Prisma provides type-safety and excellent DX
- Easy to version control and share

**Trade-offs**:
- Not production-ready for high concurrency
- Would migrate to PostgreSQL/Planetscale for production
- Missing advanced features like full-text search

### 3. **Server-Side Data Aggregation**
**Decision**: Aggregate data on the server via API routes, not client-side.

**Rationale**:
- Keeps API keys secure (important for real implementations)
- Better performance with server-side parallelization
- Easier to implement caching strategies
- Reduces client bundle size

**Trade-offs**:
- Adds server round-trip latency
- Requires server resources for aggregation

### 4. **Confidence Scoring System**
**Decision**: Each data source provides a confidence score, aggregated into overall score.

**Rationale**:
- Transparency about data quality is crucial for real estate decisions
- Helps users understand when to verify information
- Enables future ML-based confidence improvements
- Shows incomplete data is acceptable with proper context

**Trade-offs**:
- Simple averaging may not be ideal (could weight sources differently)
- Mock confidence scores are synthetic

### 5. **Next.js App Router (RSC)**
**Decision**: Used Next.js 15 with App Router and Server Components.

**Rationale**:
- Modern React patterns with better performance
- Server components reduce client bundle size
- Built-in API routes simplify architecture
- Excellent TypeScript support

**Trade-offs**:
- Steeper learning curve than Pages Router
- Some ecosystem libraries not yet compatible

## 🎨 UX Design Choices

### Visual Hierarchy
1. **Search First**: Large, prominent search bar
2. **Quality Score**: Overall confidence score displayed prominently
3. **Critical Info First**: Property details and estimated value at the top
4. **Supporting Info**: Schools, crime, amenities below

### Color Coding
- **Confidence Scores**: Green (>80%), Yellow (60-80%), Red (<60%)
- **Crime Levels**: Green (low), Yellow (moderate), Red (high)
- **Scores**: Progressive color bars for walk/transit scores

### Error States
- Clear messaging when data sources fail
- "Missing data from" warnings with source names
- Graceful degradation (show what's available)

## 🔮 Future Improvements (With More Time)

### Performance Optimizations
1. **Caching Layer**: Redis for caching external API responses
2. **Request Deduplication**: Prevent duplicate API calls for same address
3. **Incremental Static Regeneration**: Pre-generate popular properties

### Feature Enhancements
1. **Historical Trends**: Show property value changes over time
2. **Comparison View**: Compare multiple properties side-by-side
3. **Map Integration**: Google Maps showing nearby amenities
4. **Photo Integration**: Property images from Zillow/Redfin APIs
5. **Neighborhood Insights**: Demographics, schools, crime trends
6. **Export to PDF**: Generate shareable property reports

### Data Quality Improvements
1. **Real API Integrations**:
   - Zillow/Redfin for property data
   - GreatSchools API for school ratings
   - SpotCrime API for crime data
   - Walk Score API for walkability
2. **ML-Based Confidence**: Learn from user feedback on data accuracy
3. **Data Reconciliation**: When multiple sources disagree, show all values
4. **Update Frequency**: Track how stale data is, auto-refresh old data

### User Experience
1. **Search Autocomplete**: Google Places API for address suggestions
2. **Recent Searches**: Save user's search history
3. **Favorites/Bookmarks**: Let users save properties
4. **Notifications**: Alert users when saved properties have updates
5. **Mobile App**: Native iOS/Android apps

### Architecture Improvements
1. **Queue System**: Bull/BullMQ for background data fetching
2. **Microservices**: Separate services for each data source
3. **GraphQL API**: More flexible than REST for complex queries
4. **Monitoring**: Sentry, Datadog for error tracking and performance
5. **Rate Limiting**: Protect API from abuse
6. **Authentication**: User accounts for saved searches

### Testing
1. **Unit Tests**: Jest/Vitest for business logic
2. **Integration Tests**: Test API routes with real database
3. **E2E Tests**: Playwright for critical user flows
4. **Load Testing**: Ensure system handles concurrent users

### DevOps
1. **CI/CD**: GitHub Actions for automated testing and deployment
2. **Docker**: Containerize for consistent deployments
3. **Staging Environment**: Test before production
4. **Database Migrations**: Automated with Prisma Migrate

## 🏃 Running the Project

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd homekey

# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Visit `http://localhost:3000` and enter an address like:
- "123 Main St, San Francisco, CA 94102"
- "456 Oak Ave, Austin, TX 78701"
- "789 Elm Blvd, Seattle, WA 98101"

### Build for Production

```bash
npm run build
npm start
```

## 📊 Time Breakdown

- **Setup & Configuration**: 15 minutes
  - Next.js initialization
  - Prisma setup
  - Database schema design

- **Backend Development**: 45 minutes
  - Mock API services with realistic data
  - Data aggregation service with confidence scoring
  - API route implementation
  - Database integration

- **Frontend Development**: 45 minutes
  - Search interface
  - Property brief component
  - Responsive design
  - Loading/error states

- **Documentation**: 15 minutes
  - This README
  - Code comments
  - Design decisions documentation

**Total**: ~2 hours

## 🤔 Technical Challenges Faced

1. **Type Safety with Dynamic Data**: Ensured full type safety despite optional/missing data from mock APIs
2. **Confidence Score Calculation**: Designed a simple but extensible scoring system
3. **Graceful Degradation**: Made UI work well even with partial data
4. **Performance**: Parallelized API calls for fast response times

## 💡 What I Learned

1. **Data Quality Matters**: Showing confidence scores builds user trust
2. **Fail Gracefully**: Real estate data is messy; embrace missing data
3. **TypeScript is Essential**: Type safety caught many potential bugs
4. **User Context**: Buyers need different info than sellers/agents

## 📝 Notes for Reviewers

- The mock APIs intentionally simulate realistic scenarios (10-20% failure rates, variable latency)
- Database schema supports historical tracking via snapshots (not fully implemented in 2hr scope)
- The confidence scoring system is simple but demonstrates the concept
- All TypeScript with strict mode enabled
- Responsive design tested on mobile and desktop viewports

---

**Author**: Built as a technical assessment for a Full Stack Engineer role
**Time**: 2 hours
**Date**: 2025
