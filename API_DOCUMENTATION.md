# D&D 5e API Documentation

This API serves D&D 5e data from a MongoDB Atlas database containing both 2014 and 2024 SRD content.

## Base URL

```
https://your-api-domain.com
```

## Authentication

Currently, no authentication is required for accessing the API.

## Rate Limiting

- 50 requests per second per IP address
- Rate limit headers are included in responses

## Health Checks

### Basic Health Check

```http
GET /health
```

Returns basic API and database status.

### Detailed Health Check

```http
GET /health/detailed
```

Returns detailed information including collection counts and memory usage.

## Collections

### Get Available Collections

```http
GET /api/collections
```

Returns all available collections for both 2014 and 2024 versions.

**Response:**

```json
{
  "2014": {
    "count": 25,
    "collections": ["ability-scores", "alignments", "backgrounds", ...]
  },
  "2024": {
    "count": 9,
    "collections": ["ability-scores", "alignments", "conditions", ...]
  }
}
```

## Data Endpoints

### Get All Items in a Collection

```http
GET /api/{version}/{collection}
```

**Parameters:**

- `version`: `2014` or `2024`
- `collection`: Collection name (e.g., `spells`, `monsters`, `classes`)

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `search`: Search term for name field
- `sort`: Field to sort by (default: `name`)
- `order`: Sort order - `asc` or `desc` (default: `asc`)
- Additional filters based on collection fields

**Examples:**

```http
GET /api/2014/spells
GET /api/2014/spells?level=3
GET /api/2014/spells?search=fireball&page=1&limit=10
GET /api/2024/ability-scores
```

**Response:**

```json
{
  "count": 20,
  "total": 319,
  "page": 1,
  "total_pages": 16,
  "results": [
    {
      "index": "fireball",
      "name": "Fireball",
      "url": "/api/2014/spells/fireball"
    }
  ]
}
```

### Get Specific Item

```http
GET /api/{version}/{collection}/{index}
```

**Parameters:**

- `version`: `2014` or `2024`
- `collection`: Collection name
- `index`: Item index or ID

**Examples:**

```http
GET /api/2014/spells/fireball
GET /api/2014/monsters/dragon
GET /api/2024/ability-scores/str
```

**Response:**

```json
{
  "_id": "...",
  "index": "fireball",
  "name": "Fireball",
  "level": 3,
  "school": {
    "index": "evocation",
    "name": "Evocation",
    "url": "/api/2014/magic-schools/evocation"
  },
  "casting_time": "1 action",
  "range": "150 feet",
  "components": ["V", "S", "M"],
  "duration": "Instantaneous",
  "desc": ["A bright streak flashes from your pointing finger..."],
  "higher_level": ["When you cast this spell using a spell slot..."],
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Search

### Search Across Collections

```http
GET /api/search?q={query}&collections={collections}&version={version}
```

**Parameters:**

- `q`: Search query (required)
- `collections`: Comma-separated list of collections to search (optional)
- `version`: `2014` or `2024` (default: `2014`)

**Examples:**

```http
GET /api/search?q=dragon
GET /api/search?q=fire&collections=spells,monsters&version=2014
GET /api/search?q=strength&version=2024
```

**Response:**

```json
{
  "query": "dragon",
  "count": 15,
  "results": [
    {
      "_id": "...",
      "index": "dragon",
      "name": "Dragon",
      "collection": "monsters",
      "version": "2014"
    }
  ]
}
```

## Legacy Support

The API maintains backward compatibility with legacy routes:

```http
GET /api/spells          # Redirects to /api/2014/spells
GET /api/spells/fireball # Redirects to /api/2014/spells/fireball
```

## Available Collections

### 2014 SRD Collections (25 total)

- `ability-scores` - Ability score definitions
- `alignments` - Character alignments
- `backgrounds` - Character backgrounds
- `classes` - Character classes
- `conditions` - Game conditions
- `damage-types` - Types of damage
- `equipment` - Equipment and items
- `equipment-categories` - Equipment categories
- `feats` - Character feats
- `features` - Class and race features
- `languages` - Available languages
- `magic-items` - Magical items
- `magic-schools` - Schools of magic
- `monsters` - Monster stat blocks
- `proficiencies` - Skill proficiencies
- `races` - Character races
- `rules` - Game rules
- `rule-sections` - Rule sections
- `skills` - Skills
- `spells` - Spells
- `subclasses` - Character subclasses
- `subraces` - Race subraces
- `traits` - Racial and class traits
- `weapon-properties` - Weapon properties
- `levels` - Class levels

### 2024 SRD Collections (9 total)

- `ability-scores` - Ability score definitions
- `alignments` - Character alignments
- `conditions` - Game conditions
- `damage-types` - Types of damage
- `languages` - Available languages
- `magic-schools` - Schools of magic
- `skills` - Skills
- `weapon-mastery-properties` - Weapon mastery properties
- `weapon-properties` - Weapon properties

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid query parameters",
  "details": [...]
}
```

### 404 Not Found

```json
{
  "error": "Collection 'invalid-collection' not found"
}
```

### 429 Too Many Requests

```json
{
  "error": "Rate limit exceeded, try again later."
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

## Caching

Responses are cached in Redis for:

- Collection lists: 5 minutes
- Individual items: 10 minutes
- Search results: 5 minutes

## Examples

### Get all 3rd level spells

```http
GET /api/2014/spells?level=3
```

### Search for monsters with "dragon" in the name

```http
GET /api/2014/monsters?search=dragon
```

### Get a specific spell

```http
GET /api/2014/spells/fireball
```

### Search across multiple collections

```http
GET /api/search?q=fire&collections=spells,monsters
```

### Get 2024 ability scores

```http
GET /api/2024/ability-scores
```

## Development

### Environment Variables

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/5e-database
PORT=3000
REDIS_URL=redis://localhost:6379
```

### Running Locally

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:3000`
