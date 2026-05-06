---
name: web-scrape
description: Use when the user wants to extract structured data from a website — combines requests, BeautifulSoup, and Playwright fallback.
license: Apache-2.0
author: OpenGriffin
---

# Web scraping

Pick the cheapest tool that works:

1. **Static HTML** → `requests` + `BeautifulSoup`.
2. **JS-rendered** → `playwright` headless browser.
3. **Behind login / dynamic** → `playwright` with persistent context.

## Static path

```python
import requests
from bs4 import BeautifulSoup
r = requests.get(url, headers={"User-Agent": "OpenGriffin/0.1"}, timeout=15)
r.raise_for_status()
soup = BeautifulSoup(r.text, "html.parser")
titles = [h2.text.strip() for h2 in soup.select("article h2")]
```

## JS-rendered path

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(url, wait_until="networkidle")
    titles = page.eval_on_selector_all("article h2", "els => els.map(e => e.innerText)")
    browser.close()
```

## Etiquette + safety

- Respect `robots.txt`. Use `urllib.robotparser` if uncertain.
- Rate-limit: at most 1 request/second per domain unless permitted.
- Set a real User-Agent that identifies you.
- Don't scrape behind logins without explicit permission.
- Cache responses; don't re-hit URLs you already have.

## Anti-patterns

- Scraping at full bandwidth — gets you blocked.
- Brittle CSS selectors based on auto-generated class names — they change.
- Scraping when an official API exists.
