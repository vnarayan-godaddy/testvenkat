# Hivemind Experiments Viewer

A beautiful, modern dashboard to view and explore your favorite experiments from GoDaddy's Hivemind experimentation platform.

![Hivemind Experiments Viewer](https://img.shields.io/badge/Hivemind-Experiments-00a4a6)

## Features

- 📊 **Dashboard Overview** - See stats for all experiments at a glance
- 🔍 **Smart Filtering** - Filter by status (Win/Loss/Inconclusive/Running), search by name, filter by business unit
- 📈 **Experiment Details** - View full hypothesis, metrics, and owners in a slide-out panel
- ⭐ **Showcase Votes** - See which experiments have the most votes
- 🎨 **Modern UI** - Beautiful dark theme with glass morphism and smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Connecting to Live Hivemind Data

The app currently uses sample data from the January 2026 Showcase. To connect to live Hivemind data:

### Option 1: Use the Hivemind MCP Tools (Recommended)

If you have Hivemind MCP configured in your environment, you can fetch experiments using these tools:

- `mcp_hivemind_search_experiments` - Search all experiments
- `mcp_hivemind_get_experiment_by_owner` - Get experiments you own
- `mcp_hivemind_get_current_showcase_experiments` - Get showcase experiments with votes
- `mcp_hivemind_get_experiment_by_id` - Get detailed experiment info

### Option 2: Direct API Integration

Create an API route in `app/api/experiments/route.ts` to call the Hivemind API directly.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main dashboard page
├── components/
│   ├── ExperimentCard.tsx      # Experiment card component
│   ├── ExperimentDetail.tsx    # Detail slide-out panel
│   ├── ExperimentFilters.tsx   # Filter controls
│   ├── Header.tsx              # App header
│   └── StatsCards.tsx          # Statistics cards
├── types/
│   └── experiment.ts    # TypeScript interfaces
└── package.json
```

## Customization

### Colors

The color palette is defined in `tailwind.config.ts`:

- **Hive (Primary)**: Teal tones inspired by GoDaddy
- **Nectar (Accent)**: Amber/gold for highlights
- **Status Colors**: Green (win), Red (loss), Yellow (inconclusive), Blue (running)

### Adding New Features

1. **More Filters**: Add to `ExperimentFilters.tsx` and update filter logic in `page.tsx`
2. **New Stats**: Add cards to `StatsCards.tsx`
3. **API Integration**: Create API routes in `app/api/` directory

## License

Internal GoDaddy project
