"""Deploy dist/ to GitHub Pages via Git Data API."""
import base64, json, urllib.request, os, sys, time, ssl

TOKEN = os.environ.get("GH_TOKEN", "")
if not TOKEN:
    print("Error: GH_TOKEN environment variable not set")
    sys.exit(1)

REPO = "zydarChen/efund-mot-system"
API = f"https://api.github.com/repos/{REPO}"
DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")
ctx = ssl.create_default_context()

def api(method, path, data=None, retries=5):
    url = f"{API}/{path}" if not path.startswith("http") else path
    body = json.dumps(data).encode() if data else None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, data=body, method=method)
            req.add_header("Authorization", f"token {TOKEN}")
            req.add_header("Content-Type", "application/json")
            with urllib.request.urlopen(req, timeout=120, context=ctx) as resp:
                return json.loads(resp.read()), resp.status
        except urllib.error.HTTPError as e:
            return json.loads(e.read()), e.code
        except Exception as e:
            if attempt < retries - 1:
                wait = 2 ** attempt
                print(f"\n    Retry {attempt+1}/{retries-1} in {wait}s...", end=" ", flush=True)
                time.sleep(wait)
            else:
                print(f"\n    FAILED: {e}")
                sys.exit(1)

print("=== Creating blobs ===")
tree_entries = []
for root, dirs, files in os.walk(DIST):
    for fname in sorted(files):
        fpath = os.path.join(root, fname)
        repo_path = os.path.relpath(fpath, DIST)
        with open(fpath, "rb") as f:
            content_b64 = base64.b64encode(f.read()).decode()
        print(f"  {repo_path} ({os.path.getsize(fpath):,} B)...", end=" ", flush=True)
        resp, code = api("POST", "git/blobs", {"content": content_b64, "encoding": "base64"})
        if "sha" not in resp:
            print(f"FAILED: {resp}"); sys.exit(1)
        print("OK")
        tree_entries.append({"path": repo_path, "mode": "100644", "type": "blob", "sha": resp["sha"]})

print(f"\n=== Creating tree ({len(tree_entries)} files) ===")
resp, _ = api("POST", "git/trees", {"tree": tree_entries})
if "sha" not in resp:
    print(f"FAILED: {resp}"); sys.exit(1)
tree_sha = resp["sha"]
print(f"  {tree_sha}")

print("\n=== Creating commit ===")
resp, _ = api("POST", "git/commits", {"message": "deploy: update", "tree": tree_sha})
if "sha" not in resp:
    print(f"FAILED: {resp}"); sys.exit(1)
commit_sha = resp["sha"]
print(f"  {commit_sha}")

print("\n=== Updating gh-pages ===")
resp, code = api("PATCH", "git/refs/heads/gh-pages", {"sha": commit_sha, "force": True})
print("  Done!" if code == 200 else f"  {code}: {resp}")

print(f"\nDeployed: https://zydarchen.github.io/efund-mot-system/")
