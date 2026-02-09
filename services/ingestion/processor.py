"""
File processing for ingestion: PDF, images, audio, video.
"""
import os
import logging
from pathlib import Path
import httpx
from bs4 import BeautifulSoup
from PyPDF2 import PdfReader
import base64
import tempfile

# Conditional imports for Whisper and yt-dlp to avoid errors if not installed
try:
    import whisper
except ImportError:
    whisper = None
    logging.warning("Whisper not installed. Audio transcription will be unavailable.")

try:
    import yt_dlp
except ImportError:
    yt_dlp = None
    logging.warning("yt-dlp not installed. YouTube transcription will be unavailable.")

try:
    from langchain_core.messages import HumanMessage
    from services.shared.llm import setup_portkey_llm, AgentConfig
except ImportError:
    HumanMessage = None
    setup_portkey_llm = None
    AgentConfig = None
    logging.warning("Langchain or Portkey LLM services not available. Vision analysis will be unavailable.")


logger = logging.getLogger(__name__)

class IngestionProcessor:
    def __init__(self):
        self.whisper_model = None
        self.vision_llm = None
        
    def _load_whisper(self):
        """Lazy load Whisper model"""
        if self.whisper_model is None:
            if whisper is None:
                logger.error("Whisper library not found. Cannot load model.")
                self.whisper_model = "failed"
                return False
            try:
                self.whisper_model = whisper.load_model("base")
                logger.info("Whisper model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load Whisper: {e}")
                self.whisper_model = "failed"
        return self.whisper_model != "failed"
    
    def _load_vision_llm(self):
        """Lazy load Vision LLM via Portkey"""
        if self.vision_llm is None:
            if setup_portkey_llm is None or AgentConfig is None or HumanMessage is None:
                logger.error("Portkey LLM services or Langchain HumanMessage not found. Cannot load vision LLM.")
                self.vision_llm = "failed"
                return False
            try:
                config = AgentConfig()
                # Use Gemini 2.0 Pro for vision (supports multimodal)
                config.model_name = "@GCP-VertexAI-Prod/gemini-2.5-flash"
                self.vision_llm = setup_portkey_llm(config)
                logger.info("Vision LLM loaded successfully (Gemini 2.0 Pro)")
            except Exception as e:
                logger.error(f"Failed to load Vision LLM: {e}")
                self.vision_llm = "failed"
        return self.vision_llm != "failed"

    async def process_file(self, file_path: str, mime_type: str) -> str:
        """
        Extracts content from a file based on its type.
        """
        try:
            if mime_type.startswith("image/"):
                return await self.analyze_image(file_path)
            
            elif mime_type == "application/pdf":
                return self._extract_text_from_pdf(file_path)
            
            elif mime_type in ["text/plain", "text/markdown", "text/csv"]:
                return self._read_text_file(file_path)

            elif mime_type.startswith("audio/"):
                return await self.transcribe_audio(file_path)
                
            else:
                return f"[Unsupported File Type: {mime_type}]. File saved at {file_path}."
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {str(e)}")
            return f"Error extracting content: {str(e)}"

    def _read_text_file(self, path: str) -> str:
        """Read plain text files"""
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            return content[:10000]  # Limit to 10k chars
        except Exception as e:
            logger.error(f"Error reading text file: {e}")
            return f"Error reading file: {str(e)}"

    def _extract_text_from_pdf(self, path: str) -> str:
        """Extract text from PDF using PyPDF2"""
        try:
            reader = PdfReader(path)
            text = ""
            for page in reader.pages[:50]:  # Limit to first 50 pages
                text += page.extract_text() + "\n"
            return text[:10000]  # Limit to 10k chars
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
            return f"Error extracting PDF: {str(e)}"

    async def scrape_url(self, url: str, translate: bool = False) -> str:
        """
        Real web scraping using BeautifulSoup or YouTube transcription.
        """
        try:
            # Check if it's a YouTube URL
            if 'youtube.com' in url or 'youtu.be' in url:
                return await self._transcribe_youtube(url, translate=translate)
            
            # Regular web scraping
            
            async with httpx.AsyncClient(follow_redirects=True, timeout=20.0) as client:
                response = await client.get(url)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.decompose()

                # Get text
                text = soup.get_text()

                # Break into lines and remove leading/trailing whitespace
                lines = (line.strip() for line in text.splitlines())
                # Break multi-headlines into a line each
                chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                # Drop blank lines
                content = '\n'.join(chunk for chunk in chunks if chunk)
                
                return content[:10000]  # Limit to first 10k chars
        except Exception as e:
            logger.error(f"Scraping failed for {url}: {str(e)}")
            return f"Error scraping URL: {str(e)}"

    async def _transcribe_youtube(self, url: str, translate: bool = False) -> str:
        """Transcribe YouTube video using yt-dlp + Whisper"""
        try:
            if yt_dlp is None:
                return f"[YouTube Transcription Unavailable]: yt-dlp library not found."

            if not self._load_whisper():
                return f"[YouTube Transcription Unavailable]: Whisper model failed to load."
            
            # Download audio
            with tempfile.TemporaryDirectory() as tmpdir:
                audio_path = os.path.join(tmpdir, "audio.mp3")
                
                ydl_opts = {
                    'format': 'bestaudio/best',
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': '192',
                    }],
                    'outtmpl': audio_path.replace('.mp3', ''),
                    'quiet': True,
                }
                
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(url, download=True)
                    title = info.get('title', 'Unknown')
                
                # Transcribe with Whisper
                if translate:
                    # Translate to English
                    result = self.whisper_model.transcribe(audio_path, task="translate")
                    transcript = result["text"]
                    return f"[YouTube: {title}] (Translated to English)\n\n{transcript}"
                else:
                    # Just transcribe
                    result = self.whisper_model.transcribe(audio_path)
                    transcript = result["text"]
                    return f"[YouTube: {title}]\n\n{transcript}"
                    
        except Exception as e:
            logger.error(f"YouTube transcription failed: {e}")
            return f"Error transcribing YouTube video: {str(e)}"

    async def analyze_image(self, path: str, ocr: bool = True, scene: bool = True, objects: bool = True) -> str:
        """
        Analyzes image using Gemini Vision via Portkey.
        Performs OCR, scene description, and object recognition.
        """
        try:
            if not self._load_vision_llm():
                return f"[VISION ANALYSIS UNAVAILABLE]: Vision model failed to load for {os.path.basename(path)}"
            
            
            # Read and encode image
            with open(path, "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')
            
            # Determine file extension
            ext = Path(path).suffix.lower()
            mime_map = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp'
            }
            mime_type = mime_map.get(ext, 'image/jpeg')
            
            # Build analysis prompt based on parameters
            tasks = []
            if ocr:
                tasks.append("1. Extract all visible text (OCR)")
            if scene:
                tasks.append("2. Describe the scene in natural language")
            if objects:
                tasks.append("3. Identify and tag all objects, entities, and items")
            
            prompt = f"""Analyze this image and provide:
{chr(10).join(tasks)}

Format your response as:
OCR TEXT: [extracted text]
SCENE: [description]
OBJECTS: [comma-separated list]
"""
            
            # Create message with image
            message = HumanMessage(
                content=[
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{image_data}"
                        }
                    }
                ]
            )
            
            # Get response from Vision LLM
            response = await self.vision_llm.ainvoke([message])
            analysis = response.content
            
            return f"[VISION ANALYSIS]: {os.path.basename(path)}\n\n{analysis}"
            
        except Exception as e:
            logger.error(f"Vision analysis failed: {e}")
            return f"[VISION ERROR]: {str(e)}"

    async def transcribe_audio(self, path: str) -> str:
        """
        Transcribes audio using Whisper.
        """
        try:
            if not self._load_whisper():
                return f"[AUDIO TRANSCRIPTION UNAVAILABLE]: Whisper model failed to load for {os.path.basename(path)}"
            
            logger.info(f"Transcribing audio: {path}")
            result = self.whisper_model.transcribe(path)
            transcript = result["text"]
            
            return f"[AUDIO TRANSCRIPT]: {os.path.basename(path)}\n\n{transcript}"
            
        except Exception as e:
            logger.error(f"Audio transcription failed: {e}")
            return f"[TRANSCRIPTION ERROR]: {str(e)}"

# Global processor instance
processor = IngestionProcessor()
