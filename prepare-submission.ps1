[CmdletBinding()]
param(
    [string]$ProjectRoot = $PSScriptRoot,
    [string]$OutputArchive = (Join-Path $PSScriptRoot 'AirBnB-Capstone-submission.zip')
)

$ErrorActionPreference = 'Stop'
$resolvedRoot = (Resolve-Path $ProjectRoot).Path
$stagingRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("AirBnB-Capstone-submission-" + [guid]::NewGuid().ToString('N'))
$stagingProject = Join-Path $stagingRoot 'AirBnB-Capstone'

try {
    New-Item -ItemType Directory -Path $stagingProject -Force | Out-Null
    $robocopyArgs = @(
        $resolvedRoot, $stagingProject, '/E',
        '/XD', 'node_modules', 'dist', '.git', '.idea', '.vscode', 'client', 'server',
        '/XF', '.env', '*.log', '*.zip',
        '/NFL', '/NDL', '/NJH', '/NJS', '/NP'
    )
    & robocopy @robocopyArgs | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE" }

    foreach ($helper in @('prepare-submission.ps1')) {
        Remove-Item (Join-Path $stagingProject $helper) -Force -ErrorAction SilentlyContinue
    }

    foreach ($requiredFile in @('README.md', 'SUBMISSION-CHECKLIST.md')) {
        if (-not (Test-Path (Join-Path $stagingProject $requiredFile) -PathType Leaf)) {
            throw "Required file is missing: $requiredFile"
        }
    }
    foreach ($requiredFolder in @('frontend', 'admin', 'backend')) {
        if (-not (Test-Path (Join-Path $stagingProject $requiredFolder) -PathType Container)) {
            throw "Required folder is missing: $requiredFolder"
        }
    }

    if (Test-Path $OutputArchive) { Remove-Item $OutputArchive -Force }
    Compress-Archive -Path (Join-Path $stagingProject '*') -DestinationPath $OutputArchive -CompressionLevel Optimal
    Write-Host "Submission archive created: $OutputArchive" -ForegroundColor Green
}
finally {
    if (Test-Path $stagingRoot) { Remove-Item $stagingRoot -Recurse -Force -ErrorAction SilentlyContinue }
}
