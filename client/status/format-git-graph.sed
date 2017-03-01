# sed

s/.$/\_END\_/g
s/\_END\_/\<\/div\>\" \+/g
s/^/\"\<div\>/g

# Must split these lines to include a newline character
1 i\
document.write\(

$a\
\"\"\);\

s/\[30m/\<b class='black1'\>/g
s/\[31m/\<b class='red1'\>/g
s/\[32m/\<b class='green1'\>/g
s/\[33m/\<b class='yellow1'\>/g
s/\[34m/\<b class='blue1'\>/g
s/\[35m/\<b class='magenta1'\>/g
s/\[36m/\<b class='cyan1'\>/g
s/\[37m/\<b class='white1'\>/g
s/\[1;30m/\<b class='black2'\>/g
s/\[1;31m/\<b class='red2'\>/g
s/\[1;32m/\<b class='green2'\>/g
s/\[1;33m/\<b class='yellow2'\>/g
s/\[1;34m/\<b class='blue2'\>/g
s/\[1;35m/\<b class='magenta2'\>/g
s/\[1;36m/\<b class='cyan2'\>/g
s/\[1;37m/\<b class='white2'\>/g

s/\[m/\<\/b\>/g

s/\*/\<i class='node'\>\*\<\/i\>/g
s/\\/\<i class='fork'\>\\\\\<\/i\>/g
#s/\//\<i class='fork'\>\/\/\<\/i\>/g
s/\|/<i\>\|\<\/i\>/g


