with s as (
  select
    session_id,
    user_id,
    min(event_time) as session_start_time,
    max(event_time) as session_end_time,

    -- choose representative context for the session
    max(device_type) as device_type,
    max(timezone) as timezone,
    max(utm_source) as utm_source,
    max(utm_medium) as utm_medium,
    max(utm_campaign) as utm_campaign,

    count(*) as events_count,
    count(*) filter (where event_name = 'product_view') as product_views,
    count(*) filter (where event_name = 'add_to_cart') as add_to_cart,
    count(*) filter (where event_name = 'checkout_start') as checkout_start,
    count(*) filter (where event_name = 'purchase') as purchases
  from analytics.stg_events
  where session_id is not null
  group by 1,2
)

select
  *,
  extract(epoch from (session_end_time - session_start_time))::int as session_duration_seconds
from s
