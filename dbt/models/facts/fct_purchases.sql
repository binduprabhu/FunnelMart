select
  order_id,
  user_id,
  session_id,
  event_time as purchase_time,
  cart_value as revenue,
  items_count,
  payment_method,
  discount,
  device_type,
  timezone,
  utm_source,
  utm_medium,
  utm_campaign,
  app_version
from analytics.stg_events
where event_name = 'purchase'
  and order_id is not null
