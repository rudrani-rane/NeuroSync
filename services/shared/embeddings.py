"""
Embedding and semantic search utilities using sentence-transformers.
"""
import logging
from typing import List, Dict
import numpy as np

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        self.model = None
        
    def _load_model(self):
        """Lazy load sentence transformer model"""
        if self.model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                logger.info("Embedding model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load embedding model: {e}")
                self.model = "failed"
        return self.model != "failed"
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text"""
        if not self._load_model():
            return []
        
        try:
            embedding = self.model.encode(text)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            return []
    
    def compute_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Compute cosine similarity between two embeddings"""
        try:
            vec1 = np.array(embedding1)
            vec2 = np.array(embedding2)
            
            dot_product = np.dot(vec1, vec2)
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            similarity = dot_product / (norm1 * norm2)
            return float(similarity)
        except Exception as e:
            logger.error(f"Similarity computation failed: {e}")
            return 0.0

# Global embedding service
embedding_service = EmbeddingService()
