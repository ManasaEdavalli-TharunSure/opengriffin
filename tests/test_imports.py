"""Smoke test: every shipped module imports cleanly."""

import importlib

MODULES = [
    "opengriffin",
    "opengriffin.cli",
    "opengriffin.memory",
    "opengriffin.echo_memory",
    "opengriffin.aliases",
    "opengriffin.topics",
    "opengriffin.usage",
    "opengriffin.recall",
    "opengriffin.kanban",
    "opengriffin.tools",
    "opengriffin.skill_hub",
    "opengriffin.skill_strategy",
    "opengriffin.self_healing",
    "opengriffin.workers",
    "opengriffin.pods",
    "opengriffin.genealogy",
    "opengriffin.identity",
    "opengriffin.constraints",
    "opengriffin.routing",
    "opengriffin.drift",
    "opengriffin.dream",
    "opengriffin.predictive",
    "opengriffin.soul_sync",
    "opengriffin.reputation",
    "opengriffin.triggers",
    "opengriffin.webhooks",
    "opengriffin.timelock",
    "opengriffin.deadman",
    "opengriffin.a2a",
    "opengriffin.quorum",
    "opengriffin.replay",
    "opengriffin.zk_proofs",
    "opengriffin.marketplace",
    "opengriffin.capabilities",
    "opengriffin.attest",
    "opengriffin.security_scan",
    "opengriffin.critic",
    "opengriffin.checkpoints",
    "opengriffin.approvals",
    "opengriffin.progress",
    "opengriffin.observe",
    "opengriffin.redact",
    "opengriffin.providers",
    "opengriffin.gateways",
]


def test_every_module_imports():
    for name in MODULES:
        importlib.import_module(name)
