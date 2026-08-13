# SupportOS AI — Production Backup & Disaster Recovery Runbook

## Overview
This runbook details production procedures for data backup, point-in-time recovery, service failover, and disaster recovery across Supabase PostgreSQL, Qdrant Vector DB, and FastAPI backend services.

---

## 1. Database Backup & Recovery (Supabase PostgreSQL)

### Daily Automated Backups
- **Frequency**: Automated daily WAL archiving with Point-in-Time Recovery (PITR) up to 7–30 days depending on Supabase tier.
- **Manual Physical Backup Command**:
  ```bash
  pg_dump -h <DB_HOST> -U postgres -d postgres -F c -b -v -f "supportos_backup_$(date +%Y%m%d_%H%M%S).dump"
  ```
- **Restore Command**:
  ```bash
  pg_restore -h <DB_HOST> -U postgres -d postgres -v "supportos_backup_TIMESTAMP.dump"
  ```

### Verification & Testing
- **Quarterly Recovery Drills**: Test restoring dumps into an isolated staging environment and verify row count integrity on `users`, `conversations`, and `tickets`.

---

## 2. Vector DB Backup & Snapshotting (Qdrant)

### Collection Snapshot Creation
- Snapshot command for `support_docs` collection:
  ```bash
  curl -X POST "http://<QDRANT_HOST>:6333/collections/support_docs/snapshots" \
       -H "api-key: <QDRANT_API_KEY>"
  ```

### Collection Snapshot Restoration
- Restore snapshot into new/existing Qdrant cluster:
  ```bash
  curl -X POST "http://<QDRANT_HOST>:6333/collections/support_docs/snapshots/upload" \
       -H "Content-Type: application/octet-stream" \
       -H "api-key: <QDRANT_API_KEY>" \
       --data-binary "@snapshot_name.snapshot"
  ```

---

## 3. External API Failover & Outage Procedures

| Dependency | Strategy / Mitigation | Implemented State |
| :--- | :--- | :--- |
| **Google Gemini API** | Fallback to default helpful error response, logs exception in Structured Logger, prevents application crash. | **IMPLEMENTED** |
| **Qdrant Vector DB** | Catches `QdrantException`, returns empty context list, allows LLM to answer using base system instructions. | **IMPLEMENTED** |
| **Supabase Database** | Returns `HTTP 500` with clean sanitized API exception wrapper. | **IMPLEMENTED** |

---

## 4. Rollback Plan

1. **Frontend Deployment Rollback**:
   - Revert deployment commit on Vercel / Cloudflare Pages / Docker container tag to previous release artifact.
2. **Backend FastAPI Rollback**:
   - Roll back container image tag using `docker service update --image supportos-backend:vPREVIOUS`.
3. **Database Migration Rollback**:
   - Execute down migration scripts matching the rollback target version.
