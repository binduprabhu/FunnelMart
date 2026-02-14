with e as (
  select
    session_id,
    user_id,
    device_type,
    timezone,
    utm_source,
    utm_medium,
    utm_campaign,

    min(event_time) as session_start_time,

    min(event_time) filter (where event_name = 'product_view') as first_product_view_time,
    min(event_time) filter (where event_name = 'add_to_cart') as first_add_to_cart_time,
    min(event_time) filter (where event_name = 'checkout_start') as first_checkout_start_time,
    min(event_time) filter (where event_name = 'purchase') as first_purchase_time,

    bool_or(event_name = 'product_view') as did_product_view,
    bool_or(event_name = 'add_to_cart') as did_add_to_cart,
    bool_or(event_name = 'checkout_start') as did_checkout_start,
    bool_or(event_name = 'purchase') as did_purchase
  from analytics.stg_events
  where session_id is not null
  group by 1,2,3,4,5,6,7
)

select
  *,
  extract(epoch from (first_purchase_time - session_start_time))::int as seconds_to_purchase
from e
