#!/usr/bin/env bash

for test_name in "${@}"; do
    dir="tests/${test_name}"
    mkdir -p "${dir}"

    touch "${dir}/input.txt"
    touch "${dir}/expected.txt"
done
