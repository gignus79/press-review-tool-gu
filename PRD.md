# Planning Guide

A web application for automated analysis of music press reviews using AI-powered search and categorization to help music professionals track media coverage efficiently.

**Experience Qualities**:
1. **Professional** - Clean, data-focused interface that communicates credibility and precision for industry professionals
2. **Efficient** - Streamlined workflows that minimize clicks and maximize information density without overwhelming
3. **Intelligent** - Smart automation that feels powerful yet approachable, showcasing AI capabilities naturally

**Complexity Level**: Light Application (multiple features with basic state)
  - Multi-step search workflow with results management, filtering, and export capabilities while maintaining straightforward user flows

## Essential Features

### Search Configuration
- **Functionality**: Configure multi-query search parameters including artist/topic, date ranges, source filters, and content type preferences
- **Purpose**: Enable precise targeting of relevant press coverage across diverse music journalism sources
- **Trigger**: Primary action button on landing view or dashboard
- **Progression**: Click "New Search" → Input search terms → Configure filters (dates, sources, content types) → Review settings → Execute search
- **Success criteria**: Clear form validation, intelligent defaults, settings persist for repeated searches

### AI-Powered Analysis
- **Functionality**: Automated GPT analysis that categorizes results by sentiment, relevance, outlet authority, and key themes
- **Purpose**: Transform raw search results into actionable insights without manual review of hundreds of articles
- **Trigger**: Automatically initiates after search completes
- **Progression**: Search completes → Loading state with progress indicator → AI processes each result → Real-time updates as analysis completes → Display analyzed results grid
- **Success criteria**: Clear progress feedback, results populate progressively, analysis tags are understandable

### Results Management
- **Functionality**: Interactive data table with sorting, filtering by AI categories, deduplication controls, and relevance ranking
- **Purpose**: Allow users to refine large result sets to the most valuable articles for their needs
- **Trigger**: Results populate after analysis
- **Progression**: View results table → Apply filters/sorts → Select/deselect items → Review selected subset → Proceed to export
- **Success criteria**: Responsive table, instant filter application, clear selected item count, no performance lag with 100+ results

### Export Options
- **Functionality**: Export filtered results to PDF (formatted report), Excel (data analysis), or JSON (developer integration)
- **Purpose**: Enable integration with existing workflows and sharing with stakeholders
- **Trigger**: Export button in results toolbar
- **Progression**: Click export → Select format from dropdown → Configure export options (selected only, include analysis) → Generate → Download file
- **Success criteria**: Files download immediately, format matches expectations, includes all relevant data

### Search History
- **Functionality**: Persistent log of previous searches with ability to re-run or view cached results
- **Purpose**: Track coverage over time and avoid redundant searches
- **Trigger**: Access from sidebar or header navigation
- **Progression**: Click history → Browse past searches → Select search → View original results or re-run with same parameters
- **Success criteria**: Searches stored with timestamps, quick access to recent searches, clear differentiation between cached and new results

## Edge Case Handling

- **No Results Found**: Display helpful empty state with search tips and suggestion to broaden parameters
- **API Rate Limiting**: Show clear message with retry countdown, queue subsequent requests automatically
- **Partial Analysis Failures**: Display results with mixed states (analyzed vs. pending), allow manual retry for failed items
- **Large Result Sets**: Implement pagination or virtual scrolling, warn users before 200+ result searches
- **Duplicate Detection**: Highlight detected duplicates with visual indicator, provide bulk deduplication action
- **Network Interruption**: Auto-save search state, resume from last successful point when reconnected
- **Invalid Search Terms**: Real-time validation with helpful error messages before submission
- **Export Failures**: Retry mechanism with fallback formats, clear error explanation

## Design Direction

The design should evoke professional confidence and technical sophistication - imagine a Bloomberg Terminal meets modern SaaS clarity. It should feel like a serious research tool that respects the user's expertise while removing complexity through intelligent automation. Lean toward a rich interface with data density that doesn't sacrifice breathing room.

## Color Selection

Triadic color scheme - three equally spaced colors creating dynamic yet balanced professional aesthetic suitable for data-heavy interface with distinct accent needs.

- **Primary Color**: Deep indigo blue (oklch(0.45 0.15 270)) - Communicates intelligence, trust, and technology sophistication; used for primary actions and navigation
- **Secondary Colors**: 
  - Warm amber (oklch(0.75 0.15 75)) - Represents insight and highlighting; used for AI analysis indicators and important data points
  - Teal green (oklch(0.65 0.12 195)) - Suggests accuracy and success; used for positive sentiment and verified information
