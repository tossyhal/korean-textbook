#!/usr/bin/env bash
set -euo pipefail
export AGENT_BROWSER_SESSION=korean-week01-smoke
base=${BASE_URL:-http://127.0.0.1:5173/korean-textbook/}
trap 'agent-browser close >/dev/null' EXIT
agent-browser open "${base}#/lesson/day-01" >/dev/null
agent-browser eval 'localStorage.clear(); location.reload()' >/dev/null
agent-browser wait --text '第1課' >/dev/null
agent-browser fill '#day-01-ex-01 input' 'ㅏ' >/dev/null
agent-browser click '#day-01-ex-01 button' >/dev/null
agent-browser wait --text '正解' >/dev/null
agent-browser eval 'location.reload()' >/dev/null
agent-browser wait --text '第1課' >/dev/null
agent-browser eval 'JSON.parse(localStorage.getItem("korean-textbook-progress-v1")).answerViewedQuestionIds.includes("day-01-ex-01") || (() => {throw Error("answer view not persisted")})()' >/dev/null
agent-browser click '#day-01-ex-01 button' >/dev/null
agent-browser wait --text '答え閲覧後' >/dev/null
agent-browser set viewport 390 844 >/dev/null
agent-browser eval 'document.documentElement.scrollWidth <= innerWidth || (() => {throw Error("mobile overflow")})()' >/dev/null
agent-browser open "${base}#/keyboard" >/dev/null
agent-browser wait --text '韓国語キーボード設定と入力' >/dev/null
agent-browser fill '#reference-keyboard-letter' 'ㅎ' >/dev/null
agent-browser eval 'location.reload()' >/dev/null
agent-browser wait --text '韓国語キーボード設定と入力' >/dev/null
agent-browser eval 'document.querySelector("#reference-keyboard-letter").value === "ㅎ" || (() => {throw Error("keyboard draft not restored")})()' >/dev/null
agent-browser eval 'document.documentElement.scrollWidth <= innerWidth || (() => {throw Error("keyboard mobile overflow")})()' >/dev/null
printf 'week01 smoke passed\n'
