# Production Database Design Proposal

The current prototype stores all substation data as nested JSON in browser localStorage. A production deployment should use a normalized relational database such as PostgreSQL.

## Core Tables

- organizations
- regions
- divisions
- substations
- voltage_levels
- bays
- equipment_types
- equipment
- feeders
- transformers
- meters
- meter_readings
- monthly_reports
- report_status_history
- faults
- trippings
- breakdowns
- maintenance_plans
- maintenance_records
- maintenance_checklist_items
- documents
- photos
- notifications
- users
- roles
- permissions
- user_roles
- audit_logs

## Required Indexes

- `substations(region_id, division_id)`
- `equipment(substation_id, category, status)`
- `meter_readings(meter_id, reading_date)`
- `monthly_reports(substation_id, report_month, status)`
- `faults(substation_id, equipment_id, status, severity, fault_date)`
- `trippings(substation_id, equipment_id, trip_date)`
- `maintenance_records(substation_id, equipment_id, status, scheduled_date)`
- `documents(substation_id, folder, status, expiry_date)`
- `audit_logs(entity_type, entity_id, created_at)`

## Data Integrity Rules

- Use foreign keys for all parent-child relationships.
- Use unique constraints for substation codes, equipment identifiers, and monthly report periods.
- Use database transactions for report submission and approval workflows.
- Store all create/update/delete activity in `audit_logs`.
- Store document and photo binaries in object storage; keep only metadata and signed object keys in the database.
