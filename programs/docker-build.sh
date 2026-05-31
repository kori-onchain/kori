#!/usr/bin/env bash
# Build dos programas Solana do Kora dentro do container.
#
# POR QUE ESSE SCRIPT EXISTE:
#   `anchor build` / `anchor test` falham com "edition2024 is required" porque
#   a imagem backpackapp/build:v0.30.1 traz platform-tools v1.41 (rustc 1.75),
#   e o mpl-bubblegum 2.1.1 (dep do kora_business/kora_credit) exige toolchain
#   mais novo. O fix e' forcar platform-tools v1.52 no build via cargo-build-sbf
#   (o `anchor build` nao aceita a flag --tools-version).
#
# USO (a partir da pasta programs/, no host):
#   docker run --rm \
#     -v "$PWD:/workspace" \
#     -v kora-cargo-registry:/root/.cargo/registry \
#     -w /workspace \
#     backpackapp/build:v0.30.1 \
#     bash docker-build.sh
#
# No Windows/PowerShell, use ./run-build.ps1 (wrapper que chama isso).
set -euo pipefail

TOOLS_VERSION="${TOOLS_VERSION:-v1.52}"
PROGRAMS=(kora_pool kora_business kora_credit)

echo "==> 1/2 Compilando os .so com platform-tools ${TOOLS_VERSION}"
cargo-build-sbf --tools-version "${TOOLS_VERSION}"

echo "==> 2/2 Gerando IDLs"
mkdir -p target/idl
for p in "${PROGRAMS[@]}"; do
  echo "    - ${p}"
  anchor idl build -p "${p}" -o "target/idl/${p}.json"
done

echo "==> OK. Artefatos:"
ls -la target/deploy/*.so
ls -la target/idl/*.json
