with e as (
  select
    user_id,
    min(event_time) as first_seen_at,
    min(event_time) filter (where event_name = 'purchase') as first_purchase_at,

    max(device_type) as device_type,
    max(timezone) as timezone,
    max(utm_source) as utm_source,
    max(utm_medium) as utm_medium,
    max(utm_campaign) as utm_campaign
  from analytics.stg_events
  where user_id is not null
  group by 1
)

select
  *,
  (first_purchase_at is not null) as is_purchaser
from e
