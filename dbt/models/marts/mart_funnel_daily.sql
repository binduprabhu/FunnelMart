with s as (
  select
    date_trunc('day', session_start_time)::date as event_date,
    device_type,
    timezone,
    utm_source,
    utm_medium,
    utm_campaign,

    count(*) as sessions,
    count(*) filter (where did_product_view) as sessions_with_product_view,
    count(*) filter (where did_add_to_cart) as sessions_with_add_to_cart,
    count(*) filter (where did_checkout_start) as sessions_with_checkout_start,
    count(*) filter (where did_purchase) as sessions_with_purchase
  from analytics.fct_funnel_steps
  group by 1,2,3,4,5,6
)

select
  *,
  case when sessions_with_product_view = 0 then 0
       else sessions_with_add_to_cart::numeric / sessions_with_product_view end as pv_to_cart_rate,
  case when sessions_with_add_to_cart = 0 then 0
       else sessions_with_checkout_start::numeric / sessions_with_add_to_cart end as cart_to_checkout_rate,
  case when sessions_with_checkout_start = 0 then 0
       else sessions_with_purchase::numeric / sessions_with_checkout_start end as checkout_to_purchase_rate
from s
