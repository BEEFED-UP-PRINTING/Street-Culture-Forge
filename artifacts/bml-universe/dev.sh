#!/bin/bash
# Start Vite in the background, detached from the PTY/stdin that the workflow
# manager provides. Use nohup so SIGHUP doesn't reach Vite, and redirect all
# I/O away from the PTY so EIO errors don't crash the server.
# A foreground `sleep infinity` keeps the workflow process alive so the river
# service can detect port $PORT and mark the workflow as running.

PIDFILE=/tmp/bml-vite.pid
LOGFILE=/tmp/bml-vite.log

cleanup() {
    if [ -f "$PIDFILE" ]; then
        kill "$(cat "$PIDFILE")" 2>/dev/null
        rm -f "$PIDFILE"
    fi
}
trap cleanup EXIT TERM INT

# Kill any leftover server from a previous run
if [ -f "$PIDFILE" ]; then
    kill "$(cat "$PIDFILE")" 2>/dev/null
    rm -f "$PIDFILE"
fi

# Launch Vite in the background, fully detached from the PTY
nohup pnpm --filter @workspace/bml-universe run dev > "$LOGFILE" 2>&1 &
echo $! > "$PIDFILE"

echo "BML Universe dev server starting (pid $(cat "$PIDFILE"))..."
echo "Logs: $LOGFILE"

# Keep the workflow process alive so the river service detects the open port
sleep infinity
