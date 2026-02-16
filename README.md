# FunnelMart 🚀

FunnelMart is a modern e-commerce platform with a built-in end-to-end analytics pipeline. It tracks user behavior, processes events in real-time, transforms data using dbt, and visualizes business metrics through Metabase.

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), TypeScript, Vanilla CSS.
- **Event Streaming**: [Apache Kafka](https://kafka.apache.org/) (KRaft mode).
- **Database**: [PostgreSQL](https://www.postgresql.org/).
- **Transformation**: [dbt](https://www.getdbt.com/) (Data Build Tool).
- **Visualization**: [Metabase](https://www.metabase.com/).
- **Infrastructure**: Docker & Docker Compose.
- **Cloud Deployment**: AWS CloudFormation (EC2, VPC, IAM).

## 🏗 Project Architecture

1.  **Event Emission**: Next.js frontend emits events (page views, product views, purchases) via a custom `AnalyticsContext`.
2.  **Ingestion**: Logic in `/api/events` produces events to an Apache Kafka topic.
3.  **Consumption**: A Node.js consumer service (`scripts/consumer.ts`) reads events from Kafka and stores them in Postgres (`raw_events`).
4.  **Transformation**: dbt cleans and aggregates raw data into Staging, Fact, and Mart layers within the `analytics` schema.
5.  **Visualization**: Metabase connects to Postgres to visualize business-ready metrics from the Mart layer.

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### 2. Start Infrastructure
Run the following commands to start the database, Kafka, and Metabase:
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

## ☁️ AWS Production Deployment

For deploying the entire stack to AWS, a CloudFormation template is provided in `infra/cloudformation.yml`. This template provisions:
- An **EC2 Instance** (`t3.small`) with 2GB Swap for build stability.
- **VPC & Networking** configuration.
- **SSM access** for secure remote management.
- A unified **Docker Compose** environment.

## 🔗 Key Endpoints & Ports (Local)

| Service | URL | Description |
| :--- | :--- | :--- |
| **FunnelMart App** | [http://localhost:3000](http://localhost:3000) | Main E-commerce Frontend |
| **Kafka UI** | [http://localhost:8081](http://localhost:8081) | Kafka Monitoring Tool |
| **Metabase** | [http://localhost:3001](http://localhost:3001) | Analytics Dashboards |
| **Postgres** | `localhost:5432` | Data Warehouse |

## 📊 Analytics Layers (dbt)

- **Staging**: `stg_events` (JSONB extraction & typing).
- **Facts**: `fct_purchases`, `fct_sessions`, `fct_funnel_steps`, `fct_users`.
- **Marts**: `mart_funnel_daily`, `mart_revenue_daily`, `mart_retention_weekly`.

---
*Created by Antigravity for FunnelMart.*
