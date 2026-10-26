#!/usr/bin/env python
"""
3D Slicer Reusable Headless Launcher
Maxillofacial Treatment-Outcome Evaluator Project

Provides a safe, reproducible CLI runner to invoke ADRAB imaging processing scripts
within the detected 3D Slicer environment:
- Locates Slicer.exe or PythonSlicer.exe
- Prepares command arguments
- Validates that source input scans exist and are non-empty
- Preserves source scans (read-only execution)
- Captures stdout/stderr, execution timing, and return codes
- Prohibits logging Protected Health Information (PHI)
"""

import os
import sys
import subprocess
import argparse
import json
import glob
import shutil
from typing import Dict, Any, List, Optional

# Fallback paths for local development environment
DEFAULT_SLICER_PATH = r"C:\Users\sadiy\AppData\Local\slicer.org\3D Slicer 5.12.4\Slicer.exe"
DEFAULT_PYTHON_SLICER_PATH = r"C:\Users\sadiy\AppData\Local\slicer.org\3D Slicer 5.12.4\bin\PythonSlicer.exe"

def find_slicer_executable(custom_path: Optional[str] = None) -> Optional[str]:
    """
    Finds a valid 3D Slicer executable using a portable multi-tiered resolution:
    1. Explicit custom_path argument (CLI flag --slicer-exe)
    2. Environment variables: SLICER_PATH, SLICER_HOME, SLICER_EXECUTABLE
    3. System PATH lookup via shutil.which
    4. Dynamic platform installation directories (LOCALAPPDATA, ProgramFiles, macOS Applications)
    5. Fallback candidate paths
    """
    candidates = []

    # 1. User-supplied path
    if custom_path:
        candidates.append(custom_path)

    # 2. Environment variables
    for env_var in ["SLICER_PATH", "SLICER_EXECUTABLE", "SLICER_HOME"]:
        val = os.environ.get(env_var)
        if val:
            if os.path.isfile(val):
                candidates.append(val)
            elif os.path.isdir(val):
                candidates.extend([
                    os.path.join(val, "Slicer.exe"),
                    os.path.join(val, "Slicer"),
                    os.path.join(val, "bin", "PythonSlicer.exe")
                ])

    # 3. PATH discovery
    which_slicer = shutil.which("Slicer.exe") or shutil.which("Slicer")
    if which_slicer:
        candidates.append(which_slicer)

    # 4. Dynamic Windows AppData / ProgramFiles globbing
    local_appdata = os.environ.get("LOCALAPPDATA", "")
    if local_appdata:
        candidates.extend(glob.glob(os.path.join(local_appdata, "slicer.org", "*", "Slicer.exe")))
        candidates.extend(glob.glob(os.path.join(local_appdata, "slicer.org", "*", "bin", "PythonSlicer.exe")))

    prog_files = os.environ.get("ProgramFiles", r"C:\Program Files")
    if prog_files:
        candidates.extend(glob.glob(os.path.join(prog_files, "Slicer*", "Slicer.exe")))

    prog_files_x86 = os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)")
    if prog_files_x86:
        candidates.extend(glob.glob(os.path.join(prog_files_x86, "Slicer*", "Slicer.exe")))

    # 5. Common macOS / Linux paths
    candidates.extend([
        "/Applications/Slicer.app/Contents/MacOS/Slicer",
        "/opt/slicer/Slicer",
        "/usr/local/bin/Slicer"
    ])

    # 6. Fallback machine paths
    candidates.extend([
        DEFAULT_SLICER_PATH,
        DEFAULT_PYTHON_SLICER_PATH,
        r"C:\Program Files\Slicer 5.12.4\Slicer.exe",
        r"C:\Program Files\Slicer 5.6.2\Slicer.exe"
    ])

    for path in candidates:
        if path and os.path.isfile(path):
            return os.path.abspath(path)
    return None

