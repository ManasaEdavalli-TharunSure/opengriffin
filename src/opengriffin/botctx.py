"""Shared bot context — singleton state that MCP tools and webhooks can read.

Set once at startup in bot.py, read everywhere else. Avoids passing the
Telegram Bot, scheduler, etc. through every function signature.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from apscheduler.schedulers.asyncio import AsyncIOScheduler
    from telegram import Bot
    from telegram.ext import Application


@dataclass
class BotContext:
    bot: Optional["Bot"] = None
    app: Optional["Application"] = None
    scheduler: Optional["AsyncIOScheduler"] = None
    allowed_users: set[int] = field(default_factory=set)
    home_chat_id: Optional[str] = None


CTX = BotContext()


def set_context(*, bot, app, scheduler, allowed_users, home_chat_id) -> None:
    CTX.bot = bot
    CTX.app = app
    CTX.scheduler = scheduler
    CTX.allowed_users = set(allowed_users)
    CTX.home_chat_id = str(home_chat_id) if home_chat_id else None
