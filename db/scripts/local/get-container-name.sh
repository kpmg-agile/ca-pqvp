#!/usr/bin/env bash
export DB_CONTAINER=$(docker ps | grep dev-stack_db | awk '{ print $1}')
echo DB_CONTAINER=$DB_CONTAINER
