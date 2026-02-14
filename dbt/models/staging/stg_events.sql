with base as (
  select
    event_id,
    event_name,
    event_time,
    ingestion_time,
    user_id,
    session_id,
    device_type,
    timezone,
    utm_source,
    utm_medium,
    utm_campaign,
    app_version,
    schema_version,
    properties
  from public.raw_events
)

select
  *,
  -- Common property extracts (nullable)
  properties->>'page' as page,
  properties->>'referrer' as referrer,

  properties->>'product_id' as product_id,
  properties->>'category' as product_category,

  nullif(properties->>'payment_method','') as payment_method,
  nullif(properties->>'order_id','') as order_id,
  nullif(properties->>'reason','') as failure_reason,

  -- Numeric extracts (safe casts)
  (properties->>'price')::numeric as price,
  (properties->>'quantity')::int as quantity,
  (properties->>'cart_value')::numeric as cart_value,
  (properties->>'items_count')::int as items_count,
  coalesce((properties->>'discount')::numeric, 0) as discount
from base
