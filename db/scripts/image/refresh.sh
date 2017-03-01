#!/usr/bin/env bash
/var/lib/neo4j/bin/cypher-shell -u neo4j -p calproc < /var/lib/neo4j/scripts/LoadCSV.cql
