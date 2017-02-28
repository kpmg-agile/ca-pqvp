#!/usr/bin/env bash
/var/lib/neo4j/bin/cypher-shell -u api -p api < /var/lib/neo4j/data/scripts/LoadCSV.cql
