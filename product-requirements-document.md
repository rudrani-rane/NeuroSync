**Product Requirements Document (PRD)**

**AI-Powered Second Brain Platform**

**Version:** 1.0\
**Date:** January 31, 2026\
**Status:** Draft\
**Document Owner:** Product Team

-----
**Executive Summary**

**Product Vision**

We are building a digital cognitive system that functions as an extension of human memory and reasoning. The Second Brain Platform transforms how individuals and organizations capture, understand, organize, and recall knowledge by automatically structuring information into a living knowledge graph powered by AI.

**Market Opportunity**

Knowledge workers spend an average of 2.5 hours per day searching for information they've already encountered. Organizations lose critical institutional knowledge when employees leave. Current tools require manual organization and provide poor semantic search capabilities.

**Success Metrics**

- **User Engagement:** Daily active users, memories ingested per user
- **System Performance:** Query response time <2s, ingestion processing time <30s
- **User Satisfaction:** NPS >40, search success rate >85%
- **Business Metrics:** User retention >70% at 6 months, enterprise adoption >5 teams/org
-----
**Product Overview**

**What We're Building**

A personal and organizational knowledge system that:

1. Automatically captures information from multiple sources
1. Understands semantic meaning using NLP and embeddings
1. Structures knowledge as an interconnected graph
1. Enables intelligent retrieval through natural language
1. Provides reasoning capabilities over stored knowledge
1. Maintains security and governance for enterprise use

**What Makes This Different**

Unlike Notion, Evernote, or Obsidian:

- **Zero manual organization** - No tagging, filing, or linking required
- **True semantic understanding** - Not just keyword search
- **Living knowledge graph** - Relationships evolve automatically
- **Multi-modal intelligence** - Text, audio, images, video, URLs
- **Reasoning layer** - System can answer questions, not just retrieve
- **Enterprise-grade governance** - Shared brains with granular permissions
-----
**Target Users**

**Primary Personas**

**1. Knowledge Worker (Sarah)**

- **Role:** Product Manager at tech company
- **Pain Points:** 
  - Meeting notes scattered across tools
  - Can't remember decisions made 3 months ago
  - Loses context when switching projects
- **Goals:** Quick recall, context preservation, better decisions
- **Use Cases:** Meeting notes, product research, competitive analysis

**2. Software Engineer (David)**

- **Role:** Senior Engineer
- **Pain Points:** 
  - Technical decisions not documented
  - Onboarding takes months
  - Code knowledge trapped in heads
- **Goals:** Technical documentation, code explanations, architecture decisions
- **Use Cases:** Architecture docs, bug investigations, API research

**3. Researcher (Dr. Maria)**

- **Role:** Academic Researcher
- **Pain Points:** 
  - Papers scattered across folders
  - Can't track citation relationships
  - Loses research threads
- **Goals:** Literature management, hypothesis tracking, insight generation
- **Use Cases:** Paper summaries, research connections, grant writing

**4. Enterprise Admin (James)**

- **Role:** IT Administrator
- **Pain Points:** 
  - No visibility into team knowledge usage
  - Compliance concerns
  - Knowledge silos across departments
- **Goals:** Governance, security, usage monitoring
- **Use Cases:** Permission management, audit logs, compliance reporting

**User Segmentation**

|**Segment**|**Size**|**Priority**|**Monetization**|
| :- | :- | :- | :- |
|Individual Pro|Large|P0|$15-30/mo|
|Small Teams (5-20)|Medium|P1|$25/user/mo|
|Enterprise (100+)|Small|P0|Custom pricing|
|Students/Academic|Large|P2|Freemium|

-----
**Problem Statement**

**Current State Problems**

**1. Information Fragmentation**

**Problem:** Knowledge scattered across 10+ tools\
**Impact:** 2.5 hours/day wasted searching\
**Cost:** $15,000/year per knowledge worker in lost productivity

**2. Context Loss & Forgetting**

**Problem:** Details fade, context disappears\
**Impact:** Repeated work, poor decisions\
**Cost:** Unable to build on past insights

**3. Manual Organization Burden**

**Problem:** Requires constant tagging, linking, categorizing\
**Impact:** 30 minutes/day on organization\
**Cost:** Organization becomes unreliable, people skip it

**4. Poor Search Experience**

**Problem:** Keyword search requires exact wording\
**Impact:** 40% search failure rate\
**Cost:** Information effectively lost even when stored

**5. Organizational Memory Loss**

**Problem:** Knowledge walks out the door with employees\
**Impact:** 6-12 month productivity loss on departures\
**Cost:** Millions in institutional knowledge loss

**6. No Reasoning Capability**

**Problem:** Tools store but don't think\
**Impact:** No synthesis, contradiction detection, or insight generation\
**Cost:** Missed opportunities, strategic blindspots

-----
**Product Goals & Success Criteria**

**Product Goals**

**Primary Goals (Must Achieve)**

1. **Zero-friction capture** - Ingestion takes <10 seconds for any modality
1. **Automatic structuring** - 0% manual tagging required
1. **Reliable recall** - >85% search success rate
1. **Explainable answers** - Every answer shows source path
1. **Enterprise governance** - Full audit trail, granular permissions

**Secondary Goals (Nice to Have)**

1. **Proactive insights** - System suggests connections weekly
1. **Multi-user collaboration** - Teams build shared knowledge
1. **Cross-brain reasoning** - Connect personal + organizational knowledge

**Success Metrics**

**User Engagement Metrics**

- Daily Active Users (DAU): Target 70% of registered users
- Memories ingested per user per day: Target 5+
- Queries per user per day: Target 10+
- Time to first memory: <5 minutes after signup
- Feature adoption rate: >60% use 3+ ingestion modalities

**System Performance Metrics**

- Ingestion processing time: <30 seconds (p95)
- Query response time: <2 seconds (p95)
- Graph query time: <1 second (p95)
- Vector search latency: <500ms (p95)
- System uptime: >99.9%

**Quality Metrics**

- Entity extraction accuracy: >85%
- Relationship inference precision: >75%
- Search relevance score (nDCG): >0.8
- User-reported search success rate: >85%
- Answer citation accuracy: >95%

**Business Metrics**

- User retention: >70% at 6 months
- Net Promoter Score: >40
- Enterprise adoption: >5 teams per organization
- Time to value: <1 week
- Monthly recurring revenue growth: >20% MoM
-----
**Core Features (Must-Have)**

**1. Multi-Modal Knowledge Ingestion**

**1.1 Text Input (Manual Writing)**

**Description:**\
Users can create memories by typing directly into a rich text editor.

**Functional Requirements:**

- Rich text editor supporting: 
  - Bold, italic, underline
  - Headings (H1-H6)
  - Bullet and numbered lists
  - Code blocks with syntax highlighting
  - Links and images
- Markdown input mode
- Auto-save every 5 seconds
- Optional user-provided summary field
- Optional user-provided tags (system suggests tags)
- Character limit: 50,000 characters per memory

**System Processing:**

1. Text normalization (remove excess whitespace, fix encoding)
1. Language detection
1. Intelligent chunking (paragraph-based, max 512 tokens per chunk)
1. Entity extraction (people, places, organizations, dates, technologies)
1. Topic classification (multi-label, confidence scores)
1. Embedding generation (each chunk vectorized)
1. Graph node creation
1. Relationship inference with existing nodes

**User Experience:**

- Clean, distraction-free interface
- Real-time save indicator
- Processing status bar showing: "Extracting entities... Generating embeddings... Done ✓"
- Processing time: <10 seconds for 2000-word document

**Technical Specifications:**

- Editor: Quill.js or Tiptap
- API endpoint: POST /api/v1/memories/text
- Response: Memory ID, processing status
-----
**1.2 File Upload (Documents)**

**Description:**\
Users upload documents that are automatically parsed, structured, and integrated.

**Functional Requirements:**

- Supported formats: 
  - PDF (native and scanned with OCR)
  - DOCX, DOC
  - TXT
  - Markdown (.md)
  - PPTX (Phase 2)
- Drag-and-drop interface
- Batch upload (up to 10 files)
- File size limit: 50MB per file
- Progress indicator during upload and processing

**System Processing:**

**For PDF:**

1. Extract text using PyPDF2 or pdfplumber
1. If scanned (no text layer), run Tesseract OCR
1. Preserve document structure (headings, sections)
1. Extract metadata (title, author, creation date)
1. Chunk by section/paragraph
1. Extract entities and topics per chunk
1. Generate embeddings
1. Create document node + chunk nodes
1. Link chunks to document

**For DOCX:**

1. Extract text using python-docx
1. Preserve formatting markers (headings, lists, tables)
1. Extract tables as structured data
1. Process per chunk
1. Generate embeddings
1. Create graph nodes

**For TXT/MD:**

1. Parse as plain text
1. Detect markdown structure
1. Chunk and process
1. Generate embeddings
1. Create nodes

**User Experience:**

