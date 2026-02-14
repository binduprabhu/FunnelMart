select
  date_trunc('day', purchase_time)::date as order_date,
  device_type,
  timezone,
  utm_source,
  utm_medium,
  utm_campaign,

  count(*) as orders,
  sum(revenue) as revenue,
  avg(revenue) as aov,
  sum(items_count) as items_sold,
  avg(items_count) as avg_items_per_order,
  sum(discount) as discount_total
from {{ ref('fct_purchases') }}
group by 1,2,3,4,5,6
