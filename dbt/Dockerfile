FROM ghcr.io/dbt-labs/dbt-postgres:1.7.9

# Fix dbt/protobuf incompatibility (dbt 1.7.x expects protobuf 4.x)
RUN pip install --no-cache-dir "protobuf==4.25.3"