- Upload modal with drag-and-drop zone
- File preview before processing
- Processing queue with status per file
- Notification on completion
- Error handling: "Could not extract text from file, try converting to PDF first"

**Technical Specifications:**

- API endpoint: POST /api/v1/memories/upload
- Storage: S3-compatible object storage
- Processing pipeline: Celery task queue
- Expected processing time: 1 page per 2 seconds
-----
**1.3 Audio Recording → Transcription**

**Description:**\
Users record audio directly in the app or upload audio files for automatic transcription and processing.

**Functional Requirements:**

- In-app recorder 
  - Record/pause/stop controls
  - Waveform visualization
  - Recording time limit: 2 hours
  - Formats: WAV, MP3
- Audio file upload 
  - Supported formats: MP3, WAV, M4A, OGG
  - File size limit: 500MB
- Optional: Speaker diarization (identify different speakers)

**System Processing:**

1. Audio upload to storage
1. Transcription using Whisper (medium or large model)
1. Language detection
1. Generate: 
   1. Raw transcript (timestamped)
   1. Cleaned transcript (punctuated, formatted)
   1. Summary (200-300 words)
1. Extract entities, topics, action items
1. Create memory blocks: 
   1. Audio file reference
   1. Full transcript
   1. Summary
   1. Entities/topics
1. Generate embeddings
1. Create graph nodes

**User Experience:**

- Clean recording interface
- Real-time recording duration
- "Processing audio..." status with estimated time
- Editable transcript view
- Highlight action items automatically
- Export transcript as TXT/PDF

**Quality Requirements:**

- Transcription accuracy: >90% for clear audio
- Processing time: 1 minute of audio in ~10 seconds
- Language support: English, Spanish, French, German, Mandarin (Phase 1)

**Technical Specifications:**

- Transcription: OpenAI Whisper API or self-hosted
- API endpoint: POST /api/v1/memories/audio
- Storage: Audio files stored with memory reference
-----
**1.4 Image Upload → Visual Understanding**

**Description:**\
Users upload images (photos, screenshots, diagrams, whiteboards) for automatic visual analysis and text extraction.

**Functional Requirements:**

- Supported formats: JPG, PNG, WEBP, GIF
- File size limit: 25MB per image
- Batch upload (up to 5 images)
- In-app image preview
- Optional user-provided caption

**System Processing:**

1. Image upload to storage
1. Run vision model (GPT-4V, Claude Vision, or LLaVA): 
   1. Generate detailed description
   1. Identify objects, people, scenes
   1. Extract any visible text (OCR)
   1. Identify diagram type (flowchart, mindmap, etc.)
1. Run dedicated OCR (Tesseract) for text extraction
1. Generate summary
1. Extract entities and topics from description
1. Create memory node linking: 
   1. Image file reference
   1. Description
   1. OCR text
   1. Summary
1. Generate embeddings from description + OCR text
1. Create graph nodes

**User Experience:**

- Drag-and-drop image upload
- Image preview with zoom
- "Analyzing image..." progress indicator
- Editable description field (user can override AI)
- Show extracted text separately
- Option to re-run analysis with different model

**Use Cases:**

- Whiteboard photos from meetings
- Screenshots of code/errors
- Diagrams from papers
- Receipts and invoices
- Infographics

**Technical Specifications:**

- Vision model: GPT-4V API or self-hosted LLaVA
- OCR: Tesseract or Google Cloud Vision
- API endpoint: POST /api/v1/memories/image
- Processing time: 5-10 seconds per image
-----
**1.5 YouTube / Video URL Ingestion**

**Description:**\
Users paste a YouTube or video URL to automatically extract, transcribe, and process video content.

**Functional Requirements:**

- Input field for URL
- Supported platforms: 
  - YouTube
  - Vimeo
  - Direct video file URLs
- Fetch video metadata (title, author, publish date)
- Download captions if available
- Transcribe if captions unavailable

**System Processing:**

1. Parse URL and validate
1. Fetch video metadata using yt-dlp
1. Check for captions: 
   1. If available: Download and parse
   1. If not: Download audio, run Whisper transcription
1. Generate: 
   1. Full transcript (timestamped)
   1. Summary (300-500 words)
   1. Key topics
1. Extract entities, topics, quotes
1. Create memory node: 
   1. Video URL
   1. Metadata (title, author, date)
   1. Transcript
   1. Summary
1. Generate embeddings
1. Create graph nodes

**User Experience:**

- Paste URL → "Fetching video..." → "Transcribing..." → "Done ✓"
- Show video thumbnail
- Editable transcript with timestamps
- Click timestamp to jump to video moment (iframe embed)
- Export transcript as SRT or TXT

**Quality Requirements:**

- Caption accuracy: 100% (native captions)
- Transcription accuracy: >90% (Whisper)
- Processing time: 1 minute of video in ~15 seconds

**Technical Specifications:**

- Video download: yt-dlp library
- Transcription: Whisper
- API endpoint: POST /api/v1/memories/video-url
- Storage: Store transcript, not video file (too large)
-----
**1.6 Website / Blog URL Ingestion**

**Description:**\
Users paste a webpage URL to extract, summarize, and structure article content.

**Functional Requirements:**

- Input field for URL
- Extract main article content (remove ads, nav, footer)
- Fetch metadata (title, author, publish date)
- Handle paywalls gracefully (inform user if blocked)

**System Processing:**

1. Fetch URL using requests/httpx
1. Parse HTML with BeautifulSoup or Trafilatura
1. Extract: 
   1. Main article text
   1. Title
   1. Author
   1. Publish date
   1. Meta description
1. Clean text (remove boilerplate)
1. Generate summary (200-400 words)
1. Extract entities, topics, key quotes
1. Create memory node: 
   1. URL
   1. Metadata
   1. Article text
   1. Summary
1. Generate embeddings
1. Create graph nodes

**User Experience:**

- Paste URL → "Fetching article..." → "Summarizing..." → "Done ✓"
- Show article preview with title and image
- Editable extracted text
- "Read original" link
- Save to multiple brains

**Edge Cases:**

- Paywall detection: Show message "This article is behind a paywall. Please paste the text manually."
- JavaScript-heavy sites: Use Playwright for rendering
- 404/403 errors: Inform user clearly

**Technical Specifications:**

- Article extraction: Trafilatura or newspaper3k
- API endpoint: POST /api/v1/memories/web-url
- Processing time: 5-10 seconds per article
- Rate limiting: 10 URLs per minute per user
-----
**1.7 Brain Scope Selector (Mandatory)**

**Description:**\
Before finalizing any ingestion, users must select which brain(s) to save the memory to.

**Functional Requirements:**

- Dropdown or modal selector
- Available options: 
  - **Personal Brain** (always available)
  - **Shared Brains** (user has access to): 
    - HR Brain
    - Finance Brain
    - Engineering Brain
    - Legal Brain
    - Supply Chain Brain
    - Marketing Brain
    - etc.
- Multi-select capability (save to multiple brains)
- Default: Personal Brain pre-selected
- Required field (cannot skip)

**System Behavior:**

1. User selects brain scope(s)
1. Memory is ingested and processed
1. Graph nodes created in: 
   1. User's personal graph database
   1. Selected shared brain graph database(s)
1. Relationships created within each graph
1. Access control applied based on brain permissions

**User Experience:**

- Brain selector appears before "Save" or "Ingest"
- Show brain icons with names
- If user lacks permission: Show grayed out with lock icon
- Confirmation: "Memory saved to Personal Brain and Engineering Brain ✓"

**Security:**

- Validate user has write access to selected brains
- Prevent injection into brains without permission
- Audit log records which brains received memory

**Technical Specifications:**

- Brain scope stored in memory metadata
- API validates permissions before write
- Multi-graph write operation (atomic transaction preferred)
-----
**1.8 Automatic Knowledge Structuring (Always On)**

**Description:**\
Every ingestion automatically runs NLP pipelines to structure knowledge without user intervention.

**Processing Pipeline:**

**Step 1: Entity Extraction**

- Named Entity Recognition (NER) using spaCy or transformers
- Extract: 
  - People (PERSON)
  - Organizations (ORG)
  - Locations (GPE, LOC)
  - Dates/Times (DATE, TIME)
  - Technologies/Products (custom trained)
  - Events (custom)
  - Monetary values (MONEY)
- Confidence scoring (0-1)
- Entity linking to existing nodes

**Step 2: Topic Classification**

- Multi-label classification using BERT-based model
- Topics: 
  - Engineering, Product, Marketing, Sales, Finance, Legal, HR, Operations, Strategy, Research
  - Custom: User organization can define topics
- Top-5 topics with confidence scores
- Topic hierarchy support (e.g., Engineering > Backend > Databases)

**Step 3: Relationship Inference**

- Detect relationships between entities: 
  - Works\_At, Reports\_To, Located\_In, Created\_By, Mentions
  - Related\_To, Depends\_On, Contradicts
