@echo off
echo ========================================
echo ESP32 Car Controller - Starting Server
echo ========================================
echo.
echo Server will start at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"

REM Try Python with specific binding to avoid Unicode error
python -c "import http.server, socketserver, socket; socket.getfqdn = lambda x: 'localhost'; Handler = http.server.SimpleHTTPRequestHandler; httpd = socketserver.TCPServer(('127.0.0.1', 8000), Handler); print('Server running at http://127.0.0.1:8000'); print('Press Ctrl+C to stop'); httpd.serve_forever()"

pause
