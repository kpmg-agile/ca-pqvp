#!/usr/bin/env bash

urlencode() {
    # urlencode <string>
    old_lc_collate=$LC_COLLATE
    LC_COLLATE=C

    local length="${#1}"
    for (( i = 0; i < length; i++ )); do
        local c="${1:i:1}"
        case $c in
            [a-zA-Z0-9.~_-]) printf "$c" ;;
            *) printf '%%%02X' "'$c" ;;
        esac
    done

    LC_COLLATE=$old_lc_collate
}

# BUILD_INFO = branch / commit
export BUILD_INFO=$(git rev-parse --abbrev-ref HEAD)"  /  "$(git describe --long --dirty)

# git log
git log -n 20 --pretty=format:"%h:::%ad:::%an:::%s" | awk -f format-git-log.awk > git-log.js

# git graph
script -q /dev/null git --no-pager log -n 20 --graph | tr -d "\033" | sed  -E -f format-git-graph.sed > git-graph.js