- Use dependency parsing and rule-based patterns
- Confidence scoring
- Temporal relationships (before, after, during)

**Step 4: Embedding Generation**

- Chunk text into semantic units (max 512 tokens)
- Generate embeddings using: 
  - Sentence-transformers (all-MiniLM-L6-v2 or better)
  - OpenAI text-embedding-3-large (optional)
- Store embeddings in vector database (Pinecone, Weaviate, or Qdrant)

**Step 5: Confidence Scoring**

- Each extracted fact gets confidence score (0-1)
- Based on: 
  - Model prediction probability
  - Entity disambiguation success
  - Relationship evidence strength
- Low-confidence facts flagged for user review

**Step 6: Source Attribution**

- Every fact links back to source memory
- Character offset positions stored
- Quote extraction for verification

**Quality Requirements:**

- Entity extraction precision: >85%
- Entity extraction recall: >75%
- Topic classification accuracy: >80%
- Relationship precision: >75%
- Processing time: <30 seconds for 5000-word document

**Technical Specifications:**

- NLP models: spaCy, transformers (Hugging Face)
- Embeddings: sentence-transformers
- Graph write: Neo4j Cypher queries
- Vector write: Batch upsert to vector DB
-----
**1.9 Logging & Audit Trail (Mandatory)**

**Description:**\
Every ingestion creates a complete audit log for transparency, debugging, and compliance.

**Log Entry Schema:**

{

`  `"log\_id": "uuid",

`  `"user\_id": "uuid",

`  `"timestamp": "ISO 8601",

`  `"source\_type": "text|file|audio|image|video\_url|web\_url",

`  `"memory\_id": "uuid",

`  `"brain\_scopes": ["personal", "engineering"],

`  `"raw\_input": {

`    `"file\_path": "s3://...",

`    `"url": "https://...",

`    `"text\_preview": "first 500 chars"

`  `},

`  `"processing\_outputs": {

`    `"entities\_extracted": 23,

`    `"topics\_assigned": ["engineering", "databases"],

`    `"relationships\_created": 15,

`    `"chunks\_generated": 8,

`    `"embeddings\_generated": 8

`  `},

`  `"processing\_time\_ms": 12450,

`  `"status": "success|failed|partial",

`  `"error\_message": null,

`  `"confidence\_scores": {

`    `"avg\_entity\_confidence": 0.87,

`    `"avg\_topic\_confidence": 0.92

`  `}

}

**Functional Requirements:**

- Log stored in relational database (Postgres)
- Indexed by user\_id, timestamp, memory\_id
- Viewable by: 
  - User (own logs)
  - Admin (all logs)
- Retention: 2 years
- Export capability (CSV, JSON)

**User-Facing Log Viewer:**

- Timeline view of all ingestions
- Filter by date range, source type, brain scope
- Click to see processing details
- Reprocess option (re-run NLP pipeline)

**Admin-Facing Log Viewer:**

- All users' logs
- Filter by user, organization, brain
- System health metrics
- Error rate monitoring

**Compliance:**

- GDPR: User can request deletion of logs
- SOC 2: Complete audit trail
- HIPAA (future): Encrypted logs

**Technical Specifications:**

- Database: Postgres table ingestion\_logs
- API endpoints: 
  - GET /api/v1/logs/user/{user\_id}
  - GET /api/v1/logs/memory/{memory\_id}
  - GET /api/v1/admin/logs
-----
**2. Automatic Processing Pipeline**

**Description:**\
Standardized processing pipeline that all ingestion modalities flow through.

**Pipeline Stages:**

**Stage 1: Input Validation**

- File type verification
- Size limits
- Malware scanning
- Format validation

**Stage 2: Content Extraction**

- Modality-specific extraction (see 1.2-1.6)
- Encoding normalization (UTF-8)
- Language detection

**Stage 3: Text Cleaning**

- Remove excessive whitespace
- Fix line breaks
- Remove HTML tags (from web content)
- Normalize Unicode characters
- Spell check (optional, flagged mode)

**Stage 4: Chunking**

- Break into semantic units
- Methods: 
  - Paragraph-based (default)
  - Sentence-based (for short content)
  - Sliding window (512 tokens, 50 token overlap)
- Preserve context boundaries
- Maximum chunk size: 512 tokens

**Stage 5: NLP Processing**

- Entity extraction (see 1.8)
- Topic classification
- Sentiment analysis (optional)
- Keyword extraction
- Summarization

**Stage 6: Embedding Generation**

- Generate embeddings per chunk
- Model: sentence-transformers/all-mpnet-base-v2 or OpenAI
- Dimensionality: 768 or 1536
- Normalization

**Stage 7: Graph Storage**

- Create memory node
- Create entity nodes (or link existing)
- Create topic nodes
- Create relationships
- Store metadata

**Stage 8: Vector Storage**

- Upsert embeddings to vector DB
- Metadata: memory\_id, chunk\_id, brain\_scope
- Indexing for fast retrieval

**Stage 9: Notification**

- User notification: "Memory processed ✓"
- Error notification if failed
- Processing summary email (weekly digest)

**Error Handling:**

- Graceful degradation (partial processing if some stages fail)
- Retry mechanism (3 attempts with exponential backoff)
- Error logs with stack traces
- User notification on failure

**Performance:**

- Pipeline throughput: 100 memories/minute
- Average processing time: <30 seconds per memory
- Parallel processing: 10 concurrent pipelines

**Technical Stack:**

- Task queue: Celery with Redis
- Worker scaling: Auto-scale based on queue depth
- Monitoring: Prometheus + Grafana
-----
**3. Knowledge Graph Storage**

**Description:**\
Neo4j-based knowledge graph storing all memories, entities, relationships, and metadata.

**Node Types:**

**1. Memory Node**

(:Memory {

`  `id: "uuid",

`  `user\_id: "uuid",

`  `brain\_scopes: ["personal", "engineering"],

`  `title: "Meeting notes with Sarah",

`  `content: "full text",

`  `summary: "auto-generated summary",

`  `source\_type: "text|file|audio|image|video\_url|web\_url",

`  `source\_reference: "s3://...",

`  `created\_at: timestamp,

`  `updated\_at: timestamp,

`  `embedding\_ids: ["vec\_1", "vec\_2"],

`  `confidence\_score: 0.87

})

**2. Entity Node**

(:Entity {

`  `id: "uuid",

`  `name: "Sarah Johnson",

`  `type: "PERSON|ORG|GPE|TECHNOLOGY|EVENT",

`  `canonical\_name: "Sarah Johnson",

`  `aliases: ["Sarah", "S. Johnson"],

`  `description: "Product Manager at Acme Inc",

`  `first\_mentioned: timestamp,

`  `mention\_count: 15,

`  `confidence\_score: 0.92

})

**3. Topic Node**

(:Topic {

`  `id: "uuid",

`  `name: "Machine Learning",

`  `parent\_topic: "Engineering",

`  `description: "AI and ML related content",

`  `memory\_count: 234

})

**4. Chunk Node**

(:Chunk {

`  `id: "uuid",

`  `memory\_id: "uuid",

`  `text: "chunk text",

`  `position: 0,

`  `embedding\_id: "vec\_1",

`  `confidence\_score: 0.85

})

**Relationship Types:**

**Memory Relationships**

- (:Memory)-[:HAS\_CHUNK]->(:Chunk) - Memory contains chunks
- (:Memory)-[:MENTIONS]->(:Entity) - Memory mentions entity
- (:Memory)-[:ABOUT]->(:Topic) - Memory is about topic
- (:Memory)-[:RELATED\_TO]->(:Memory) - Memories are semantically related
- (:Memory)-[:CREATED\_BY]->(:User) - Memory created by user

**Entity Relationships**

- (:Entity)-[:WORKS\_AT]->(:Entity) - Person works at organization
- (:Entity)-[:LOCATED\_IN]->(:Entity) - Entity located in place
- (:Entity)-[:RELATED\_TO]->(:Entity) - Entities are related
- (:Entity)-[:MENTIONED\_WITH]->(:Entity) - Co-occurrence relationship

**Topic Relationships**

- (:Topic)-[:PARENT\_OF]->(:Topic) - Topic hierarchy
- (:Topic)-[:RELATED\_TO]->(:Topic) - Related topics

**Graph Schema Constraints:**

- Unique constraint on Memory.id
- Unique constraint on Entity.canonical\_name
- Index on Memory.user\_id
- Index on Memory.brain\_scopes
- Index on Entity.type
- Index on Memory.created\_at

**Graph Queries (Examples):**

Find all memories mentioning a person:

MATCH (m:Memory)-[:MENTIONS]->(e:Entity {name: "Sarah Johnson"})

WHERE "personal" IN m.brain\_scopes

RETURN m

ORDER BY m.created\_at DESC

Find related memories:

MATCH (m1:Memory {id: $memory\_id})-[:RELATED\_TO]-(m2:Memory)

RETURN m2

ORDER BY m2.confidence\_score DESC

