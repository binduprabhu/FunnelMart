-- Create the raw_events table for FunnelMart analytics
CREATE TABLE IF NOT EXISTS raw_events (
    event_id UUID PRIMARY KEY,
    event_name TEXT NOT NULL,
    event_time TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ NOT NULL,
    ingestion_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    device_type TEXT,
    timezone TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    app_version TEXT,
    schema_version INT NOT NULL DEFAULT 1,
    properties JSONB NOT NULL DEFAULT '{}'::JSONB,
    -- Kafka metadata
    kafka_topic TEXT,
    kafka_partition INT,
    kafka_offset BIGINT
);

-- Essential indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_events_time ON raw_events (event_time);
CREATE INDEX IF NOT EXISTS idx_events_name_time ON raw_events (event_name, event_time);
CREATE INDEX IF NOT EXISTS idx_events_user_time ON raw_events (user_id, event_time);
CREATE INDEX IF NOT EXISTS idx_events_session_time ON raw_events (session_id, event_time);

-- Optional indexes for common filters
CREATE INDEX IF NOT EXISTS idx_events_utm_time ON raw_events (utm_source, event_time);
CREATE INDEX IF NOT EXISTS idx_events_device_time ON raw_events (device_type, event_time);

-- GIN index for deep property filtering
CREATE INDEX IF NOT EXISTS idx_events_properties ON raw_events USING GIN (properties);
