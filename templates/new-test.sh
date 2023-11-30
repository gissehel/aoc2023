#!/usr/bin/env bash

test_name="${1}"
dir="tests/${test_name}"
mkdir -p "${dir}"

touch "${dir}/input.txt"
touch "${dir}/expected.txt"