LIMIT 10

Find entity relationships:

MATCH (e1:Entity {name: "Sarah Johnson"})-[r]-(e2:Entity)

RETURN e1, r, e2

**Performance Requirements:**

- Query latency: <1 second for graph traversal
- Write latency: <500ms for node creation
- Database size: Support 10M+ nodes
- Concurrent connections: 100+

**Backup & Recovery:**

- Daily automated backups
- Point-in-time recovery
- Backup retention: 30 days

**Technical Specifications:**

- Database: Neo4j Enterprise
- Deployment: Kubernetes cluster
- Replication: 3 replicas
- Monitoring: Neo4j Ops Manager
-----
**4. Vector Search**

**Description:**\
Semantic similarity search using embeddings for intelligent information retrieval.

**Vector Database:**

- Options: Pinecone, Weaviate, Qdrant, or pgvector (Postgres extension)
- Embedding dimensions: 768 or 1536
- Distance metric: Cosine similarity
- Index type: HNSW (Hierarchical Navigable Small World)

**Vector Storage Schema:**

{

`  `"id": "vec\_uuid",

`  `"memory\_id": "memory\_uuid",

`  `"chunk\_id": "chunk\_uuid",

`  `"embedding": [0.123, 0.456, ...],

`  `"metadata": {

`    `"user\_id": "uuid",

`    `"brain\_scopes": ["personal", "engineering"],

`    `"source\_type": "text",

`    `"created\_at": "timestamp",

`    `"title": "snippet",

`    `"text\_preview": "first 200 chars"

`  `}

}

**Search Flow:**

1. User query: "machine learning papers I saved last month"
1. Query embedding generated
1. Vector similarity search: 
1. results = vector\_db.search(    query\_embedding=query\_vec,    filter={        "user\_id": user\_id,        "brain\_scopes": {"$in": ["personal", "engineering"]},        "created\_at": {"$gte": last\_month}    },    top\_k=20,    min\_similarity=0.7)
1. Results ranked by similarity score
1. Enrich with graph context (fetch memory nodes from Neo4j)
1. Re-rank using hybrid score (vector + graph + recency)

**Hybrid Search (Vector + Graph):**

- Stage 1: Vector search (top 100 candidates)
- Stage 2: Graph expansion (find related memories via relationships)
- Stage 3: Re-ranking: 
  - Vector similarity: 40% weight
  - Graph centrality: 30% weight
  - Recency: 20% weight
  - User engagement: 10% weight

**Filter Capabilities:**

- Brain scope filtering
- Date range filtering
- Source type filtering
- Entity filtering (memories mentioning specific entities)
- Topic filtering

**Performance Requirements:**

- Search latency: <500ms (p95)
- Throughput: 1000 queries/second
- Index build time: <10 minutes for 1M vectors
- Recall@10: >0.95

**Technical Specifications:**

- Vector DB: Pinecone (managed) or self-hosted Qdrant
- Embedding model: sentence-transformers or OpenAI
- API endpoint: POST /api/v1/search/vector
- Caching: Redis for frequent queries
-----
**5. Chatbot (RAG - Retrieval Augmented Generation)**

**Description:**\
Natural language question answering powered by RAG over the knowledge graph and vector database.

**Functional Requirements:**

- Chat interface with conversation history
- Ask questions in natural language
- Receive answers with citations
- Follow-up questions in context
- Export conversation as PDF/TXT

**RAG Pipeline:**

**Step 1: Query Understanding**

- Intent classification: question, command, exploration
- Entity extraction from query
- Query expansion (synonyms, related terms)
- Query rewriting for better retrieval

**Step 2: Retrieval**

- Vector search (top 20 results)
- Graph traversal from query entities
- Hybrid re-ranking
- Filter by brain scope permissions

**Step 3: Context Assembly**

- Retrieve top 10 memory chunks
- Fetch related entities and relationships
- Assemble context window (max 8000 tokens)
- Deduplication

**Step 4: Answer Generation**

- LLM prompt: 
- You are a helpful assistant with access to the user's second brain.Answer the question using only the provided context.Cite your sources using [Memory Title].If the answer is not in the context, say "I don't have information about that in your brain."Context:{retrieved\_chunks}Question: {user\_question}Answer:
- Model: GPT-4, Claude, or Llama 3 70B
- Temperature: 0.2 (for factual answers)
- Max tokens: 1000

**Step 5: Citation Extraction**

- Parse LLM response for citations
- Link citations to memory IDs
- Provide clickable links to source memories

**Step 6: Confidence Scoring**

- Assess answer confidence based on: 
  - Retrieval scores
  - Number of supporting memories
  - Entity overlap
- Display confidence: High / Medium / Low

**Example Interactions:**

**Q:** "What did Sarah say about the Q3 roadmap?"\
**A:** According to your meeting notes from Jan 15, 2026, Sarah mentioned that the Q3 roadmap would focus on enterprise features and scalability improvements. She specifically highlighted the need for better permission management. [View source: Meeting with Sarah - Q3 Planning]

**Q:** "Summarize everything I know about React Server Components"\
**A:** Based on 5 memories in your brain, here's what you know about React Server Components:

1. They allow server-side rendering... [Source: React Conf 2024 Notes]
1. Benefits include reduced bundle size... [Source: Article - RSC Deep Dive]
1. You experimented with them in... [Source: Project Alpha Code]

**Refusal Mechanism:**

- If no relevant information: "I don't have information about that in your brain yet. Would you like to add some?"
- If contradictory information: "I found conflicting information. Memory A says X, while Memory B says Y. Which do you trust more?"
- Never hallucinate or make up information

**Conversation Memory:**

- Keep last 10 messages in context
- Allow follow-up questions
- "Earlier you said..." references work

**Quality Requirements:**

- Answer accuracy: >85% (human eval)
- Citation accuracy: >95%
- Hallucination rate: <5%
- Response time: <5 seconds

**Technical Specifications:**

- LLM: OpenAI GPT-4 API or self-hosted Llama
- API endpoint: POST /api/v1/chat
- Conversation storage: Postgres (chat\_conversations table)
- Streaming: Server-sent events (SSE) for real-time responses
-----
**6. Brain Scope Selector**

**Description:**\
(See Section 1.7 for detailed specification)

**Summary:**

- Users select which brain(s) to save memories to
- Personal brain + multiple shared organizational brains
- Multi-select capability
- Permission-based access control
-----
**7. Logs System**

**Description:**\
(See Section 1.9 for detailed specification)

**Summary:**

- Complete audit trail for all ingestions
- User-facing and admin-facing views
- Export capabilities
- Compliance-ready
-----
**8. Authentication & Authorization**

**Description:**\
Secure multi-tenant authentication with role-based access control.

**User Roles:**

**1. User (Standard)**

**Permissions:**

- Create memories in personal brain
- Create memories in shared brains (if granted access)
- Search own memories + shared brain memories
- Use chatbot on accessible brains
- View own logs
- Manage own profile

**2. Admin**

**Permissions:**

- All user permissions
- Create/delete shared brains
- Manage user permissions for shared brains
- View all logs (audit trail)
- View system analytics
- Manage organization settings
- User management (invite, deactivate)

**3. System Admin (Super Admin)**

**Permissions:**

- All admin permissions
- Multi-organization management
- System configuration
- Database access
- Billing management

**Authentication Flow:**

1. User registers with email + password or SSO
1. Email verification required
1. Login generates JWT token (1 hour expiry)
1. Refresh token (30 days expiry)
1. Multi-factor authentication (optional, recommended for admins)

**Authorization Model:**

**Brain Access Control:**

{

`  `"brain\_id": "engineering\_brain",

`  `"permissions": {

`    `"user\_id\_123": "read\_write",

`    `"user\_id\_456": "read\_only",

`    `"admin\_id\_789": "admin"

`  `}

}

**Permission Levels:**

- read\_only: Can search and view memories
- read\_write: Can add memories
- admin: Can manage brain settings and permissions

**Access Check Example:**

def can\_write\_to\_brain(user\_id, brain\_id):

`    `permission = get\_permission(user\_id, brain\_id)

`    `return permission in ["read\_write", "admin"]

**Session Management:**

- JWT stored in httpOnly cookie
- CSRF protection
- Session timeout: 1 hour
- "Remember me" extends to 30 days

**SSO Integration (Enterprise):**

- SAML 2.0 support
- OAuth 2.0 (Google, Microsoft, Okta)
- Auto-provisioning from identity provider
- Group-based brain access mapping

**Security Requirements:**

- Password requirements: 12+ characters, mix of cases, numbers, symbols
- Rate limiting: 5 login attempts per 15 minutes
- Account lockout after 5 failed attempts
- Password reset via email (6-hour expiry link)
- Audit log for all auth events

**Technical Specifications:**

