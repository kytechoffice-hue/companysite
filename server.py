import http.server
import os
import urllib.parse

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse URL path
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        
        # Translate to local path
        local_path = self.translate_path(path)
        
        # If it's a directory, look for index.html
        if os.path.isdir(local_path):
            index_path = os.path.join(local_path, 'index.html')
            if os.path.exists(index_path):
                self.path = os.path.join(path, 'index.html')
                return super().do_GET()
        
        # Clean URLs: check if adding .html maps to a file
        if not os.path.exists(local_path) and not path.endswith('.html'):
            html_path = local_path + '.html'
            if os.path.exists(html_path):
                self.path = path + '.html'
                return super().do_GET()
        
        # Serve the file normally if it exists
        if os.path.exists(local_path):
            return super().do_GET()
            
        # Fallback to custom 404.html
        self.send_response(404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.end_headers()
        
        # Read and serve the 404.html file
        err_page_path = os.path.join(os.getcwd(), '404.html')
        if os.path.exists(err_page_path):
            with open(err_page_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.wfile.write(b"404 - File Not Found")

if __name__ == '__main__':
    server_address = ('', PORT)
    httpd = http.server.HTTPServer(server_address, CustomHTTPRequestHandler)
    print(f"Starting server on http://localhost:{PORT}")
    print("Serving clean URLs and custom 404.html page...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
