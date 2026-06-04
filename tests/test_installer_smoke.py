import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
LINUX_IMAGES = [
    ("ubuntu", "ubuntu:24.04"),
    ("debian", "debian:bookworm"),
]


def _require_docker() -> str:
    docker = shutil.which("docker")
    if docker is None:
        pytest.skip("Docker is required for installer smoke tests")

    result = subprocess.run(
        [docker, "info"],
        capture_output=True,
        text=True,
        timeout=20,
        check=False,
    )
    if result.returncode != 0:
        pytest.skip(f"Docker daemon is unavailable: {result.stderr.strip()}")

    return docker


def _current_revision() -> str:
    return subprocess.check_output(
        ["git", "rev-parse", "HEAD"],
        cwd=REPO_ROOT,
        text=True,
    ).strip()


@pytest.mark.parametrize(("distro", "image"), LINUX_IMAGES, ids=[name for name, _ in LINUX_IMAGES])
def test_install_script_smokes_on_linux_distros(distro: str, image: str) -> None:
    if os.getenv("GITHUB_ACTIONS") == "true" and sys.version_info[:2] != (3, 11):
        pytest.skip("installer smoke runs once in the GitHub Actions Python matrix")

    docker = _require_docker()
    revision = _current_revision()
    script = """
        set -euo pipefail
        apt-get update
        DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \\
          bash ca-certificates git python3 python3-pip python3-venv
        HOME="$(mktemp -d)"
        export HOME
        git config --global --add safe.directory /workspace
        git config --global --add safe.directory /workspace/.git
        OPENGRIFFIN_HOME="$(mktemp -d)/opengriffin"
        export OPENGRIFFIN_HOME
        bash /workspace/scripts/install.sh
        test -x "$OPENGRIFFIN_HOME/.venv/bin/opengriffin"
        test -f "$OPENGRIFFIN_HOME/.env"
    """

    result = subprocess.run(
        [
            docker,
            "run",
            "--rm",
            "-v",
            f"{REPO_ROOT}:/workspace:ro",
            "-e",
            "OPENGRIFFIN_REPO_URL=/workspace",
            "-e",
            f"OPENGRIFFIN_REF={revision}",
            image,
            "bash",
            "-lc",
            script,
        ],
        capture_output=True,
        text=True,
        timeout=900,
        check=False,
    )

    assert result.returncode == 0, (
        f"{distro} installer smoke failed\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}"
    )