- Auth library: NextAuth.js or custom JWT implementation
- Password hashing: bcrypt (12 rounds)
- Token storage: Redis (for blacklisting)
- API endpoints: 
  - POST /api/v1/auth/register
  - POST /api/v1/auth/login
  - POST /api/v1/auth/logout
  - POST /api/v1/auth/refresh
  - POST /api/v1/auth/reset-password
-----
**9. Graph Visualization**

**Description:**\
Interactive visual representation of the knowledge graph for exploration and discovery.

**Functional Requirements:**

**View Modes:**

**1. Memory-Centric View**

- Memory node at center
- Connected entities radiate outward
- Related memories shown as secondary nodes
- Relationships displayed as labeled edges

**2. Entity-Centric View**

- Entity at center
- All memories mentioning entity shown
- Related entities displayed
- Relationship paths highlighted

**3. Topic Exploration View**

- Topic hierarchy displayed as tree
- Memories organized under topics
- Navigate topic branches

**4. Timeline View**

- Chronological graph
- Memories plotted on timeline
- Connections shown temporally

**Interactive Features:**

- Click node to expand/collapse
- Hover to see preview
- Double-click to open memory
- Drag to rearrange (temporary, resets on refresh)
- Zoom in/out
- Pan across graph
- Search within graph (highlight matching nodes)

**Filters:**

- Filter by brain scope
- Filter by date range
- Filter by source type
- Filter by entity type
- Filter by topic
- Minimum connection strength (edge weight threshold)

**Visual Encoding:**

- Node size: Proportional to importance (PageRank or mention count)
- Node color: By type (memory, entity, topic)
- Edge thickness: Relationship strength
- Edge color: Relationship type

**Performance Optimizations:**

- Lazy loading (load only visible nodes)
- Level-of-detail rendering (simplify distant nodes)
- Maximum nodes displayed: 200 (pagination for more)
- WebGL rendering for large graphs

**Example Scenarios:**

**Scenario 1:** User clicks on "Sarah Johnson" entity

- Graph centers on Sarah
- Shows all 15 memories mentioning her
- Displays related entities (Acme Inc, John Doe)
- Highlights strongest connections

**Scenario 2:** User explores "Machine Learning" topic

- Topic node at center
- 50 memories about ML shown
- Sub-topics displayed (NLP, Computer Vision, RL)
- Can drill down into sub-topics

**Export:**

- Export graph as PNG/SVG
- Export data as JSON (nodes + edges)
- Share graph view (generate link)

**Technical Specifications:**

- Visualization library: D3.js or Cytoscape.js
- Graph layout: Force-directed (d3-force) or hierarchical
- Backend: Neo4j graph queries
- API endpoint: GET /api/v1/graph/visualize?center\_node={id}&depth={2}
- Rendering: Canvas or WebGL (for large graphs)
-----
**10. Cleanup & Maintenance**

**Description:**\
Automated and manual tools for keeping the knowledge graph clean and high-quality.

**10.1 Orphan Node Detection**

**Problem:**\
Nodes with no connections become isolated and clutter the graph.

**Detection Logic:**

// Find memory nodes with no relationships

MATCH (m:Memory)

WHERE NOT (m)-[]-()

RETURN m

// Find entity nodes mentioned in <2 memories

MATCH (e:Entity)

WHERE size((e)<-[:MENTIONS]-()) < 2

RETURN e

**User-Facing Feature:**

- "Cleanup Dashboard" in settings
- List of orphan nodes with preview
- Bulk actions: Delete, Review, Keep

**Automated Cleanup:**

- Monthly job to flag orphans
- User receives email: "You have 15 orphan memories. Review?"
- Grace period: 30 days before auto-deletion (with warning)

**10.2 Merge Suggestions**

**Problem:**\
Duplicate entities or memories (e.g., "Sarah Johnson" vs "S. Johnson")

**Detection Logic:**

- String similarity (Levenshtein distance)
- Embedding similarity
- Co-occurrence patterns

**Example Duplicates:**

- "Machine Learning" vs "ML" (entity)
- "Meeting notes Jan 15" vs "Jan 15 meeting" (memory)

**User-Facing Feature:**

- "Merge Suggestions" panel
- Show pairs of potential duplicates
- User actions: Merge, Keep Separate, Ignore
- Preview merged result before confirming

**Merge Process:**

1. Combine node properties (keep all unique values)
1. Merge relationships (combine edge weights)
1. Update all references
1. Delete duplicate node
1. Log merge action

**Automated Suggestions:**

- Weekly job to detect duplicates
- Threshold: >80% similarity
- User notification: "3 merge suggestions available"

**10.3 Confidence Boost/Decay**

**Problem:**\
Old, unreliable information should decay; frequently accessed info should boost.

**Confidence Decay:**

- Initial confidence: Based on NLP model scores
- Decay function: confidence\_new = confidence\_old \* e^(-λ \* time\_delta)
- λ (decay rate): 0.0001 per day (slow decay)
- Minimum confidence: 0.2

**Confidence Boost:**

- User views memory: +0.05
- User edits memory: +0.1
- User cites memory in chat: +0.1
- Maximum confidence: 1.0

**Background Job:**

- Daily recalculation of confidence scores
- Low-confidence nodes flagged for review

**10.4 Relationship Pruning**

**Problem:**\
Weak or spurious relationships clutter the graph.

**Pruning Criteria:**

- Relationship strength < 0.3
- Never accessed in 6 months
- User feedback: "This connection is wrong"

**User Control:**

- "Hide weak connections" toggle in graph view
- "Prune relationships" button in cleanup dashboard
- Preview before deletion

**10.5 Storage Optimization**

**Database Vacuuming:**

- Postgres: Weekly VACUUM ANALYZE
- Neo4j: Monthly store file compaction
- Vector DB: Periodic index rebuild

**Archival:**

- Memories not accessed in 2 years → "Archive" status
- Archived memories: 
  - Removed from vector index (reduce search load)
  - Still accessible via direct link
  - Can be restored

**Delete Cascade:**

- User deletion → Delete all personal memories + audit logs (after 30-day grace)
- Memory deletion → Delete associated chunks, embeddings, relationships

**Technical Specifications:**

- Scheduled jobs: Celery Beat (cron-like)
- Job monitoring: Flower (Celery UI)
- Job frequency: 
  - Orphan detection: Monthly
  - Merge suggestions: Weekly
  - Confidence updates: Daily
  - Storage optimization: Weekly
-----
**Nice-to-Have Features (Advanced Intelligence)**

**1. Analyst Agent**

**Description:**\
Background AI agent that continuously analyzes the knowledge graph to detect patterns, contradictions, and insights.

**Capabilities:**

**Contradiction Detection**

- Detect conflicting statements: 
  - "Sarah said Q3 roadmap focuses on X" (Memory A)
  - "Q3 roadmap focuses on Y" (Memory B)
- Flag contradictions with confidence score
- User notification: "Potential contradiction found"
- Allow user to resolve (mark one as outdated, or explain context)

**Missing Link Suggestions**

- Identify entities that should be connected: 
  - "You mentioned 'React' 50 times and 'Next.js' 30 times, but never linked them"
- Suggest: (:Technology {name: "Next.js"})-[:BUILT\_ON]->(:Technology {name: "React"})

**Pattern Recognition**

- Detect recurring themes: 
  - "You've read 10 articles about Rust in the last month. Interest growing?"
- Identify information gaps: 
  - "You know a lot about frontend but little about backend"

**Frequency:** Runs weekly, generates report

**User Experience:**

- "Analyst Insights" section in dashboard
- Weekly email digest
- Notifications for high-priority findings
-----
**2. Hypothesis Generator**

**Description:**\
AI agent that generates strategic ideas and hypotheses based on accumulated knowledge.

**Use Cases:**

**Idea Generation**

- Input: "I want to start a side project"
- Agent analyzes: 
  - Your skills (extracted from memories)
  - Your interests (topic analysis)
  - Market gaps (if web research enabled)
- Output: "Based on your React expertise and interest in education, consider building an interactive coding tutorial platform"

**Strategy Suggestions**

- For product managers: "Your competitor analysis shows gap in mobile UX. Consider prioritizing mobile redesign."
- For researchers: "You've read 20 papers on X but never explored Y. Y might be relevant because..."

**Frequency:** On-demand or monthly

-----
**3. Reflection Engine**

**Description:**\
Automated periodic summaries and strategic insights.

**Daily Summary (Evening):**

- "Today you added 5 memories"
- "Main topics: Engineering, Product Strategy"
- "New connection discovered: Project Alpha related to Q3 roadmap"

**Weekly Strategy (Monday):**

- "Last week you focused heavily on frontend. Consider balancing with backend learning."
- "You had 3 meetings with Sarah. Key takeaway: Q3 roadmap priorities."
- "Suggested action: Review Q2 learnings before Q3 starts."

**Monthly Insights:**

- "This month you learned: X, Y, Z"
- "Your knowledge graph grew by 30%"
- "Most connected entity: Sarah Johnson"
- "Recommended next steps: Deep dive into topic X"
-----
**4. Explanation Modes**

