# Star Stitcher V2: Database Backup and Recovery Guide

To prevent data loss on customers profiles, sizing measurements, and custom order history, configure daily backups for your Supabase PostgreSQL database.

---

## 1. Automated Backups via Supabase (Recommended)

Supabase projects automatically back up database tables:
* **Free Tier:** Daily backups are created but require database pause recovery; standard automated backups are a paid upgrade.
* **Pro Tier:** Supabase automatically creates daily snapshots and retains them for 7 days. You can restore snapshots directly from the **Database > Backups** dashboard panel.

---

## 2. Manual Backups (pg_dump)

You can create a local SQL snapshot file using standard PostgreSQL utility tools.

### Prerequisites
Install PostgreSQL client command line tools (`postgresql-client`) on your machine.

### Command Template to Create Backup
```bash
pg_dump -h db.yourproject.supabase.co -U postgres -d postgres -F p -f star_stitcher_backup_$(date +%F).sql
```
*Enter your database password when prompted. This generates a plain text SQL file with database schema and tables content.*

---

## 3. Database Restoration

To restore a snapshot SQL file into a fresh or existing database instance:

### Caution
Restoration will overwrite existing records. It is highly recommended to run backups before applying snapshots.

### Command Template to Restore Backup
```bash
psql -h db.yourproject.supabase.co -U postgres -d postgres -f star_stitcher_backup_XXXX-XX-XX.sql
```
