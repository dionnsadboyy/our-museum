$folders = @(

"assets/images",
"assets/videos",
"assets/music",
"assets/icons",
"assets/fonts",

"shared/css",
"shared/js",
"shared/components",

"pages/splash",
"pages/welcome",
"pages/login",
"pages/lobby",

"pages/gallery",
"pages/gallery/album",
"pages/gallery/detail",
"pages/gallery/upload",

"pages/cinema",
"pages/cinema/media",
"pages/cinema/detail",
"pages/cinema/upload",

"pages/archive",
"pages/archive/list",
"pages/archive/detail",
"pages/archive/create",

"pages/timeline",
"pages/timeline/year",
"pages/timeline/detail",

"pages/future",

"pages/secret",

"pages/music",

"pages/statistics",

"pages/capsule",
"pages/capsule/create",
"pages/capsule/locked",
"pages/capsule/open",

"pages/map",
"pages/map/location",

"pages/guestbook"

)

foreach($folder in $folders){

    New-Item -ItemType Directory -Force -Path $folder | Out-Null

}

$pageFolders = @(

"pages/splash",
"pages/welcome",
"pages/login",
"pages/lobby",

"pages/gallery",
"pages/gallery/album",
"pages/gallery/detail",
"pages/gallery/upload",

"pages/cinema",
"pages/cinema/media",
"pages/cinema/detail",
"pages/cinema/upload",

"pages/archive",
"pages/archive/list",
"pages/archive/detail",
"pages/archive/create",

"pages/timeline",
"pages/timeline/year",
"pages/timeline/detail",

"pages/future",

"pages/secret",

"pages/music",

"pages/statistics",

"pages/capsule",
"pages/capsule/create",
"pages/capsule/locked",
"pages/capsule/open",

"pages/map",
"pages/map/location",

"pages/guestbook"

)

foreach($page in $pageFolders){

$html = @"
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Our Museum</title>

<link rel="stylesheet" href="style.css">

</head>

<body>

</body>

<script src="script.js"></script>

</html>
"@

Set-Content "$page/index.html" $html

New-Item "$page/style.css" -Force | Out-Null

New-Item "$page/script.js" -Force | Out-Null

}

Write-Host ""
Write-Host "======================================="
Write-Host " OUR MUSEUM CREATED SUCCESSFULLY"
Write-Host "======================================="