- **Accent Color**: Vibrant coral (oklch(0.70 0.19 25)) - Attention-grabbing for CTAs, warnings, and interactive focus states
- **Foreground/Background Pairings**:
  - Background (Light neutral oklch(0.98 0.005 270)): Dark slate text (oklch(0.25 0.02 270)) - Ratio 13.8:1 ✓
  - Card (White oklch(1 0 0)): Dark slate text (oklch(0.25 0.02 270)) - Ratio 14.6:1 ✓
  - Primary (Deep indigo oklch(0.45 0.15 270)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Secondary (Warm amber oklch(0.75 0.15 75)): Dark brown text (oklch(0.30 0.08 75)) - Ratio 6.8:1 ✓
  - Accent (Vibrant coral oklch(0.70 0.19 25)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Muted (Cool gray oklch(0.94 0.01 270)): Medium slate text (oklch(0.50 0.03 270)) - Ratio 5.2:1 ✓

## Font Selection

Typefaces should balance technical precision with contemporary readability - suggesting analytical capability without coldness. Using Inter for its exceptional legibility in data-heavy UIs and JetBrains Mono for technical elements.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/32px/tight letter spacing (-0.02em)
  - H2 (Section Header): Inter Semibold/24px/tight letter spacing (-0.01em)
  - H3 (Card Title): Inter Semibold/18px/normal letter spacing
  - Body (Primary Text): Inter Regular/15px/relaxed line height (1.6)
  - Body Small (Meta Info): Inter Regular/13px/relaxed line height (1.5)
  - Caption (Timestamps, Labels): Inter Medium/11px/wide letter spacing (0.03em)/uppercase
  - Code/Data (IDs, JSON): JetBrains Mono Regular/14px/normal letter spacing

## Animations

Animations should feel responsive and data-driven - quick, precise movements that suggest computation and analysis rather than playfulness. Think terminal loading sequences meets polished SaaS.

- **Purposeful Meaning**: Use animation to communicate AI processing (subtle shimmer on analyzing items), data updates (smooth number transitions), and state changes (elegant panel slides)
- **Hierarchy of Movement**: 
  - Critical: Search execution and AI analysis progress (prominent, informative)
  - Secondary: Filter application and result updates (smooth, unobtrusive)
  - Tertiary: Hover states and micro-interactions (subtle, refined)

## Component Selection

- **Components**:
  - **Dialog**: Configure search parameters and export options with focused modal context
  - **Card**: Individual result items with hover elevation, analysis badges, and action menus
  - **Table**: Main results grid with sortable columns, row selection, and inline filtering
  - **Badge**: AI analysis tags (sentiment, relevance score, content type) with color coding
  - **Button**: Primary actions use filled indigo, secondary use outline, icon-only for compact toolbars
  - **Input/Textarea**: Search term entry with real-time validation and suggestion chips
  - **Select/Dropdown-menu**: Filter controls and export format selection
  - **Tabs**: Switch between search results, history, and settings views
  - **Progress**: Linear progress for search/analysis operations with percentage display
  - **Separator**: Divide toolbar sections and form groups
  - **Scroll-area**: Smooth scrolling for large result sets and history lists
  - **Tooltip**: Explain AI scoring metrics and technical abbreviations
  - **Sheet**: Slide-out panel for search history and detailed result previews

- **Customizations**:
  - Custom "AnalysisCard" component combining Card with Badge clusters and progress indicators
  - Custom "SearchToolbar" component with filter chips and export controls
  - Custom "MetricDisplay" component for large numerical stats with animated transitions
  - Custom "LoadingPulse" component for AI processing state with branded animation

- **States**:
  - Buttons: Default → Hover (slight elevation) → Active (scale down 98%) → Disabled (reduced opacity 40%)
  - Inputs: Default → Focus (indigo ring, label color shift) → Error (coral border, shake animation) → Success (teal checkmark)
  - Cards: Rest → Hover (elevation increase, border highlight) → Selected (indigo border, background tint)

- **Icon Selection**:
  - MagnifyingGlass (search actions)
  - SparklesFilled (AI analysis indicator)
  - FunnelSimple (filter controls)
  - DownloadSimple (export actions)
  - ClockCounterClockwise (history access)
  - ChartBar (analytics/insights)
  - FilePdf, FileXls, FileCode (export formats)
  - CheckCircle (success states)
  - WarningCircle (rate limiting)
  - X (close, remove)
  - CaretDown, CaretUp (sorting)
  - Rows (table view)
  - Copy (duplicate detection)

- **Spacing**: 
  - Macro layout: gap-6 (1.5rem) between major sections
  - Card padding: p-6 for content, p-4 for compact variants
  - Form elements: gap-4 between fields, gap-2 for related button groups
  - Inline elements: gap-1.5 for badge clusters, gap-3 for toolbar items

- **Mobile**:
  - Table transforms to stacked cards below 768px
  - Search dialog becomes full-screen sheet on mobile
  - Toolbar actions collapse to dropdown menu
  - Results show 10 items per page on mobile vs 50 on desktop
  - Filters move to bottom sheet drawer
  - Two-column grid becomes single column below 640px
