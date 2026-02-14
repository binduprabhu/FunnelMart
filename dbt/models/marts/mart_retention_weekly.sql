with user_first_purchase as (
  select
    user_id,
    date_trunc('week', min(purchase_time))::date as cohort_week
  from {{ ref('fct_purchases') }}
  group by 1
),

user_activity_weeks as (
  select
    user_id,
    date_trunc('week', event_time)::date as activity_week
  from {{ ref('stg_events') }}
  group by 1,2
),

cohort_activity as (
  select
    u.cohort_week,
    a.activity_week,
    (a.activity_week - u.cohort_week) / 7 as week_number,
    count(distinct u.user_id) as users_active
  from user_first_purchase u
  join user_activity_weeks a
    on a.user_id = u.user_id
   and a.activity_week >= u.cohort_week
  group by 1,2,3
),

cohort_sizes as (
  select
    cohort_week,
    count(distinct user_id) as cohort_size
  from user_first_purchase
  group by 1
)

select
  c.cohort_week,
  c.week_number,
  s.cohort_size,
  c.users_active,
  (c.users_active::numeric / nullif(s.cohort_size, 0)) as retention_rate
from cohort_activity c
join cohort_sizes s using (cohort_week)
order by 1,2