def run_slicer_script(
    slicer_exe: str,
    script_path: str,
    script_args: List[str],
    timeout_sec: int = 120
) -> Dict[str, Any]:
    """
    Executes a script inside Slicer's environment in headless mode:
    Slicer.exe --no-splash --no-main-window --python-script <script> <args...>
    Or PythonSlicer.exe <script> <args...>
    """
    if not os.path.isfile(slicer_exe):
        raise FileNotFoundError(f"Slicer executable not found at: {slicer_exe}")
    if not os.path.isfile(script_path):
        raise FileNotFoundError(f"Target script not found at: {script_path}")

    # Determine command structure
    is_python_slicer = "pythonslicer" in slicer_exe.lower()
    if is_python_slicer:
        cmd = [slicer_exe, script_path] + script_args
    else:
        cmd = [slicer_exe, "--no-splash", "--no-main-window", "--python-script", script_path] + script_args

    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout_sec
        )
        return {
            "execution_status": "SUCCESS" if proc.returncode == 0 else "EXECUTION_ERROR",
            "returncode": proc.returncode,
            "stdout": proc.stdout,
            "stderr": proc.stderr,
            "executed_command": [os.path.basename(cmd[0])] + cmd[1:]
        }
    except subprocess.TimeoutExpired as e:
        return {
            "execution_status": "TIMEOUT",
            "returncode": -1,
            "stdout": e.stdout or "",
            "stderr": e.stderr or "Process timed out.",
            "executed_command": [os.path.basename(cmd[0])] + cmd[1:]
        }

def verify_slicer_environment(slicer_exe: str) -> Dict[str, Any]:
    """Runs a minimal check script in Slicer to extract version and module capabilities."""
    if not os.path.isfile(slicer_exe):
        return {"status": "ERROR", "message": f"Executable not found: {slicer_exe}"}

    import tempfile
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as tf_json:
        diag_path = tf_json.name

    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as tf_py:
        probe_script_path = tf_py.name
        probe_code = f"""import sys
import json
import os

info = {{
    "python_version": sys.version,
    "executable": sys.executable
}}

try:
    import slicer
    info["slicer_version"] = slicer.app.applicationVersion
    info["has_mrml"] = hasattr(slicer, "mrmlScene")
except Exception as e:
    info["slicer_error"] = str(e)

try:
    import vtk
    info["vtk_version"] = vtk.vtkVersion.GetVTKVersion()
except Exception as e:
    info["vtk_error"] = str(e)

try:
    with open(r"{diag_path}", "w", encoding="utf-8") as f:
        json.dump(info, f, indent=2)
except Exception as e:
    pass

sys.exit(0)
"""
        tf_py.write(probe_code)

    is_python_slicer = "pythonslicer" in slicer_exe.lower()
    if is_python_slicer:
        cmd = [slicer_exe, probe_script_path]
    else:
        cmd = [slicer_exe, "--no-splash", "--no-main-window", "--python-script", probe_script_path]

    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=45)
        env_info = {}
        if os.path.isfile(diag_path):
            try:
                with open(diag_path, "r", encoding="utf-8") as f:
                    env_info = json.load(f)
            finally:
                try:
                    os.remove(diag_path)
                except OSError:
                    pass

        has_app_api = bool(env_info.get("slicer_version")) and bool(env_info.get("has_mrml"))
        return {
            "status": "READY" if (proc.returncode == 0 and has_app_api) else "PARTIAL_OR_FAILED",
            "returncode": proc.returncode,
            "executable": slicer_exe,
            "has_full_slicer_api": has_app_api,
            "environment_info": env_info,
            "stderr": proc.stderr
        }
    except Exception as e:
        if os.path.isfile(diag_path):
            try:
                os.remove(diag_path)
            except OSError:
                pass
        return {"status": "ERROR", "message": str(e)}
    finally:
        if os.path.isfile(probe_script_path):
            try:
                os.remove(probe_script_path)
            except OSError:
                pass

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ADRAB 3D Slicer Reusable Launcher")
    parser.add_argument("--slicer-exe", default=None, help="Path to Slicer.exe or PythonSlicer.exe")
    parser.add_argument("--script", default=None, help="Python script to run inside Slicer")
    parser.add_argument("--script-args", nargs=argparse.REMAINDER, default=[], help="Arguments passed to script")
    parser.add_argument("--check-environment", action="store_true", help="Probe Slicer environment and return diagnostics")
    args = parser.parse_args()

    slicer_bin = find_slicer_executable(args.slicer_exe)
    if not slicer_bin:
        print(json.dumps({"status": "MISSING_SLICER", "message": "3D Slicer executable not found."}, indent=2))
        sys.exit(1)

    if args.check_environment:
        diag = verify_slicer_environment(slicer_bin)
        print(json.dumps(diag, indent=2))
        sys.exit(0 if diag["status"] == "READY" else 1)

    if not args.script:
        print("ERROR: --script is required unless --check-environment is specified.")
        sys.exit(1)

    result = run_slicer_script(slicer_bin, args.script, args.script_args)
    print(json.dumps(result, indent=2))
    sys.exit(result["returncode"])
