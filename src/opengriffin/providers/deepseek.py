"""DeepSeek provider — OpenAI-compatible API at api.deepseek.com.

Models: deepseek-chat, deepseek-reasoner.
"""

from __future__ import annotations

import os


class DeepSeekProvider:
    name = "DeepSeek"
    supports_tools = True
    supports_skills = False

    def __init__(self, model: str | None = None):
        try:
            from openai import AsyncOpenAI
        except ImportError as e:
            raise RuntimeError("Install with: pip install 'opengriffin[deepseek]'") from e
        key = os.environ.get("DEEPSEEK_API_KEY")
        if not key:
            raise RuntimeError("DEEPSEEK_API_KEY not set")
        self._client = AsyncOpenAI(api_key=key, base_url="https://api.deepseek.com/v1")
        self.model = model or os.environ.get("OPENGRIFFIN_MODEL", "deepseek-chat")

    async def chat(self, messages: list[dict], tools: list | None = None) -> dict:
        kwargs = dict(model=self.model, messages=messages)
        if tools:
            kwargs["tools"] = tools
        resp = await self._client.chat.completions.create(**kwargs)
        choice = resp.choices[0]
        return {
            "content": choice.message.content or "",
            "input_tokens": resp.usage.prompt_tokens,
            "output_tokens": resp.usage.completion_tokens,
        }
