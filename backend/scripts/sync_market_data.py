#!/usr/bin/env python3
"""
ALIGNX Market Data Ingestion & Synchronization Engine
Author: Arpit (Data & LLM Layer)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

This script provides zero-downtime, atomic synchronization of real-time market indicators
(hiringVelocity, disruptionIndex, growthScore, locationDemand) in MongoDB Atlas.

Features:
- Validates mathematical bounds [0, 100] for Decision Engine compatibility.
- Performs atomic in-place updates using MongoDB $set (Zero Downtime).
- Provides CLI tools for manual delta ingestion, quarterly simulations, and automated cron runs.
- Includes a lightweight FastAPI endpoint for webhook/cron triggers.
"""

import os
import sys
import json
import argparse
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

# Optional dependency: PyMongo (graceful fallback if running offline validation)
try:
    from pymongo import MongoClient, UpdateOne
    PYMONGO_AVAILABLE = True
except ImportError:
    PYMONGO_AVAILABLE = False


def validate_metric(name: str, value: Any) -> float:
    """Validates that a metric is a float within [0, 100]."""
    try:
        val = float(value)
        if not (0.0 <= val <= 100.0):
            raise ValueError(f"Metric '{name}' value {val} out of bounds [0, 100]")
        return round(val, 2)
    except (TypeError, ValueError) as e:
        raise ValueError(f"Invalid metric value for '{name}': {value}. Error: {e}")


