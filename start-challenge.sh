#!/usr/bin/env bash

day="${1}"

if [[ -z "${day}" ]]; then
    echo "Usage: ${0} <day>"
    exit 1
fi

dir="days/${day}"

if [[ ! -d "${dir}" ]]; then
    echo "Day [${day}] does not exist"
    exit 1
fi

input=$(curl -s "https://adventofcode.com/2018/day/${day#0}/input" -H "Cookie: session=${AOC_SESSION}")

for subpart in 01 02; do
    subdir="${dir}/part_${subpart}"
    mkdir -p "${subdir}"

    cp -r templates/* "${subdir}"
    echo "${input}" > "${subdir}/input/input.txt"
done
