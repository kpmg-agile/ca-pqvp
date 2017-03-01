#!/usr/bin/env bash
curl -H "Content-Type: application/json" -X POST -d '{"password":"calproc"}' -u neo4j:neo4j http://localhost:7474/user/neo4j/password
