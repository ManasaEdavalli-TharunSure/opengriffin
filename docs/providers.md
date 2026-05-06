# Providers

OpenGriffin supports 21 AI providers. Pick one with `OPENGRIFFIN_PROVIDER=<name>` in your `.env`. Per-chat overrides are available via `/model <provider> [model]` in Telegram.

## Native (full-feature) providers

These run the **Claude Agent SDK** with full access to skills, MCP servers, hooks, and session persistence.

| Provider | `OPENGRIFFIN_PROVIDER` | Required env | Default model |
|---|---|---|---|
| Claude (Max OAuth) | `claude` | _none — uses `~/.claude/.credentials.json`_ | `claude-opus-4-7` |
| Anthropic API | `anthropic` | `ANTHROPIC_API_KEY` | `claude-opus-4-7` |
| Google Gemini | `gemini` | `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) | `gemini-2.0-flash-exp` |
| Cohere | `cohere` | `COHERE_API_KEY` | `command-r-plus-08-2024` |
| AWS Bedrock | `bedrock` | `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` | `us.anthropic.claude-opus-4-7-v1:0` |
| Ollama (local) | `ollama` | _none — `OLLAMA_HOST` defaults to `http://localhost:11434`_ | `llama3.1` |

## OpenAI-compatible providers

These speak the OpenAI Chat Completions protocol. Tools work; skills don't auto-load (skills are a Claude Agent SDK feature).

| Provider | `OPENGRIFFIN_PROVIDER` | Required env | Default model |
|---|---|---|---|
| OpenAI | `openai` | `OPENAI_API_KEY` | `gpt-4o` |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` | `anthropic/claude-opus-4` |
| Azure OpenAI | `azure` | `AZURE_OPENAI_API_KEY` + `AZURE_OPENAI_ENDPOINT` | `gpt-4o` |
| DeepSeek | `deepseek` | `DEEPSEEK_API_KEY` | `deepseek-chat` |
| xAI (Grok) | `xai` | `XAI_API_KEY` | `grok-2-latest` |
| Mistral | `mistral` | `MISTRAL_API_KEY` | `mistral-large-latest` |
| Perplexity | `perplexity` | `PERPLEXITY_API_KEY` | `llama-3.1-sonar-large-128k-online` |
| Together AI | `together` | `TOGETHER_API_KEY` | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |
| Groq | `groq` | `GROQ_API_KEY` | `llama-3.3-70b-versatile` |
| Fireworks AI | `fireworks` | `FIREWORKS_API_KEY` | `accounts/fireworks/models/llama-v3p1-405b-instruct` |
| Cerebras | `cerebras` | `CEREBRAS_API_KEY` | `llama-3.3-70b` |
| NVIDIA NIM | `nvidia` | `NVIDIA_API_KEY` | `meta/llama-3.1-405b-instruct` |
| HuggingFace Inference | `huggingface` | `HUGGINGFACE_API_KEY` | `meta-llama/Llama-3.1-70B-Instruct` |
| Lambda Labs | `lambda` | `LAMBDA_API_KEY` | `hermes-3-llama-3.1-405b-fp8` |
| Novita AI | `novita` | `NOVITA_API_KEY` | `meta-llama/llama-3.1-70b-instruct` |
| Custom | `custom` | `CUSTOM_API_KEY` + `CUSTOM_BASE_URL` | (set `OPENGRIFFIN_MODEL`) |

## Choosing the right provider

| Goal | Pick |
|---|---|
| Easiest setup | `claude` with Claude Max OAuth — no key, full features |
| Cheapest per-token | `groq` or `cerebras` for inference, `deepseek` for serious work |
| Best quality, no cap | `claude` or `anthropic` |
| Million-token context | `gemini` (Gemini 2.5 Pro) |
| Local / offline | `ollama` |
| Hobby project | `openrouter` (one key, 100+ models) |
| Voice agents | `groq` for sub-second latency |

## Picking a model

Override the default with `OPENGRIFFIN_MODEL`:

```bash
OPENGRIFFIN_PROVIDER=anthropic
OPENGRIFFIN_MODEL=claude-haiku-4-5
```

Or per-chat in Telegram:

```
/model openai gpt-4o-mini
/model deepseek deepseek-reasoner
/model -                    # reset to default
```

## Auto-routing across providers

The `routing` MCP server scores each prompt 0–3 and produces a tier-appropriate fallback chain:

- **Tier 0** (trivial / lookup): Groq → Cerebras → Ollama
- **Tier 1** (simple structured): GPT-4o-mini → Claude Haiku → DeepSeek chat → Gemini Flash
- **Tier 2** (standard): Claude Sonnet → GPT-4o → Gemini Pro
- **Tier 3** (hard reasoning): Claude Opus → o1 → DeepSeek Reasoner

The classifier is conservative: anything ambiguous goes up a tier rather than down. Currently routing is exposed as a tool; per-message auto-route is on the roadmap.

## Adding a new provider

See [CONTRIBUTING.md](../CONTRIBUTING.md#adding-a-new-provider). Minimum: copy `openai_compatible.py` shape, add a row to `FLAVORS`, list it in the `__init__.py` catalog, ship a test that mocks the HTTP call.

## Cost notes

OpenGriffin doesn't bill you. Your provider does. We log every run's cost to `usage.jsonl` so `/usage` and `/insights` can show you what each model costs in your real workload. Cheap providers don't lower quality automatically — verify by replaying past sessions through `/replay`.
