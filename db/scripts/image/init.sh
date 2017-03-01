#!/usr/bin/env bash
# not used - for reference
neo4j-admin set-initial-password calproc
neo4j start
curl -H "Content-Type: application/json" -X POST -d '{"password":"calproc"}' -u neo4j:neo4j http://localhost:7474/user/neo4j/password
