# Script to fix asset imports for Next.js

$files = Get-ChildItem -Path "app" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace asset imports from @/assets to /assets
    $content = $content -replace 'import\s+(\w+)\s+from\s+"@/assets/([^"]+)";', 'const $1 = "/assets/$2";'
    $content = $content -replace "import\s+(\w+)\s+from\s+'@/assets/([^']+)';", 'const $1 = "/assets/$2";'
    
    # Remove .src references since we're using strings now
    $content = $content -replace '(\w+)\.src', '$1'
    
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Fixed imports in $($file.Name)"
}

Write-Host "Asset import fixes complete!"
