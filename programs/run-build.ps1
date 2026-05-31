# Build dos programas Solana do Kora via Docker (Windows).
#
# Por que Docker: o build BPF da Solana e' instavel no Windows nativo.
# Por que esse wrapper: chama a imagem oficial backpackapp/build:v0.30.1
# (Anchor 0.30.1 + Solana 1.18 testados juntos) e roda docker-build.sh, que
# usa o workaround `cargo-build-sbf --tools-version v1.52` para fugir do erro
# "edition2024 is required" causado pelo platform-tools velho da imagem.
#
# Uso (a partir da pasta programs/):
#   .\run-build.ps1
#
# Pre-requisito: Docker Desktop rodando.

$ErrorActionPreference = "Stop"
$here = $PSScriptRoot

# Confere que o daemon do Docker esta de pe
docker info --format '{{.ServerVersion}}' > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker nao esta rodando. Abra o Docker Desktop e tente de novo." -ForegroundColor Red
    exit 1
}

Write-Host "==> Buildando programas do Kora no container..." -ForegroundColor Cyan
docker run --rm `
    -v "${here}:/workspace" `
    -v kora-cargo-registry:/root/.cargo/registry `
    -w /workspace `
    backpackapp/build:v0.30.1 `
    bash docker-build.sh

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==> Build OK. Binarios em target/deploy/, IDLs em target/idl/." -ForegroundColor Green
} else {
    Write-Host "`n==> Build falhou (exit $LASTEXITCODE)." -ForegroundColor Red
    exit $LASTEXITCODE
}
