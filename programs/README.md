# Programas Solana do Kora

Workspace Anchor com 3 programas:

| Programa        | Program ID                                     | O que faz                                              |
| --------------- | ---------------------------------------------- | ------------------------------------------------------ |
| `kora_pool`     | `7i5RcmG4gwHgftiHTut2vWPsowYsAo9ZBdRvQuc6hjyB` | Pool de liquidez / cotas (kUSDC), vault, recebíveis    |
| `kora_business` | `E2LPGxULGzSypzM4h9H5sSXmo3DgBQuFjCUf1wpJvW4L` | Comércio: perfil + recebível como cNFT (mpl-bubblegum) |
| `kora_credit`   | `2yhkji6YeS9r3qUbUfmJQVbMmwke7zSjR2pjCam71woD` | Crédito / parcelamento (CPI no pool)                   |

Versões fixadas: **Anchor 0.30.1**, **Solana 1.18**, **anchor-lang 0.30.1**.

---

## TL;DR — como buildar

Pré-requisito: **Docker Desktop rodando**. Não precisa instalar Rust/Solana/Anchor no Windows.

```powershell
cd programs
.\run-build.ps1
```

Saída esperada (depois de ~5–15 min na 1ª vez, ~1 min depois com cache):

```
target/deploy/kora_pool.so       target/idl/kora_pool.json
target/deploy/kora_business.so   target/idl/kora_business.json
target/deploy/kora_credit.so     target/idl/kora_credit.json
```

- `*.so` → binário que vai pra rede (deploy)
- `*.json` (IDL) → interface que o cliente TS (`@coral-xyz/anchor`) usa pra falar com o programa

---

## Por que NÃO use `anchor build` direto (a causa de tudo)

Se você rodar `anchor build` ou `anchor test` "do jeito normal", quebra com:

```
error: rustc 1.75.0 is not supported. The minimum required version is 1.79.0
   ... edition2024 is required ...
```

**Motivo:** a imagem oficial `backpackapp/build:v0.30.1` traz o `cargo-build-sbf` com
**platform-tools v1.41 (rustc 1.75)**. O `mpl-bubblegum 2.1.1` (dep do `kora_business`
e `kora_credit`) exige toolchain mais novo. Resultado: o build BPF morre antes de começar.

Isso acontece em **qualquer** ambiente (Docker, WSL, Windows nativo) — não é a máquina,
é a toolchain embutida na imagem.

**O fix** é forçar o platform-tools **v1.52** (que tem rustc novo):

```bash
cargo-build-sbf --tools-version v1.52
```

O `anchor build` **não aceita** a flag `--tools-version`, por isso usamos
`cargo-build-sbf` direto. O `run-build.ps1` / `docker-build.sh` já fazem isso.

---

## Como rodar manualmente (sem o wrapper)

A partir da pasta `programs/`:

```powershell
docker run --rm `
  -v "${PWD}:/workspace" `
  -v kora-cargo-registry:/root/.cargo/registry `
  -w /workspace `
  backpackapp/build:v0.30.1 `
  bash docker-build.sh
```

- `-v "${PWD}:/workspace"` → monta o código no container (edição no VSCode reflete na hora)
- `-v kora-cargo-registry:...` → volume nomeado que guarda o cache de crates entre rodadas
  (sem ele, baixa ~200 crates toda vez)

Pra abrir um shell interativo no container e mexer à vontade:

```powershell
docker run --rm -it -v "${PWD}:/workspace" -v kora-cargo-registry:/root/.cargo/registry -w /workspace backpackapp/build:v0.30.1 bash
# lá dentro:
cargo-build-sbf --tools-version v1.52      # só os .so
anchor idl build -p kora_pool -o target/idl/kora_pool.json   # IDL de um programa
```

---

## Testes (`anchor test`)

⚠️ **Pegadinha:** `anchor test` chama `anchor build` puro por baixo → estoura no mesmo
`edition2024`. Então **não** rode `anchor test` direto.

Além disso, **ainda não há testes escritos** (`kora_pool/tests/` está vazio, não há `.ts`).
Quando forem escrever, o fluxo correto é:

1. Buildar primeiro com o script (`.\run-build.ps1`)
2. Rodar os testes pulando o build embutido:

   ```bash
   anchor test --skip-build
   ```

   (sobe um validator local, faz deploy dos `.so` já compilados e roda o script de teste
   definido em `Anchor.toml`).

> Nota: `kora_business` faz CPI no `mpl-bubblegum`. Pra testar isso no validator local,
> vai precisar clonar o programa bubblegum pro ledger (`[[test.validator.clone]]` no
> `Anchor.toml`) ou testar direto na devnet.

---

## Deploy (devnet)

Dentro do container (precisa de uma wallet com SOL de devnet):

```bash
solana config set --url https://api.devnet.solana.com
solana config set --keypair /workspace/wallet/dev.json   # crie com solana-keygen new
solana airdrop 2                                          # ou faucet.solana.com se der 429
anchor deploy --provider.cluster devnet
```

Se mudar os program IDs, rode `anchor keys sync` e builde de novo.

---

## Erros comuns

| Erro                                       | Causa / solução                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `edition2024 is required` / `rustc 1.75`   | Usou `anchor build` em vez do script. Use `.\run-build.ps1`.           |
| `Cannot connect to the Docker daemon`      | Docker Desktop não está aberto. Abra e espere o ícone ficar verde.     |
| Build baixa ~200 crates toda vez           | Faltou o volume `kora-cargo-registry`. Use o comando completo acima.   |
| `anchor test` quebra no build              | Esperado. Builde antes e use `anchor test --skip-build`.               |
| IDL não atualiza                           | `anchor idl build` é um passo separado; o `docker-build.sh` já o roda. |

---

## Arquivos deste diretório

- `run-build.ps1` — wrapper Windows: confere Docker e chama o build no container
- `docker-build.sh` — script que roda dentro do container (build dos `.so` + IDLs)
- `Anchor.toml` / `Cargo.toml` — config do workspace (IDs e membros)
- `kora_pool/`, `kora_business/`, `kora_credit/` — os programas
- `target/` — saída do build (ignorado no git)
</content>
