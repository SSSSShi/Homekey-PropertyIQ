# HomeKey - Real Estate Property Brief Generator

A full-stack application that aggregates scattered real estate property information into clear, AI-powered property insights.

## Running the Project

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and search for addresses like "123 Main St, San Francisco, CA 94102".

**Note**: To enable AI summaries, add your OpenAI API key:
```bash
echo 'OPENAI_API_KEY=your-key-here' >> .env
```

## Approach

### Architecture
Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **SQLite/Prisma**, and **OpenAI API**. The system aggregates data from multiple mock sources (property records, schools, crime statistics, amenities) in parallel, then generates an AI-powered summary using GPT-4o-mini.

```
User Search → API Route → [Parallel Data Aggregation] → AI Summary → UI Display
                             ├─ Property Data
                             ├─ School Ratings
                             ├─ Crime Stats
                             └─ Amenities
```

### Key Features
1. **Multi-Source Aggregation** - Combines 4 data sources with parallel API calls (<1s response)
2. **AI-Powered Insights** - GPT-4o-mini generates natural language property summaries
3. **Confidence Scoring** - Each data source provides quality scores (0-1) for transparency
4. **Graceful Degradation** - Shows partial data when sources fail, with clear indicators
5. **Type-Safe** - Full TypeScript with Prisma ORM for database operations

### Project Structure
```
homekey/
├── app/
│   ├── api/property/route.ts        # Aggregation + AI summary endpoint
│   └── page.tsx                     # Search interface
├── components/PropertyBrief.tsx     # Property display with AI insights
├── lib/services/
│   ├── mockPropertyData.ts          # Mock external APIs
│   ├── propertyAggregator.ts        # Data aggregation logic
│   └── aiSummary.ts                 # OpenAI integration
└── prisma/schema.prisma             # Database schema
```

## Design Decisions & Trade-offs

### 1. Mock APIs vs Real Integrations
**Why**: Demonstrates architecture without API keys. Mock services simulate realistic latency (200-500ms) and failure rates (10-20%).
**Trade-off**: Deterministic data based on address hash. Production would use real APIs (Zillow, GreatSchools, SpotCrime, WalkScore).

### 2. SQLite + Prisma
**Why**: Zero-config database, type-safe queries, easy to demo.
**Trade-off**: Not production-ready for high concurrency. Would migrate to PostgreSQL/Supabase.

### 3. Server-Side Aggregation
**Why**: Keeps API keys secure, better performance with parallel requests, smaller client bundle.
**Trade-off**: Server round-trip latency (mitigated by fast parallel calls).

### 4. OpenAI Integration
**Why**: AI summarizes complex data into digestible insights, personalizes the experience, shows integration with modern LLM APIs.
**Trade-off**: Adds cost and latency (~500ms). Fallback message shown if API key missing.

### 5. Confidence Scoring
**Why**: Real estate decisions need transparency about data quality. Shows which sources are reliable.
**Trade-off**: Simple averaging formula—production would use weighted scores based on source reliability.

## Technical Highlights

- **Type Safety**: Strict TypeScript throughout with Prisma-generated types
- **Performance**: Parallel API calls + streaming responses
- **Error Handling**: Graceful fallbacks for missing data and API failures
- **Responsive Design**: Mobile-first with dark mode support
- **Database**: Schema supports historical snapshots (for future price trend features)

## What I'd Do With More Time

### Data Quality
- Integrate real APIs (Zillow, GreatSchools, SpotCrime, Walk Score)
- Add Redis caching layer for API responses
- Implement data reconciliation when sources disagree
- Track data freshness and auto-refresh stale data

### Features
- **Historical trends**: Show property value changes over time
- **Comparison view**: Side-by-side property comparison
- **Map integration**: Google Maps with nearby amenities
- **Photo carousel**: Property images from Zillow/Redfin
- **PDF export**: Generate shareable property reports
- **User accounts**: Save favorites, search history, price alerts

### AI Enhancements
- Streaming AI responses for faster perceived performance
- Multi-model approach (GPT-4 for insights, Claude for risk analysis)
- Personalized summaries based on buyer preferences (family-focused, investment, retirement)
- Generate specific questions to ask during property tours

### Performance
- Implement request deduplication
- Add incremental static regeneration for popular properties
- Queue system (BullMQ) for background data fetching
- Edge caching with Vercel/Cloudflare

### Testing & DevOps
- Unit tests (Vitest) for business logic
- E2E tests (Playwright) for critical flows
- CI/CD pipeline (GitHub Actions)
- Monitoring (Sentry, Datadog)

### Architecture
- GraphQL API for flexible queries
- Microservices for each data source
- Rate limiting and authentication
- Websockets for real-time property updates
