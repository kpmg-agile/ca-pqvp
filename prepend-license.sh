#!/usr/bin/env bash
 cat $PWD/license.txt "$1" > "$1.new"
 mv "$1.new" "$1"
 echo "Prepended $1"
