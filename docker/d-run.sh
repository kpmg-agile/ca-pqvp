#!/usr/bin/env bash

# run an isolated container with the webstart image
# docker run --rm -p 8080:8080 --name "web" webstart:3

# deploy a docker stack using a compose file (v3)
docker deploy -c docker-compose.yml pqvp-stack
echo
echo webstart running on http://localhost:8080
echo neo4j running on http://localhost:7474
echo neo4j /data directory persisted at ./db
echo
