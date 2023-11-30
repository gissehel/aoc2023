#!/usr/bin/env bash

year="${1}"

if [[ -z "${year}" ]]; then
    echo "Usage: ${0} <year>"
    exit 1
fi

days=$(seq -f "%02g" 1 25)

cat << __END__ > "README.md"

# Advent of Code ${year}

This repository contains propositions for the [Advent of Code ${year}](https://adventofcode.com/${year}) challenges.

__END__

for day in $days; do
    dir="days/${day}"
    mkdir -p "${dir}"

    cat << __END__ >> "README.md"
* [Day ${day}](days/${day}) : https://adventofcode.com/2023/day/${day#0}
__END__

    [ -f "${dir}/README.md" ] || cat << __END__ > "${dir}/README.md"
Day ${day}
======

https://adventofcode.com/${year}/day/${day#0}
__END__

    cat << __END__ > "${dir}/start-challenge.sh"
#!/usr/bin/env bash
pushd ../..
./start-challenge.sh ${day}
popd
__END__
    chmod +x "${dir}/start-challenge.sh"
done

cat << __END__ > "start-challenge.sh"
#!/usr/bin/env bash

day="\${1}"

if [[ -z "\${day}" ]]; then
    echo "Usage: \${0} <day>"
    exit 1
fi

dir="days/\${day}"

if [[ ! -d "\${dir}" ]]; then
    echo "Day [\${day}] does not exist"
    exit 1
fi

input=\$(curl -s "https://adventofcode.com/${year}/day/\${day#0}/input" -H "Cookie: session=\${AOC_SESSION}")

for subpart in 01 02; do
    subdir="\${dir}/part_\${subpart}"
    mkdir -p "\${subdir}"

    cp -r templates/* "\${subdir}"
    echo "\${input}" > "\${subdir}/input/input.txt"
done
__END__