**Description:**\
Adjust chatbot response complexity based on audience.

**Modes:**

**Simple Mode**

- Audience: Non-technical users
- Style: Short sentences, no jargon
- Example: "React is a tool for building websites"

**Technical Mode**

- Audience: Engineers
- Style: Detailed, assumes knowledge
- Example: "React is a declarative JavaScript library for building component-based UIs using a virtual DOM"

**Executive Mode**

- Audience: Leadership
- Style: High-level, business-focused
- Example: "React enables faster development of user interfaces, reducing time-to-market by 30%"

**Implementation:**

- User selects mode in chatbot settings
- LLM prompt includes mode instruction
-----
**5. Memory Writing Modes**

**Description:**\
Templates for how memories are structured when ingested.

**Modes:**

**Raw Mode**

- Store exactly as provided
- No summarization
- Minimal processing

**Summary Mode**

- Generate concise summary
- Extract key points
- Store both original + summary

**Bullet Mode**

- Convert prose to bullet points
- Highlight action items
- Organize by topic

**Structured Mode**

- Force structure: Problem, Solution, Outcome
- Extract metadata: Date, People, Decision

**User Control:**

- Select mode before ingestion
- Default: Summary mode
-----
**6. Vision Intelligence**

**Description:**\
Advanced image understanding for diagrams and whiteboards.

**Capabilities:**

- Flowchart to code
- Mindmap extraction
- Handwritten notes OCR
- Architectural diagram understanding

**Example:**

- User uploads whiteboard photo of system architecture
- System: 
  - Detects boxes and arrows
  - Extracts component names
  - Generates Mermaid diagram
  - Creates nodes for each component
  - Links components in graph
-----
**7. External Connectors**

**Description:**\
Automatic ingestion from external tools.

**Connectors:**

**Slack Connector**

- Capture messages you star
- Capture threads you participate in
- Auto-ingest to Personal Brain

**Email Connector**

- Scan inbox for important emails
- Extract meeting notes from calendar invites
- Store in Brain

**Folder Watcher**

- Monitor local folder (e.g., Downloads)
- Auto-ingest PDFs, documents
- Configurable filters
-----
**8. 3D Brain Map**

**Description:**\
Immersive 3D visualization of knowledge graph.

**Features:**

- WebGL-based constellation view
- Memories as stars
- Connections as light beams
- Fly-through navigation
- VR mode (future)

**Use Case:**

- Impress users
- Exploration and discovery
- Marketing/demo material
-----
**User Experience (UX) Design**

**Information Architecture**

**Main Navigation:**

1. **Dashboard** (Home)
1. **Add Memory** (Create)
1. **Search** (Find)
1. **Chat** (Ask)
1. **Graph** (Explore)
1. **Settings** (Configure)

**Dashboard Layout**

**Top Section:**

- Search bar (always visible)
- Brain scope selector dropdown
- User avatar → Profile menu

**Main Content:**

- Recent memories (last 10)
- Analyst insights (if available)
- Quick stats: 
  - Total memories
  - Memories this week
  - Most active topic
  - Graph size (nodes, edges)

**Sidebar:**

- Shared brains list
- Topic tags
- Saved searches
- Recent chats

**Add Memory Flow**

**Step 1:** Select ingestion method (tabs)

- Text
- Upload File
- Record Audio
- Upload Image
- YouTube URL
- Web URL

**Step 2:** Input content

**Step 3:** Brain scope selector (modal)

- Select brain(s)
- Preview where it will be saved

**Step 4:** Processing indicator

- Progress bar
- Stages: Uploading → Processing → Extracting → Done ✓

**Step 5:** Success confirmation

- "Memory saved to Personal Brain ✓"
- Button: "View Memory" | "Add Another"

**Search Experience**

**Search Bar:**

- Natural language input
- Search suggestions as user types
- Filters panel (collapsible): 
  - Date range
  - Brain scope
  - Source type
  - Entities
  - Topics

**Results Page:**

- Ranked results (10 per page)
- Each result shows: 
  - Memory title
  - Snippet (highlighted query terms)
  - Source type icon
  - Date
  - Brain scope badges
- Click result → Opens memory detail view

**Memory Detail View:**

- Full content
- Entities extracted (clickable)
- Topics (clickable)
- Related memories (sidebar)
- Edit button
- Delete button
- Share button (copy link)

**Chat Interface**

**Layout:**

- Left sidebar: Conversation history
- Main: Chat window
- Right sidebar: Citations panel

**Chat Window:**

- User messages (right-aligned, blue)
- Assistant messages (left-aligned, gray)
- Citations shown inline: [Memory Title]
- Click citation → Opens memory in modal

**Input Box:**

- Textarea with auto-resize
- Send button
- Voice input button (future)

**Conversation History:**

- List of past conversations
- Click to resume
- Delete conversation option

**Graph Visualization Interface**

**Main View:**

- Full-screen canvas
- Nodes and edges rendered
- Mini-map (bottom-right corner)

**Control Panel (Left Sidebar):**

- Search nodes
- Filters
- Layout options (force-directed, hierarchical, circular)
- Node sizing (by importance, by type)

**Info Panel (Right Sidebar, appears on node click):**

- Node details
- Connected nodes list
- Quick actions: View, Edit, Delete

**Settings Page**

**Sections:**

- Profile 
  - Name, email
  - Change password
  - MFA settings
- Brains 
  - Personal brain stats
  - Shared brains (access level)
  - Create shared brain (admin only)
- Preferences 
  - Default brain scope
  - Notification settings
  - Explanation mode
  - Memory writing mode
- Integrations (future) 
  - Slack, Email, Folder watcher
- Billing (enterprise) 
  - Plan details
  - Usage stats
  - Invoices
- Cleanup Dashboard 
  - Orphan nodes
  - Merge suggestions
  - Run cleanup jobs
-----
**Technical Architecture**

**System Architecture Diagram**

┌─────────────────────────────────────────────────────────────┐

│                        Frontend Layer                        │

│  Next.js + React + TailwindCSS + D3.js + Cytoscape.js       │

└─────────────────────────────────────────────────────────────┘

`                              `│

`                              `▼

┌─────────────────────────────────────────────────────────────┐

│                       API Gateway Layer                      │

│          FastAPI (Python) or Express.js (Node.js)           │

│              Rate Limiting + Auth + Logging                 │

└─────────────────────────────────────────────────────────────┘

`                              `│

`                `┌─────────────┼─────────────┐

`                `▼             ▼             ▼

`    `┌─────────────────┐ ┌──────────────┐ ┌──────────────┐

`    `│  Processing     │ │  Query       │ │  Admin       │

`    `│  Service        │ │  Service     │ │  Service     │

`    `│  (Celery)       │ │  (FastAPI)   │ │  (FastAPI)   │

`    `└─────────────────┘ └──────────────┘ └──────────────┘

`            `│                   │                │

`            `▼                   ▼                ▼

┌─────────────────────────────────────────────────────────────┐

│                       Data Layer                             │

│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │

│  │ Postgres │  │  Neo4j   │  │ Pinecone │  │  Redis   │   │

│  │  (SQL)   │  │  (Graph) │  │ (Vector) │  │ (Cache)  │   │

│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │

└─────────────────────────────────────────────────────────────┘

`            `│                   │

`            `▼                   ▼

┌─────────────────────────────────────────────────────────────┐

│                    Storage Layer                             │

│         S3-compatible Object Storage (Files, Audio)          │

└─────────────────────────────────────────────────────────────┘

**Technology Stack**

**Frontend**

- **Framework:** Next.js 14 (React 18)
- **Styling:** TailwindCSS
- **State Management:** Zustand or React Query
- **Graph Visualization:** D3.js or Cytoscape.js
- **Rich Text Editor:** Tiptap or Quill
- **File Upload:** react-dropzone
- **Forms:** React Hook Form + Zod validation

**Backend**

- **API Framework:** FastAPI (Python) or Express.js (TypeScript)
- **Task Queue:** Celery + Redis
- **Authentication:** NextAuth.js or custom JWT
- **LLM Orchestration:** LangChain or LlamaIndex

**Databases**

- **Relational:** PostgreSQL 16 
  - Users, logs, conversations, audit trail
- **Graph:** Neo4j 5.x Enterprise 
  - Knowledge graph (memories, entities, relationships)
- **Vector:** Pinecone (managed) or Qdrant (self-hosted) 
  - Embeddings for semantic search
- **Cache:** Redis 7.x 
  - Session storage, task queue, query cache

**Storage**

- **Object Storage:** AWS S3 or MinIO (self-hosted) 
  - Files, audio, images

**ML/NLP**

- **Embeddings:** sentence-transformers or OpenAI API
- **NER:** spaCy 3.x or Hugging Face transformers
- **LLM:** OpenAI GPT-4 API or self-hosted Llama 3 70B
- **Transcription:** OpenAI Whisper or Deepgram API
- **Vision:** GPT-4V API or LLaVA

