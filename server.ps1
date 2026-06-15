# PowerShell static file server with clean URL support and custom 404 fallback
# Usage: .\server.ps1 [Port]
param (
    [int]$Port = 8000
)

$listener = New-Object System.Net.HttpListener
$url = "http://localhost:$Port/"
$listener.Prefixes.Add($url)

try {
    $listener.Start()
    Write-Host "Starting server on $url" -ForegroundColor Green
    Write-Host "Serving clean URLs and custom 404.html page..." -ForegroundColor Cyan
    Write-Host "Press [Ctrl+C] to stop the server." -ForegroundColor Yellow
} catch {
    Write-Error "Failed to start listener: $_"
    exit
}

# Content-Types mapping
$contentTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".webp"  = "image/webp"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".gif"   = "image/gif"
    ".svg"   = "image/svg+xml"
    ".woff2" = "font/woff2"
    ".woff"  = "font/woff"
    ".ttf"   = "font/ttf"
    ".xml"   = "application/xml; charset=utf-8"
    ".txt"   = "text/plain; charset=utf-8"
}

# Keep running until Ctrl+C
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Parse request path
        $path = $request.Url.LocalPath
        
        # Decode URL path
        $path = [System.Uri]::UnescapeDataString($path)
        
        # Translate to local path
        $localPath = Join-Path $PSScriptRoot $path.TrimStart('/')

        # If it's a directory, look for index.html
        if (Test-Path $localPath -PathType Container) {
            $localPath = Join-Path $localPath "index.html"
        }

        # Clean URLs: check if adding .html maps to a file
        if (!(Test-Path $localPath -PathType Leaf) -and !$localPath.EndsWith(".html")) {
            $htmlPath = $localPath + ".html"
            if (Test-Path $htmlPath -PathType Leaf) {
                $localPath = $htmlPath
            }
        }

        # Serve the file if it exists
        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = $contentTypes[$ext]
            if ($null -eq $contentType) {
                $contentType = "application/octet-stream"
            }
            
            $response.ContentType = $contentType
            $response.StatusCode = 200
            
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # Fallback to custom 404.html
            $response.StatusCode = 404
            $response.ContentType = "text/html; charset=utf-8"
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            
            $errPagePath = Join-Path $PSScriptRoot "404.html"
            if (Test-Path $errPagePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($errPagePath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        }
        
        $response.Close()
    } catch {
        # Catch normal stopping/interruption
        if ($listener.IsListening) {
            Write-Host "Error handling request: $_" -ForegroundColor Red
        }
    }
}

$listener.Close()
Write-Host "Server stopped." -ForegroundColor Yellow
