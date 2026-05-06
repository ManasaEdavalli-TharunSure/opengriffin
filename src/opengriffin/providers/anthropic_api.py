"""Anthropic API provider — same Claude models, pay-per-token billing.

Useful when you have an Anthropic API key but not Claude Max OAuth, or you
want explicit pay-per-token economics.
"""

from __future__ import annotations

import os


class AnthropicAPIProvider:
    name = "Anthropic API"
    supports_tools = True
    supports_skills = False  # The SDK skill loader needs the CLI; raw API doesn't auto-load.

    def __init__(self, model: str = "claude-opus-4-7"):
        try:
            import anthropic
        except ImportError as e:
            raise RuntimeError(
                "Install with: pip install 'opengriffin[anthropic]' (anthropic SDK required)"
            ) from e
        key = os.environ.get("ANTHROPIC_API_KEY")
        if not key:
            raise RuntimeError("ANTHROPIC_API_KEY not set")
        self._client = anthropic.AsyncAnthropic(api_key=key)
        self.model = os.environ.get("OPENGRIFFIN_MODEL", model)

    async def chat(self, messages: list[dict], tools: list | None = None) -> dict:
        kwargs = dict(
            model=self.model,
            max_tokens=4096,
            messages=messages,
        )
        if tools:
            kwargs["tools"] = tools
        resp = await self._client.messages.create(**kwargs)
        text = "".join(b.text for b in resp.content if getattr(b, "type", "") == "text")
        return {
            "content": text,
            "input_tokens": resp.usage.input_tokens,
            "output_tokens": resp.usage.output_tokens,
        }
