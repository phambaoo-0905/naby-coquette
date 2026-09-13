#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write(f"[Naby Coquette Web] {args[0]} - {args[1]}\n")

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            url = f"http://localhost:{PORT}"
            print("=" * 60)
            print("  🌸 NABY COQUETTE WARDROBE SERVER ĐANG CHẠY 🌸")
            print(f"  👉 Xem trực tiếp tại: {url}")
            print("  Nhấn Ctrl + C để dừng máy chủ bất cứ lúc nào.")
            print("=" * 60)
            try:
                webbrowser.open(url)
            except Exception:
                pass
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 48:
            print(f"Cổng {PORT} đang bận, thử mở http://localhost:{PORT} trên trình duyệt...")
        else:
            raise
