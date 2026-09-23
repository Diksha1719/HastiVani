from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import settings
from app.routers.recognition import router as recognition_router

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("hastvaani.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="HastVaani - Real-time Indian Sign Language (ISL) recognition API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local development and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router under /api prefix
app.include_router(recognition_router, prefix=settings.API_PREFIX)

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"API endpoints available under {settings.API_PREFIX}")

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": "Because Every Voice Deserves to Be Heard",
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