**Infrastructure**

- **Containerization:** Docker + Docker Compose
- **Orchestration:** Kubernetes (production)
- **CI/CD:** GitHub Actions or GitLab CI
- **Monitoring:** Prometheus + Grafana
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Error Tracking:** Sentry

**Deployment Architecture**

**Development:**

- Docker Compose
- All services run locally

**Staging:**

- Kubernetes cluster (3 nodes)
- Managed databases (RDS, Neo4j Aura)
- Pinecone cloud

**Production:**

- Kubernetes cluster (auto-scaling, 5-20 nodes)
- Managed databases with replicas
- CDN for static assets (CloudFront)
- Multi-region (future)

**Security Architecture**

**Data Security:**

- Encryption at rest (database-level)
- Encryption in transit (TLS 1.3)
- Field-level encryption for sensitive data

**Network Security:**

- VPC with private subnets
- API Gateway with WAF
- DDoS protection (Cloudflare)

**Application Security:**

- Input validation (Zod schemas)
- SQL injection prevention (parameterized queries)
- XSS prevention (React auto-escaping)
- CSRF tokens
- Rate limiting (per user, per IP)

**Compliance:**

- GDPR: Data export, deletion, consent management
- SOC 2: Audit logs, access controls
- HIPAA (future): BAA, PHI encryption
-----
**Data Models**

**Relational Database (Postgres)**

**Users Table**

CREATE TABLE users (

`    `id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

`    `email VARCHAR(255) UNIQUE NOT NULL,

`    `password\_hash VARCHAR(255) NOT NULL,

`    `name VARCHAR(255),

`    `role VARCHAR(50) NOT NULL, -- 'user', 'admin', 'system\_admin'

`    `organization\_id UUID REFERENCES organizations(id),

`    `created\_at TIMESTAMP DEFAULT NOW(),

`    `updated\_at TIMESTAMP DEFAULT NOW(),

`    `last\_login TIMESTAMP,

`    `is\_active BOOLEAN DEFAULT TRUE

);

**Organizations Table**

CREATE TABLE organizations (

`    `id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

`    `name VARCHAR(255) NOT NULL,

`    `plan VARCHAR(50), -- 'free', 'pro', 'enterprise'

`    `created\_at TIMESTAMP DEFAULT NOW()

);

**Brains Table**

CREATE TABLE brains (

`    `id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

`    `name VARCHAR(255) NOT NULL,

`    `description TEXT,

`    `type VARCHAR(50) NOT NULL, -- 'personal', 'shared'

`    `organization\_id UUID REFERENCES organizations(id),

`    `created\_by UUID REFERENCES users(id),

`    `created\_at TIMESTAMP DEFAULT NOW()

);

**Brain Permissions Table**

CREATE TABLE brain\_permissions (

`    `id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

`    `brain\_id UUID REFERENCES brains(id) ON DELETE CASCADE,

`    `user\_id UUID REFERENCES users(id) ON DELETE CASCADE,

`    `permission VARCHAR(50) NOT NULL, -- 'read\_only', 'read\_write', 'admin'

`    `granted\_at TIMESTAMP DEFAULT NOW(),

`    `granted\_by UUID REFERENCES users(id),

`    `UNIQUE(brain\_id, user\_id)

);

**Ingestion Logs Table**

