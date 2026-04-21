import os
import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch


CHATBOT_DIR = Path(__file__).resolve().parents[1]
if str(CHATBOT_DIR) not in sys.path:
    sys.path.insert(0, str(CHATBOT_DIR))

os.environ.setdefault("OPENAI_API_KEY", "test-key")
os.environ.setdefault("SITE_BASE_URL", "https://example.com")

import openai_chatbot


class FetchContentSummaryTests(unittest.TestCase):
    def setUp(self):
        openai_chatbot.fetch_content_summary.cache.clear()

    def tearDown(self):
        openai_chatbot.fetch_content_summary.cache.clear()

    def test_fetch_content_summary_uses_cached_session(self):
        fake_response = MagicMock()
        fake_response.json.return_value = [
            {
                "title": "Test Post",
                "url": "/blog/test-post",
                "description": "Test description",
            }
        ]

        with patch.object(openai_chatbot.cached_session, "get", return_value=fake_response) as mocked_get:
            with patch("openai_chatbot.requests.session", side_effect=AssertionError("unexpected fresh session")):
                summary = openai_chatbot.fetch_content_summary()

        mocked_get.assert_called_once_with("https://example.com/api/content", timeout=10)
        self.assertIn("[Test Post](/blog/test-post)", summary)


if __name__ == "__main__":
    unittest.main()
