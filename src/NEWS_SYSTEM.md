# Frontend News System Documentation

## 📰 Features

The frontend news system includes:

- **News Listing Page** (`/[locale]/news`) - View all news articles in a grid layout
- **News Detail Page** (`/[locale]/news/[id]`) - Read individual articles
- **Search & Filter** - Search articles by title and content
- **Sorting Options** - Sort by newest, oldest, or title
- **Responsive Design** - Beautiful dark theme optimized for all devices
- **Related Articles** - Suggestions based on the current article
- **API Integration** - Fetches data from the backend API

## 📁 File Structure

```
src/
├── components/
│   ├── news-card.tsx          # Individual news article card
│   └── news-list.tsx          # News listing with search and filter
├── app/[locale]/
│   └── news/
│       ├── page.tsx           # News listing page
│       └── [id]/
│           └── page.tsx       # Individual news detail page
└── lib/
    └── utils.ts               # Utility functions (formatDate, etc.)
```

## 🎨 Components

### NewsCard
Displays a single news article in a card format.

**Props:**
- `news: NewsItem` - The news article data
- `locale: string` - Current locale (en, uk, etc.)

**Features:**
- "New" badge for articles less than 7 days old
- Excerpt of article content
- Published date
- Character count
- Read more link

### NewsList
Displays a filterable and sortable list of news articles.

**Props:**
- `locale: string` - Current locale
- `initialNews?: NewsItem[]` - Optional initial news data

**Features:**
- Search articles by title or content
- Sort by: newest, oldest, or title
- Loading states with skeleton loaders
- Error handling
- Empty state
- Load more button

## 📄 Pages

### News Listing Page
**Route:** `/{locale}/news`

Shows all news articles with:
- Hero section with title and description
- Search and filter controls
- Grid layout of news cards
- Newsletter subscription CTA

### News Detail Page
**Route:** `/{locale}/news/{id}`

Displays full article with:
- Breadcrumb navigation
- Article title and metadata
- Full article content
- Share buttons
- Related articles section
- Navigation back to news list

## 🔌 API Integration

The news system connects to the backend API at `http://localhost:5000`:

**Endpoints used:**
- `GET /api/news` - Fetch all news articles
- `GET /api/news/{id}` - Fetch single article by ID

## 🎯 Usage Examples

### Fetch news in a component
```tsx
import { NewsList } from "@/components/news-list";

export function MyComponent() {
  return <NewsList locale="en" />;
}
```

### Fetch and use news data directly
```tsx
const response = await fetch("http://localhost:5000/api/news");
const data = await response.json();
const articles = data.news;
```

### Format dates in components
```tsx
import { formatDate, timeAgo } from "@/lib/utils";

const formattedDate = formatDate(article.created_at); // "May 26, 2026, 10:30 AM"
const relativeTime = timeAgo(article.created_at);     // "2d ago"
```

## 🎨 Styling

The news components use Tailwind CSS with custom dark theme variables:

**Color scheme:**
- Background: `#0f1117`
- Foreground: `#e6edf3`
- Accent: Blue and Cyan gradients
- Surface: Semi-transparent grays

## 📱 Responsive Design

All components are fully responsive:
- **Mobile:** Single column grid, stacked layout
- **Tablet:** 2 column grid
- **Desktop:** 3 column grid

## 🔍 Search & Filter Features

### Search
- Searches article titles and content
- Real-time filtering as you type
- Clear search button to reset

### Sorting
- **Newest First** - Most recent articles first
- **Oldest First** - Chronological order
- **By Title** - Alphabetical order

## ⚡ Performance

- Metadata generation for SEO
- Static params generation for known routes
- Revalidation set to 1 hour for detail pages
- Efficient client-side rendering with React hooks

## 🚀 Getting Started

1. **Load test data:**
   ```bash
   curl -X POST http://localhost:5000/api/news/seed/test-data
   ```

2. **Navigate to news page:**
   - Visit `http://localhost:3000/en/news`
   - Click "News" in the header navigation

3. **Search and explore:**
   - Use the search box to find articles
   - Click on any article to read the full content
   - View related articles

## 🐛 Troubleshooting

### News not loading
- Ensure the backend server is running on `http://localhost:5000`
- Check browser console for error messages
- Verify the API endpoint `/api/news` is accessible

### Images not loading
- News content is text-based (no image support yet)
- Content is displayed as plain text with formatting

### Related articles not showing
- Need at least 4 articles in the database
- Related articles are filtered from the same database

## 🔄 Data Flow

```
User clicks "News" link
  ↓
Navigates to /{locale}/news
  ↓
NewsList component loads
  ↓
Fetches from /api/news
  ↓
Displays articles in grid
  ↓
User clicks article
  ↓
Navigates to /{locale}/news/{id}
  ↓
Fetches single article data
  ↓
Displays full article with metadata
```

## 📚 Related Files

- [Backend News API Documentation](../backend/README.md)
- [Backend Test Data](../backend/data/test_news.py)
- [News API Endpoints](../backend/README.md#api-endpoints)

## 🎯 Future Enhancements

Potential features to add:
- Image support for articles
- Author information
- Category/Tags system
- Comments section
- Like/Vote feature
- Email subscription
- RSS feed
- Markdown content support
- Reading time estimate
- Print functionality

---

**Last updated:** May 26, 2026
