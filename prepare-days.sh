#!/usr/bin/env bash

days=$(seq -f "%02g" 1 25)
for day in $days; do
    dir="days/${day}"
    mkdir -p "${dir}"

    [ -f "${dir}/README.md" ] || cat << __END__ > "${dir}/README.md"
Day ${day}
======

https://adventofcode.com/2023/day/${day#0}
__END__

    cat << __END__ > "${dir}/start-challenge.sh"
#!/usr/bin/env bash
pushd ../..
./start-challenge.sh ${day}
popd
__END__
    chmod +x "${dir}/start-challenge.sh"
done