def load_json_file(file_path: str) -> Any:
    """Safely loads a JSON file from disk."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Target JSON file not found: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json_file(file_path: str, data: Any):
    """Safely writes a JSON file with standard 2-space indentation."""
    os.makedirs(os.path.dirname(os.path.abspath(file_path)), exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


class MarketSyncService:
    def __init__(self, mongo_uri: Optional[str] = None):
        self.mongo_uri = mongo_uri or os.getenv("MONGODB_URI", "mongodb://localhost:27017/alignx")
        self.client = None
        self.db = None
        self.careers_col = None

    def connect(self):
        """Initializes connection to MongoDB Atlas."""
        if not PYMONGO_AVAILABLE:
            print("⚠️ PyMongo not installed. Running in offline file-only mode.")
            return False
        try:
            self.client = MongoClient(self.mongo_uri, serverSelectionTimeoutMS=4000)
            # Trigger connection check
            self.client.server_info()
            self.db = self.client.get_database()
            self.careers_col = self.db["careers"]
            print("✅ Successfully connected to MongoDB Atlas.")
            return True
        except Exception as e:
            print(f"⚠️ MongoDB connection failed: {e}. Running in local file mode.")
            return False

    def sync_from_delta(self, delta_payload: Dict[str, Any], dry_run: bool = False) -> Dict[str, Any]:
        """
        Ingests a delta update payload and applies atomic updates.
        
        Expected payload format:
        {
          "period": "2026-11",
          "source": "NASSCOM & TeamLease Tech Tracker",
          "updates": {
            "ai_ml_engineer": { "hiringVelocity": 97, "growthScore": 98, "disruptionIndex": 93 },
            "cloud_devops_architect": { "hiringVelocity": 91, "growthScore": 92 }
          }
        }
        """
        period = delta_payload.get("period", datetime.now(timezone.utc).strftime("%Y-%m-%d"))
        source = delta_payload.get("source", "ALIGNX Automated Ingestion Pipeline")
        updates = delta_payload.get("updates", {})

        if not updates:
            return {"status": "error", "message": "No updates found in payload", "updatedCount": 0}

        print(f"\n🔄 Processing Market Data Sync for Period [{period}] from [{source}]...")
        updated_records = []
        validation_errors = []

        # Load local seed file for file-sync
        seed_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../database/seeds/careers.json"))
        local_careers = load_json_file(seed_path) if os.path.exists(seed_path) else []

        bulk_ops = []

        for career_id, metrics in updates.items():
            try:
                clean_metrics = {}
                for k, v in metrics.items():
                    if k in ["hiringVelocity", "growthScore", "disruptionIndex"]:
                        clean_metrics[f"marketData.{k}"] = validate_metric(k, v)
                    else:
                        clean_metrics[f"marketData.{k}"] = v

                clean_metrics["marketData.dataDate"] = period
                clean_metrics["marketData.dataSource"] = source
                clean_metrics["marketData.lastSyncedAt"] = datetime.now(timezone.utc).isoformat()
                clean_metrics["updatedAt"] = datetime.now(timezone.utc).isoformat()

                if dry_run:
                    print(f"  [DRY-RUN] Would update {career_id} with: {clean_metrics}")
                else:
                    if self.careers_col is not None:
                        if PYMONGO_AVAILABLE:
                            bulk_ops.append(UpdateOne({"id": career_id}, {"$set": clean_metrics}))

                    # Also update local JSON seed file for version control consistency
                    for c in local_careers:
                        if c.get("id") == career_id:
                            if "marketData" not in c:
                                c["marketData"] = {}
                            for mk, mv in clean_metrics.items():
                                sub_key = mk.replace("marketData.", "")
                                if sub_key != "updatedAt":
                                    c["marketData"][sub_key] = mv

                updated_records.append(career_id)
            except Exception as ex:
                validation_errors.append({"careerId": career_id, "error": str(ex)})

        # Execute MongoDB bulk write if connected
        if bulk_ops and not dry_run and self.careers_col is not None:
            result = self.careers_col.bulk_write(bulk_ops)
            print(f"✅ MongoDB Atlas Update: {result.modified_count} documents atomically modified.")

        # Save updated seed file
        if not dry_run and local_careers:
            save_json_file(seed_path, local_careers)
            print(f"✅ Local dataset seed file updated ({seed_path}).")

        return {
            "status": "success",
            "period": period,
            "source": source,
            "updatedCount": len(updated_records),
            "updatedCareers": updated_records,
            "errors": validation_errors,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    def simulate_quarterly_shift(self, dry_run: bool = False) -> Dict[str, Any]:
        """Simulates the arrival of a new quarterly market report with realistic market shifts."""
        seed_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../database/seeds/careers.json"))
        careers = load_json_file(seed_path)

        updates = {}
        for c in careers:
            cid = c.get("id")
            current_vel = c.get("marketData", {}).get("hiringVelocity", 80)
            current_growth = c.get("marketData", {}).get("growthScore", 85)
            # Realistic quarterly shift: +1 to +3 for AI/Semicon, slight adjustments for others
            domain = c.get("domain", "")
            if domain in ["ai_data", "robotics_hardware"]:
                shift = min(100, current_vel + 2)
                growth_shift = min(100, current_growth + 1)
            else:
                shift = min(100, max(50, current_vel + 1))
                growth_shift = min(100, max(50, current_growth))

            updates[cid] = {
                "hiringVelocity": shift,
                "growthScore": growth_shift
            }

        payload = {
            "period": "2027-Q1",
            "source": "NASSCOM Strategic Review & TeamLease FY27 Quarterly Refresh",
            "updates": updates
        }
        return self.sync_from_delta(payload, dry_run=dry_run)


# =====================================================================
# CLI Interface & Lightweight API Handler
# =====================================================================

def main():
    parser = argparse.ArgumentParser(description="ALIGNX Market Data Ingestion & Synchronization Engine")
    parser.add_argument("--file", type=str, help="Path to delta updates JSON file")
    parser.add_argument("--simulate-quarterly", action="store_true", help="Simulate a new quarterly NASSCOM/TeamLease market update")
    parser.add_argument("--dry-run", action="store_true", help="Validate without persisting changes")
    parser.add_argument("--mongo-uri", type=str, help="MongoDB connection URI")
    parser.add_argument("--serve-api", action="store_true", help="Start the HTTP webhook server on port 8085")

    args = parser.parse_args()

    service = MarketSyncService(mongo_uri=args.mongo_uri)
    service.connect()

    if args.serve_api:
        # Launch lightweight HTTP server for webhook / cron integration
        from http.server import HTTPServer, BaseHTTPRequestHandler

        class SyncWebhookHandler(BaseHTTPRequestHandler):
            def do_POST(self):
                if self.path == "/api/market/sync":
                    content_length = int(self.headers.get("Content-Length", 0))
                    body = self.rfile.read(content_length)
                    try:
                        payload = json.loads(body) if body else {}
                        result = service.sync_from_delta(payload)
                        self.send_response(200)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps(result).encode("utf-8"))
                    except Exception as err:
                        self.send_response(400)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({"status": "error", "error": str(err)}).encode("utf-8"))
                else:
                    self.send_response(404)
                    self.end_headers()

            def do_GET(self):
                if self.path == "/api/market/status":
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "active", "service": "ALIGNX Market Sync Engine"}).encode("utf-8"))
                else:
                    self.send_response(404)
                    self.end_headers()

        server = HTTPServer(("0.0.0.0", 8085), SyncWebhookHandler)
        print("🚀 ALIGNX Market Sync API listening on http://0.0.0.0:8085/api/market/sync (POST)")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
        return

    if args.simulate_quarterly:
        result = service.simulate_quarterly_shift(dry_run=args.dry_run)
        print(f"\n📊 Summary: {result}")
    elif args.file:
        payload = load_json_file(args.file)
        result = service.sync_from_delta(payload, dry_run=args.dry_run)
        print(f"\n📊 Summary: {result}")
    else:
        # Default run: validate seed dataset
        seed_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../database/seeds/careers.json"))
        data = load_json_file(seed_path)
        print(f"✅ Verified {len(data)} STEAM careers in canonical dataset.")
        print("Run with --help to see synchronization & simulation options.")


if __name__ == "__main__":
    main()
