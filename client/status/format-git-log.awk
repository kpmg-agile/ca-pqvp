#!/usr/bin/awk

function escape(str, c, len, res) {
    len = length(str)
    res = ""
    for (i = 1; i <= len; i++) {
	c = substr(str, i, 1);
	if (c ~ /[0-9A-Za-z]/)
	    res = res c
	else
	    res = res "&#x00" sprintf("%02X", ord[c]) ";"
    }
    return res
}

BEGIN {
    for (i = 0; i <= 255; i++) {
	ord[sprintf("%c", i)] = i
    }
    url = "https://github.com/kpmg-agile/ca-pqvp/commit/"

    FS=":::"

    printf "document.write('<p>BRANCH / COMMIT</p><h2>%s</h2><hr>", ENVIRON["BUILD_INFO"]
}

{
    printf "<li><code><a href=\x22" url "%s\x22 target=\x22_blank\x22>%s</a></code><small>%s</small><person>%s</person>", $1, $1, $2, $3
    $1=$2=$3=""
    printf "<span>%s</span></li>", escape($0)
}

END {
    printf "%s", "');"
}