CREATE TABLE ingestion\_logs (

`    `id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

`    `user\_id UUID REFERENCES users(id) ON DELETE SET NULL,

`    `memory\_id UUID, -- References Neo4j node

`    `source\_type VARCHAR(50) NOT NULL,

`    `brain\_scopes JSONB NOT NULL,

`    `raw\_input\_reference TEXT,

`    `processing\_outputs JSONB,

`    `processing\_time\_ms INTEGER,

`    `status VARCHAR(50),

`    `error\_message TEXT,

`    `created\_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx\_ingestion\_logs\_user ON ingestion\_logs(user\_id);

CREATE INDEX idx\_ingestion\_logs\_created ON ingestion\_logs(created\_at DESC);

**Chat Conversations Table**

CREATE TABLE chat\_conversations (

`    `id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

`    `user\_id UUID REFERENCES users(id) ON DELETE CASCADE,

`    `title VARCHAR(255),

`    `messages JSONB NOT NULL, -- Array of {role, content, citations}

`    `created\_at TIMESTAMP DEFAULT NOW(),

`    `updated\_at TIMESTAMP DEFAULT NOW()

);

**Graph Database (Neo4j)**

**Node Labels and Properties**

(See Section 3 for detailed schemas)

**Index and Constraint Definitions**

CREATE CONSTRAINT unique\_memory\_id FOR (m:Memory) REQUIRE m.id IS UNIQUE;

CREATE CONSTRAINT unique\_entity\_canonical FOR (e:Entity) REQUIRE e.canonical\_name IS UNIQUE;

CREATE INDEX memory\_user FOR (m:Memory) ON (m.user\_id);

CREATE INDEX memory\_created FOR (m:Memory) ON (m.created\_at);

CREATE INDEX entity\_type FOR (e:Entity) ON (e.type);

**Vector Database (Pinecone)**

**Index Schema**

index\_config = {

`    `"name": "second-brain-prod",

`    `"dimension": 768,  # or 1536 for OpenAI

`    `"metric": "cosine",

`    `"pod\_type": "p1.x1",  # Pinecone pod type

`    `"metadata\_config": {

`        `"indexed": ["user\_id", "brain\_scopes", "source\_type", "created\_at"]

`    `}

}

**Vector Record Example**

{

`    `"id": "vec\_123",

`    `"values": [0.123, 0.456, ...],

`    `"metadata": {

`        `"memory\_id": "mem\_abc",

`        `"chunk\_id": "chunk\_1",

`        `"user\_id": "user\_xyz",

`        `"brain\_scopes": ["personal", "engineering"],

`        `"source\_type": "text",

`        `"created\_at": "2026-01-31T10:00:00Z",

`        `"text\_preview": "This is a preview..."

`    `}

}

-----
**API Specification**

**Authentication Endpoints**

**Register**

POST /api/v1/auth/register

Body: {email, password, name}

Response: {user\_id, token}

**Login**

POST /api/v1/auth/login

Body: {email, password}

Response: {user, access\_token, refresh\_token}

**Refresh Token**

POST /api/v1/auth/refresh

Body: {refresh\_token}

Response: {access\_token}

**Memory Ingestion Endpoints**

**Text Memory**

POST /api/v1/memories/text

Headers: {Authorization: Bearer <token>}

Body: {

`    `title: string,

`    `content: string,

`    `brain\_scopes: string[],

`    `user\_summary?: string,

`    `user\_tags?: string[]

}

Response: {

`    `memory\_id: UUID,

`    `status: "processing",

`    `estimated\_time: 10

}

**File Upload**

POST /api/v1/memories/upload

Headers: {Authorization: Bearer <token>}

Body: FormData {

`    `file: File,

`    `brain\_scopes: string[]

}

Response: {memory\_id, status, processing\_job\_id}

**Audio Recording**

POST /api/v1/memories/audio

Headers: {Authorization: Bearer <token>}

Body: FormData {

`    `audio: File,

`    `brain\_scopes: string[]

}

Response: {memory\_id, status, processing\_job\_id}

**Image Upload**

POST /api/v1/memories/image

Body: FormData {

`    `image: File,

`    `brain\_scopes: string[],

`    `user\_caption?: string

}

Response: {memory\_id, status}

**Video URL**

POST /api/v1/memories/video-url

Body: {

`    `url: string,

`    `brain\_scopes: string[]

}

Response: {memory\_id, status}

**Web URL**

POST /api/v1/memories/web-url

Body: {

`    `url: string,

`    `brain\_scopes: string[]

}

Response: {memory\_id, status}

**Search & Query Endpoints**

**Vector Search**

POST /api/v1/search/vector

Body: {

`    `query: string,

`    `brain\_scopes?: string[],

`    `filters?: {

`        `date\_range?: {start, end},

`        `source\_type?: string[],

`        `entities?: string[]

`    `},

`    `top\_k: number = 10

}

Response: {

`    `results: [{

`        `memory\_id,

`        `title,

`        `snippet,

`        `score,

`        `metadata

`    `}]

}

**Hybrid Search (Vector + Graph)**

POST /api/v1/search/hybrid

Body: {query, brain\_scopes, filters, top\_k}

Response: {results}

**Chat (RAG)**

POST /api/v1/chat

Body: {

`    `conversation\_id?: UUID,

`    `message: string,

`    `brain\_scopes?: string[],

`    `explanation\_mode?: "simple"|"technical"|"executive"

}

Response: {

`    `conversation\_id,

`    `answer: string,

`    `citations: [{memory\_id, title, snippet}],

`    `confidence: "high"|"medium"|"low"

}

**Graph Endpoints**

**Get Memory**

GET /api/v1/memories/{memory\_id}

Response: {

`    `id, title, content, summary,

`    `entities, topics, related\_memories,

`    `created\_at, source\_type

}

**Get Graph Visualization**

GET /api/v1/graph/visualize

Params: {

`    `center\_node: UUID,

`    `depth: number = 2,

`    `max\_nodes: number = 200,

`    `filters?: {...}

}

Response: {

`    `nodes: [{id, label, type, properties}],

`    `edges: [{source, target, type, weight}]

}

**Entity Search**

GET /api/v1/entities/search

Params: {query: string, limit: number}

Response: {

`    `entities: [{id, name, type, mention\_count}]

}

**Admin Endpoints**

**Create Brain**

POST /api/v1/admin/brains

Body: {name, description, type: "shared"}

Response: {brain\_id}

**Grant Permission**

POST /api/v1/admin/brains/{brain\_id}/permissions

Body: {user\_id, permission: "read\_write"}

Response: {success: true}

**View Logs**

GET /api/v1/admin/logs

Params: {

`    `user\_id?: UUID,

`    `date\_range?: {start, end},

`    `limit: number = 100

}

Response: {

`    `logs: [{...ingestion\_log}]

}

**Cleanup Endpoints**

**Get Orphan Nodes**

GET /api/v1/cleanup/orphans

Response: {

`    `orphan\_memories: [{memory\_id, title}],

`    `orphan\_entities: [{entity\_id, name}]

}

**Get Merge Suggestions**

GET /api/v1/cleanup/merge-suggestions

Response: {

`    `suggestions: [{

`        `entity1: {id, name},

`        `entity2: {id, name},

`        `similarity: 0.85

`    `}]

}

**Merge Entities**

POST /api/v1/cleanup/merge-entities

Body: {entity1\_id, entity2\_id}

Response: {merged\_entity\_id}

-----
**Performance Requirements**

**Response Time**

|**Operation**|**Target (p95)**|**Maximum Acceptable**|
| :- | :- | :- |
|Text ingestion|10s|30s|
|File upload (PDF 10 pages)|20s|60s|
|Audio transcription (1 min)|10s|30s|
|Vector search|500ms|2s|
|Graph query|1s|3s|
|Chatbot response|5s|10s|
|Page load|1s|3s|

**Throughput**

|**Metric**|**Target**|
| :- | :- |
|Concurrent users|1,000|
|API requests/second|10,000|
|Memories ingested/day|100,000|
|Search queries/second|1,000|

**Scalability**

- Support 100,000 users
- 10M+ memories in graph
- 50M+ vectors in index
- Horizontal scaling for API layer
- Read replicas for databases
-----
**Security & Compliance**

**Data Privacy**

- User data isolated by user\_id and brain\_scope
- No cross-user data leakage
- Personal brains invisible to others
- Shared brain permissions enforced

**Compliance Features**

**GDPR**

- Data export: User can download all memories as JSON/PDF
- Right to deletion: User deletion deletes all personal data
- Consent management: Cookie consent, data processing consent
- Data portability: Export in machine-readable format

**SOC 2**

- Audit logs for all actions
- Access controls and role-based permissions
- Encryption at rest and in transit
- Security monitoring and alerting

**HIPAA (Future)**

- Business Associate Agreement (BAA)
- PHI encryption and access controls
- Audit trail for PHI access

**Penetration Testing**

- Annual third-party pentest
- Bug bounty program (post-launch)
-----
**Testing Strategy**

**Unit Tests**

- Backend: pytest (Python), Jest (Node.js)
- Frontend: Jest + React Testing Library
- Coverage target: >80%

**Integration Tests**

- API endpoint tests
- Database integration tests
- NLP pipeline tests
- End-to-end ingestion tests

**End-to-End Tests**

- Playwright or Cypress
- Critical user flows: 
  - Sign up → Add memory → Search → View
  - Upload file → Process → Search → Chat

**Performance Tests**

- Load testing: k6 or Locust
- Scenarios: 
  - 1000 concurrent search queries
  - 100 concurrent file uploads
  - 10,000 chat requests/hour

**Security Tests**

- OWASP Top 10 checks
- SQL injection tests
- XSS tests
- Authentication bypass tests
-----
**Deployment Plan**

**Phase 1: Alpha (Month 1-2)**

- Core features only (Must-Have)
- Internal testing with 10 users
- Focus on feedback and iteration

**Phase 2: Private Beta (Month 3-4)**

- Invite 100 users
- All must-have features complete
- Stability and performance tuning

**Phase 3: Public Beta (Month 5-6)**

- Open to 1,000 users
- Marketing push
- Add nice-to-have features

**Phase 4: General Availability (Month 7+)**

- Production-ready
- Enterprise features
- Pricing model launched
-----
**Success Metrics & KPIs**

**User Engagement**

- DAU/MAU ratio: >30%
- Avg memories per user per week: >10
- Avg searches per user per day: >5
- Chat usage: >50% of users use chatbot weekly

**Product Quality**

- Search success rate: >85%
- Answer accuracy (human eval): >85%
- System uptime: >99.9%
- Bug escape rate: <5%

**Business Metrics**

- User retention (6 months): >70%
- Net Promoter Score: >40
- Customer acquisition cost: <$100
- Lifetime value: >$500
- Monthly recurring revenue growth: >20%

**Learning & Iteration**

- User interviews: 10 per month
- A/B tests running: 2-3 concurrent
- Feature adoption tracking
- Churn analysis and intervention
-----
**Risks & Mitigation**

**Technical Risks**

|**Risk**|**Probability**|**Impact**|**Mitigation**|
| :- | :- | :- | :- |
|LLM hallucinations|High|High|Strict citation requirements, user feedback loop|
|Graph query performance degradation|Medium|High|Query optimization, caching, read replicas|
|Vector search relevance|Medium|Medium|Hybrid search, continuous tuning, user feedback|
|Data loss|Low|Critical|Automated backups, point-in-time recovery|

**Business Risks**

|**Risk**|**Probability**|**Impact**|**Mitigation**|
| :- | :- | :- | :- |
|Low user adoption|Medium|Critical|User research, MVP testing, marketing|
|Competitor launches similar product|High|High|Fast iteration, unique features (graph + vector + LLM)|
|High infrastructure costs|Medium|Medium|Cost monitoring, usage-based pricing|

**Compliance Risks**

|**Risk**|**Probability**|**Impact**|**Mitigation**|
| :- | :- | :- | :- |
|GDPR violation|Low|Critical|Legal review, compliance features, audit|
|Data breach|Low|Critical|Security best practices, pentesting, monitoring|

-----
**Budget & Resources**

**Team Requirements**

**Phase 1 (Alpha)**

- 1 Product Manager
- 2 Frontend Engineers
- 2 Backend Engineers
- 1 ML Engineer
- 1 DevOps Engineer
- 1 Designer

**Phase 2+ (Beta & GA)**

- +1 Backend Engineer
- +1 ML Engineer
- +1 QA Engineer
- +1 Marketing Lead

**Infrastructure Costs (Monthly, estimated)**

|**Service**|**Cost**|
| :- | :- |
|Cloud compute (AWS/GCP)|$2,000|
|Managed databases (RDS, Neo4j Aura)|$1,500|
|Vector DB (Pinecone)|$500|
|LLM API (OpenAI/Anthropic)|$3,000|
|Storage (S3)|$300|
|CDN|$200|
|Monitoring & logging|$300|
|**Total**|**$7,800**|

**Development Timeline**

|**Phase**|**Duration**|**Milestones**|
| :- | :- | :- |
|Alpha|2 months|Core features, 10 users|
|Private Beta|2 months|Stability, 100 users|
|Public Beta|2 months|Marketing, 1000 users|
|GA|Ongoing|Enterprise features, scaling|

-----
**Open Questions & Future Exploration**

1. **Multi-modal reasoning:** Can we combine text + image + audio in a single reasoning chain?
1. **Collaborative editing:** Should multiple users be able to edit the same memory simultaneously?
1. **Versioning:** Should we track changes to memories over time (git-like)?
1. **Federated learning:** Can we train personalized models without centralizing data?
1. **Mobile apps:** Native iOS/Android apps or PWA?
1. **Browser extension:** Capture web pages with one click?
1. **API for developers:** Should we expose public API for third-party integrations?
1. **Marketplace:** User-created skills/agents/templates?
-----
**Appendix**

**Glossary**

- **Memory:** A unit of knowledge (note, document, recording, etc.)
- **Brain:** A knowledge container (personal or shared)
- **Entity:** A recognized person, place, organization, or concept
- **Topic:** A thematic category
- **Chunk:** A segment of text (typically 512 tokens)
- **Embedding:** Vector representation of text
- **RAG:** Retrieval Augmented Generation

**References**

- Neo4j Documentation: https://neo4j.com/docs/
- LangChain Documentation: https://python.langchain.com/
- OpenAI API: https://platform.openai.com/docs
- Pinecone Documentation: https://docs.pinecone.io/
-----
**End of PRD**

