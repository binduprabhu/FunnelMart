select
  date_trunc('day', event_time)::date as event_date,
  event_name,
  device_type,
  timezone,
  utm_source,
  utm_medium,
  utm_campaign,
  count(*) as events,
  count(distinct user_id) as users,
  count(distinct session_id) as sessions
from analytics.stg_events
group by 1,2,3,4,5,6,7
