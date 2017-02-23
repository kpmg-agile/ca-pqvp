#!/bin/bash -eu

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
       exit 0
    else
       echo "Only $UP hosts up so far [${ELAPSED}s]"
       continue
    fi
done
