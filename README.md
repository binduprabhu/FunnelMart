# FunnelMart 🚀

FunnelMart is a modern e-commerce platform with a built-in end-to-end analytics pipeline. It tracks user behavior, processes events in real-time, transforms data using dbt, and visualizes business metrics through Metabase.

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), TypeScript, Vanilla CSS.
- **Event Streaming**: [Redpanda](https://redpanda.com/) (Kafka-compatible).
- **Database**: [PostgreSQL](https://www.postgresql.org/).
- **Transformation**: [dbt](https://www.getdbt.com/) (Data Build Tool).
- **Visualization**: [Metabase](https://www.metabase.com/).
- **Infrastructure**: Docker & Docker Compose.

## 🏗 Project Architecture

1.  **Event Emission**: Next.js frontend emits events (page views, product views, purchases) via a custom `AnalyticsContext`.
2.  **Ingestion**: Logic in `/api/events` produces events to a Redpanda topic.
3.  **Consumption**: A Node.js consumer service (`scripts/consumer.ts`) reads events from Redpanda and stores them in Postgres (`raw_events`).
4.  **Transformation**: dbt cleans and aggregates raw data into Staging, Fact, and Mart layers within the `analytics` schema.
5.  **Visualization**: Metabase connects to Postgres to visualize business-ready metrics from the Mart layer.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### 2. Start Infrastructure
Run the following commands to start the database, Redpanda, and Metabase:
```bash
docker compose -f docker-compose.db.yml up -d
docker compose -f docker-compose.kafka.yml up -d
docker compose -f docker-compose.metabase.yml up -d
```

### 3. Run the Application
```bash
npm install
npm run dev
```

### 4. Run the Event Consumer
```bash
npx tsx scripts/consumer.ts
```

### 5. Run dbt Transformations
```bash
docker compose -f docker-compose.dbt.yml run --rm dbt run
```

## 🔗 Key Endpoints & Ports

| Service | URL | Description |
| :--- | :--- | :--- |
| **FunnelMart App** | [http://localhost:3000](http://localhost:3000) | Main E-commerce Frontend |
| **Kafka UI** | [http://localhost:8081](http://localhost:8081) | Redpanda/Kafka Monitor |
| **Metabase** | [http://localhost:3001](http://localhost:3001) | Analytics Dashboards |
| **Postgres** | `localhost:5432` | Data Warehouse |

## 📊 Analytics Layers (dbt)

- **Staging**: `stg_events` (JSONB extraction & typing).
- **Facts**: `fct_purchases`, `fct_sessions`, `fct_funnel_steps`, `fct_users`.
- **Marts**: `mart_funnel_daily`, `mart_revenue_daily`, `mart_retention_weekly`.

---
*Created by Antigravity for FunnelMart.*
