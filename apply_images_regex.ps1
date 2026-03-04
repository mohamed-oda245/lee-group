$dir = "c:\Users\dell\Downloads\Lee Presentation\lee-group-website\pages"
$files = Get-ChildItem -Path $dir -Filter "service-*.html"

foreach ($file in $files) {
    if ($file.Name -match "downhole") { $img = "unnamed (1).jpeg" }
    elseif ($file.Name -match "wireline") { $img = "unnamed (2).jpeg" }
    elseif ($file.Name -match "inspection") { $img = "unnamed (3).jpeg" }
    elseif ($file.Name -match "bop") { $img = "unnamed (4).jpeg" }
    elseif ($file.Name -match "machine-shop") { $img = "unnamed (5).jpeg" }
    elseif ($file.Name -match "chemical") { $img = "Chemical.png" }
    else { continue }
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    $imageTag = "<img src=`"../images/$img`" alt=`"Service Image`" style=`"width:100%; height:420px; object-fit:cover; border-radius:12px; margin-top:2.5rem; box-shadow: 0 8px 30px rgba(0,0,0,0.15);`" class=`"fade-in`">"
    
    if (-not $content.Contains("Service Image")) {
        $content = $content -replace '(?i)(<p class="fade-in"[^>]*>[\s\S]*?<\/p>)', "`$1`n                $imageTag"
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    }
}

$part = Join-Path $dir "partners.html"
if (Test-Path $part) {
    $c = Get-Content $part -Raw -Encoding UTF8
    $imageTag2 = "<img src=`"../images/unnamed (7).jpeg`" alt=`"Service Image`" style=`"width:100%; height:420px; object-fit:cover; border-radius:12px; margin-top:2.5rem; box-shadow: 0 8px 30px rgba(0,0,0,0.15);`" class=`"fade-in`">"
    if (-not $c.Contains("Service Image")) {
        $c = $c -replace '(?i)(<p data-i18n="partners.strategic_subtitle">[^<]*<\/p>)', "`$1`n                $imageTag2"
        Set-Content -Path $part -Value $c -Encoding UTF8
    }
}

$abt = Join-Path $dir "about.html"
if (Test-Path $abt) {
    $c2 = Get-Content $abt -Raw -Encoding UTF8
    $imageTag3 = "<img src=`"../images/unnamed (6).jpeg`" alt=`"Service Image`" style=`"width:100%; height:420px; object-fit:cover; border-radius:12px; margin-top:2.5rem; box-shadow: 0 8px 30px rgba(0,0,0,0.15);`" class=`"fade-in`">"
    if (-not $c2.Contains("Service Image")) {
        $c2 = $c2 -replace '(?i)(<p class="fade-in" data-i18n="about.story_p4">[^<]*<\/p>)', "`$1`n                $imageTag3"
        Set-Content -Path $abt -Value $c2 -Encoding UTF8
    }
}
