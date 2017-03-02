#!/bin/bash -eu
# Cleanly refresh the database by rebuilding the docker image and restarting the stack
docker stack rm dev-stack
docker build --no-cache=true -f docker/Dockerfile-db -t calproc-db:1 .
docker deploy -c docker/dev-stack.yml dev-stack

echo "Waiting for database host..."
ELAPSED=0
while true; do
    sleep 5
    ELAPSED=$((ELAPSED + 5))

    UP=0
    if curl -s -I http://localhost:7474 | grep -q "200 OK"; then
        UP=$((UP + 1))
    fi

    if [ "$UP" -eq "1" ]; then
       echo "All hosts are available after $ELAPSED seconds"

       $PWD/db/scripts/local/set-neo4j-password.sh
       docker exec -it $(docker ps --filter='name=dev-stack_db' --format '{{.ID}}') refresh.sh
       echo dev-stack update complete and running
       exit 0
    else
       echo "Only $UP hosts up so far [${ELAPSED}s]"
       continue
    fi
done

