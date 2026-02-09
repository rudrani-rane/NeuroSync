"""LLM setup with Portkey configuration."""
 
import httpx
import ssl
from langchain_openai import ChatOpenAI
from portkey_ai import createHeaders, PORTKEY_GATEWAY_URL


class AgentConfig:
    """Configuration for agent LLM setup"""
    def __init__(self):
        self.portkey_api_key = "hrZ2lmk3CV5ECOp/Cj6FpjBbihy/"
        self.virtual_key = "@GCP-VertexAI-Prod"  # Virtual key for Gemini
        self.model_name = "@GCP-VertexAI-Prod/gemini-2.5-flash"  # Changed to Pro
        self.google_search_enabled = False
    
    def validate_config(self):
        """Validate configuration"""
        if not self.portkey_api_key:
            return False, "PORTKEY_API_KEY not set"
        if not self.virtual_key:
            return False, "Virtual key not set"
        return True, "Configuration valid"


def setup_portkey_llm(config, include_google_search: bool = False) -> ChatOpenAI:
    """Setup the LLM with Portkey configuration.
   
    Args:
        config: AgentConfig instance with Portkey settings
        include_google_search: Whether to enable Google Search grounding (default: False)
    """
    is_valid, message = config.validate_config()
    if not is_valid:
        raise ValueError(message)
   
    # Create Portkey headers using Virtual Key
    portkey_headers = createHeaders(
        api_key=config.portkey_api_key,
        virtual_key=config.virtual_key,
    )
   
    portkey_headers["x-portkey-strict-open-ai-compliance"] = "false"
   
    # Create SSL context that doesn't verify
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
   
    # Create httpx clients
    http_client = httpx.Client(
        verify=False,
        timeout=httpx.Timeout(120.0, connect=10.0),
        follow_redirects=True,
        limits=httpx.Limits(max_keepalive_connections=5, max_connections=10)
    )
 
    extra_body = {
        "strict_open_ai_compliance": False,
        "thinking_config": {
            "include_thoughts": True,
            "thinking_budget": 8192
        }
    }
   
    google_search_enabled = getattr(config, 'google_search_enabled', False) and include_google_search
    if google_search_enabled:
        extra_body["tools"] = [
            {
                "type": "function",
                "function": {
                    "name": "google_search"
                }
            }
        ]
        print("🔍 Google Search grounding enabled for LLM (standalone mode)")
   
    print("🧠 Gemini 2.0 Flash thinking mode enabled (budget: 8192 tokens)")
   
    # Initialize the ChatOpenAI model
    llm = ChatOpenAI(
        api_key="X",
        base_url=PORTKEY_GATEWAY_URL,
        default_headers=portkey_headers,
        model=config.model_name,
        temperature=0.2,
        streaming=True,
        http_client=http_client,
        http_async_client=None,
        extra_body=extra_body
    )
   
    llm.client.http_client = http_client
   
    return llm
 
 
def setup_fast_llm(config) -> ChatOpenAI:
    """Setup a fast LLM for quick tasks like insights and summaries.
    Uses Gemini Flash for faster response times."""
    is_valid, message = config.validate_config()
    if not is_valid:
        raise ValueError(message)
   
    # Create Portkey headers using Virtual Key
    portkey_headers = createHeaders(
        api_key=config.portkey_api_key,
        virtual_key=config.virtual_key,
    )
   
    # Create httpx client with shorter timeout for fast responses
    http_client = httpx.Client(
        verify=False,
        timeout=httpx.Timeout(30.0, connect=5.0),
        follow_redirects=True,
        limits=httpx.Limits(max_keepalive_connections=5, max_connections=10)
    )
   
    # Use Gemini Pro for responses (changed from Flash per user request)
    fast_model = "@GCP-VertexAI-Prod/gemini-2.5-flash"
   
    llm = ChatOpenAI(
        api_key="X",
        base_url=PORTKEY_GATEWAY_URL,
        default_headers=portkey_headers,
        model=fast_model,
        temperature=0.1,
        http_client=http_client,
        http_async_client=None
    )
   
    llm.client.http_client = http_client
   
    return llm
