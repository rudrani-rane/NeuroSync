"""
NER and topic classification for system logs metadata.
"""
import logging
from typing import List, Dict, Tuple

logger = logging.getLogger(__name__)

class MetadataExtractor:
    def __init__(self):
        self.nlp = None
        self.llm = None
        
    def _load_spacy(self):
        """Lazy load spaCy NER model"""
        if self.nlp is None:
            try:
                import spacy
                self.nlp = spacy.load("en_core_web_sm")
                logger.info("spaCy NER model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load spaCy: {e}")
                self.nlp = "failed"
        return self.nlp != "failed"
    
    def _load_llm(self):
        """Lazy load LLM for topic classification"""
        if self.llm is None:
            try:
                from services.shared.llm import setup_fast_llm, AgentConfig
                config = AgentConfig()
                self.llm = setup_fast_llm(config)
                logger.info("Topic classification LLM loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load LLM: {e}")
                self.llm = "failed"
        return self.llm != "failed"
    
    def extract_entities(self, text: str) -> List[Dict[str, str]]:
        """Extract named entities using spaCy or fallback to simple extraction"""
        if not self._load_spacy():
            # Fallback: Simple capitalized word extraction
            logger.warning("spaCy unavailable, using fallback entity extraction")
            return self._fallback_entity_extraction(text)
        
        try:
            doc = self.nlp(text[:1000])  # Limit text length
            entities = []
            for ent in doc.ents:
                entities.append({
                    "text": ent.text,
                    "label": ent.label_,
                    "start": ent.start_char,
                    "end": ent.end_char
                })
            return entities
        except Exception as e:
            logger.error(f"Entity extraction failed: {e}")
            return self._fallback_entity_extraction(text)
    
    def _fallback_entity_extraction(self, text: str) -> List[Dict[str, str]]:
        """Simple fallback entity extraction using regex patterns"""
        import re
        entities = []
        
        # Extract capitalized words (potential proper nouns)
        words = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text[:1000])
        seen = set()
        for word in words:
            if word not in seen and len(word) > 2:
                entities.append({
                    "text": word,
                    "label": "ENTITY",
                    "start": 0,
                    "end": 0
                })
                seen.add(word)
        
        return entities[:20]  # Limit to 20 entities
    
    async def classify_topics(self, text: str, scopes: List[str]) -> List[str]:
        """Classify topics using LLM"""
        if not self._load_llm():
            # Fallback to keyword-based classification
            return self._keyword_classification(text, scopes)
        
        try:
            prompt = f"""Analyze this text and identify 2-3 main topics or categories.

Text: {text[:500]}

User-selected scopes: {', '.join(scopes)}

Provide a comma-separated list of topics (max 3). Be specific and concise.
Topics:"""
            
            response = await self.llm.ainvoke(prompt)
            topics_text = response.content.strip()
            
            # Parse topics
            topics = [t.strip() for t in topics_text.split(',') if t.strip()]
            
            # Add scopes as topics
            all_topics = list(set(scopes + topics[:3]))
            return all_topics[:5]
            
        except Exception as e:
            logger.error(f"Topic classification failed: {e}")
            return self._keyword_classification(text, scopes)
    
    def _keyword_classification(self, text: str, scopes: List[str]) -> List[str]:
        """Fallback keyword-based topic classification"""
        text_lower = text.lower()
        topics = list(scopes)  # Start with scopes
        
        # Enhanced keyword mapping
        keywords = {
            "technology": ["code", "programming", "software", "api", "database", "ai", "machine learning", "algorithm", "computer", "iphone", "tech", "app"],
            "science": ["research", "experiment", "study", "analysis", "scientific", "data"],
            "business": ["meeting", "project", "deadline", "client", "company", "market", "revenue", "sales", "released"],
            "personal": ["thought", "idea", "note", "reminder", " i ", " my ", " me "],
            "learning": ["learn", "study", "understand", "knowledge", "education", "course", "tutorial"]
        }
        
        for topic, words in keywords.items():
            if any(word in text_lower for word in words):
                topics.append(topic)
        
        # Always include at least one topic
        if not topics or topics == scopes:
            topics.append('general')
        
        return list(set(topics))[:5]
    
    def calculate_confidence(self, text: str, entities: List[Dict]) -> float:
        """Calculate confidence score based on text quality and entity extraction"""
        try:
            # Base confidence
            confidence = 0.5
            
            # Increase for longer text
            if len(text) > 100:
                confidence += 0.2
            if len(text) > 500:
                confidence += 0.1
            
            # Increase for entities found
            if entities:
                confidence += min(len(entities) * 0.05, 0.2)
            
            return min(confidence, 1.0)
        except:
            return 0.5
    
    async def extract_metadata(self, text: str, scopes: List[str] = None) -> Tuple[List[str], List[str]]:
        """
        Extract entities and topics from text.
        Returns: (entities_list, topics_list)
        """
        scopes = scopes or ["general"]
        
        # Extract entities (using fallback if spacy is unavailable)
        entity_dicts = self.extract_entities(text)
        entities = [e["text"] for e in entity_dicts]
        
        # Extract topics using AI classification
        topics = await self.classify_topics(text, scopes)
        
        logger.info(f"[METADATA] Extracted {len(entities)} entities and {len(topics)} topics from text")
        return entities, topics

# Global metadata extractor
metadata_extractor = MetadataExtractor()
