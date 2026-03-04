$dir = "c:\Users\dell\Downloads\Lee Presentation\lee-group-website\pages"
$imageMap = [ordered]@{
    "service-downhole.html" = "unnamed (1).jpeg"
    "service-wireline.html" = "unnamed (2).jpeg"
    "service-inspection.html" = "unnamed (3).jpeg"
    "service-bop.html" = "unnamed (4).jpeg"
    "service-machine-shop.html" = "unnamed (5).jpeg"
    "service-chemical.html" = "Chemical.png"
    "about.html" = "unnamed (6).jpeg"
    "partners.html" = "unnamed (7).jpeg"
}

foreach ($item in $imageMap.GetEnumerator()) {
    $file = $item.Name
    $image = $item.Value
    $fullPath = Join-Path $dir $file
    
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        $modified = $false
        
        if ($file -match "service-wireline.html") {
            $content = $content.Replace('📊', '<i class="fa-solid fa-chart-column"></i>')
            $content = $content.Replace('💥', '<i class="fa-solid fa-bullseye"></i>')
            $content = $content.Replace('📈', '<i class="fa-solid fa-chart-line"></i>')
            $content = $content.Replace('🔗', '<i class="fa-solid fa-link"></i>')
            $content = $content.Replace('⚡', '<i class="fa-solid fa-bolt"></i>')
            $modified = $true
        }

        $imageTag = "`n                <img src=`"../images/$image`" alt=`"Lee Group Professional Image`" style=`"width:100%; height:420px; object-fit:cover; border-radius:12px; margin-top:2.5rem; box-shadow: 0 8px 30px rgba(0,0,0,0.15);`" class=`"fade-in`">"

        if ($content -notmatch "Lee Group Professional Image") {
            if ($file.StartsWith("service-")) {
                $content = $content -replace '(?i)(<div class="container--narrow"[^>]*>[\s\S]*?<\/p>)', "`$1$imageTag"
                $modified = $true
            } elseif ($file -eq "about.html") {
                $content = $content -replace '(?i)(<p class="fade-in" data-i18n="about.story_p4">[\s\S]*?<\/p>)', "`$1$imageTag"
                $modified = $true
            } elseif ($file -eq "partners.html") {
                $content = $content -replace '(?i)(<p class="fade-in" data-i18n="partners.intro">[\s\S]*?<\/p>)', "`$1$imageTag"
                $modified = $true
            }
        }

        if ($modified) {
            Set-Content -Path $fullPath -Value $content -Encoding UTF8
            Write-Host "Updated $file"
        }
    }
}
