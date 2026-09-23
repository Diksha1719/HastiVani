class SpeechService:
    """
    Helper service for server-side speech metadata or TTS audio generation if needed.
    Primary real-time TTS is executed via browser SpeechSynthesis API on client.
    """
    def format_speech_text(self, gesture: str, translation: str) -> str:
        if not gesture or gesture in ["No Hand", "Ready", "Unknown"]:
            return ""
        return translation if translation else gesture

speech_service = SpeechService()
