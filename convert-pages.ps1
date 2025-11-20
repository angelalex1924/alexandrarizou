# Script to convert React Router pages to Next.js format

$pages = @(
    @{src="src\pages\Gallery.tsx"; dest="app\gallery\page.tsx"},
    @{src="src\pages\Booking.tsx"; dest="app\booking\page.tsx"},
    @{src="src\pages\Auth.tsx"; dest="app\auth\page.tsx"},
    @{src="src\pages\Admin.tsx"; dest="app\admin\page.tsx"},
    @{src="src\pages\Profile.tsx"; dest="app\profile\page.tsx"}
)

foreach ($page in $pages) {
    $content = Get-Content $page.src -Raw
    
    # Add "use client" directive at the top
    if ($content -notmatch '^\s*"use client"') {
        $content = '"use client";' + "`n`n" + $content
    }
    
    # Replace react-router-dom Link with next/link
    $content = $content -replace 'import \{ Link \} from "react-router-dom";', 'import Link from "next/link";'
    $content = $content -replace "import \{ Link \} from 'react-router-dom';", "import Link from 'next/link';"
    
    # Replace useNavigate with useRouter
    $content = $content -replace 'import \{ useNavigate \} from "react-router-dom";', 'import { useRouter } from "next/navigation";'
    $content = $content -replace "import \{ useNavigate \} from 'react-router-dom';", "import { useRouter } from 'next/navigation';"
    $content = $content -replace 'const navigate = useNavigate\(\);', 'const router = useRouter();'
    $content = $content -replace 'navigate\(([^)]+)\)', 'router.push($1)'
    
    # Replace Link to= with href=
    $content = $content -replace '<Link to=', '<Link href='
    
    # Change export default to export default function
    $content = $content -replace 'const (\w+) = \(\) => \{', 'export default function $1() {'
    $content = $content -replace 'export default (\w+);', ''
    
    # Write to destination
    Set-Content -Path $page.dest -Value $content
    Write-Host "Converted $($page.src) to $($page.dest)"
}

Write-Host "Conversion complete!"
