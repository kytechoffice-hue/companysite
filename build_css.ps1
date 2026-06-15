# PowerShell script to compile/minify styles.dev.css to styles.css
# Usage: .\build_css.ps1

$inputFile = Join-Path $PSScriptRoot "styles.dev.css"
$outputFile = Join-Path $PSScriptRoot "styles.css"

Write-Host "Rebuilding stylesheet..." -ForegroundColor Cyan

if (Test-Path $inputFile) {
    Write-Host "Reading dev stylesheet: $inputFile"
    $css = [System.IO.File]::ReadAllText($inputFile)
    
    Write-Host "Minifying stylesheet..."
    
    # 1. Remove comments
    $css = [System.Text.RegularExpressions.Regex]::Replace($css, "/\*[\s\S]*?\*/", "")
    
    # 2. Remove newlines and tabs
    $css = $css.Replace("`r", "").Replace("`n", "").Replace("`t", "")
    
    # 3. Compress multiple spaces to a single space
    $css = [System.Text.RegularExpressions.Regex]::Replace($css, "\s+", " ")
    
    # 4. Remove unnecessary spaces around operators and punctuation
    $css = [System.Text.RegularExpressions.Regex]::Replace($css, "\s*([\{\}\:\;\,])\s*", '$1')
    
    # 5. Trim leading/trailing whitespace
    $css = $css.Trim()
    
    Write-Host "Writing minified stylesheet: $outputFile"
    [System.IO.File]::WriteAllText($outputFile, $css)
    
    $origSize = (Get-Item $inputFile).Length
    $newSize = (Get-Item $outputFile).Length
    $percent = [Math]::Round((1 - ($newSize / $origSize)) * 100, 1)
    
    Write-Host "CSS Rebuilt successfully!" -ForegroundColor Green
    Write-Host "Original: $origSize bytes"
    Write-Host "Minified: $newSize bytes (Reduced by $percent%)"
} else {
    Write-Error "Error: Development stylesheet not found at $inputFile"
}
