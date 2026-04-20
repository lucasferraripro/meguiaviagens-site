# HISTÓRICO COMPLETO — Me Guia Viagens
> Documentação de tudo que foi implementado, corrigido e como recuperar versões anteriores.
> Última atualização: 20/04/2026

---

## REPOSITÓRIO E DEPLOY

- **GitHub:** https://github.com/lucasferraripro/meguiaviagens-site
- **Site ao vivo:** https://meguiaviagens.vercel.app
- **Painel admin:** https://meguiaviagens.vercel.app/admin/login.html
- **Branch principal:** `main`
- **Deploy:** automático via Vercel ao fazer push no GitHub

---

## COMO RECUPERAR UMA VERSÃO ANTERIOR

```bash
# 1. Ver todos os commits disponíveis
git log --oneline --format="%h %ad %s" --date=format:"%d/%m/%Y %H:%M"

# 2. Voltar para um commit específico (substitua HASH pelo código do commit)
git reset --hard HASH

# 3. Forçar push para o GitHub
git push --force origin HEAD

# 4. Fazer deploy no Vercel
vercel --prod --yes
```

### Commits importantes para recuperação:

| Hash | Data | O que tem |
|------|------|-----------|
| `2901902` | 20/04 18:08 | **VERSÃO ATUAL** — sistema completo funcionando |
| `e23516f` | 20/04 15:24 | Antes da logo nova, com depoimentos sem foto |
| `a0f4fa9` | 20/04 15:17 | Sistema de pacotes implementado (sem ajustes de UI) |
| `44be7f2` | 19/04 14:02 | Versão estável com conteúdo real da agência |
| `32e807e` | 12/04 13:40 | **Site inicial** — versão mais limpa/original |

---

## ESTRUTURA DE ARQUIVOS

```
projeto/
├── index.html          ← Página principal (home)
├── pacote.html         ← Página de detalhes de cada pacote (?id=NOME)
├── editor.js           ← CMS visual (painel admin)
├── logo.png            ← Logo atual usada no header e footer
├── content.json        ← Overrides salvos pelo admin (editado via CMS)
├── vercel.json         ← Configuração do Vercel
├── js/
│   └── database.js     ← BANCO DE DADOS — todos os pacotes aqui
├── imagens/
│   ├── destinos/       ← Fotos dos destinos
│   └── uploads/        ← Imagens enviadas pelo admin
├── api/
│   ├── auth.js         ← Valida senha do admin
│   ├── content.js      ← Retorna content.json do GitHub
│   ├── publish.js      ← Salva content.json no GitHub
│   └── upload.js       ← Faz upload de imagem para o GitHub
└── admin/
    └── login.html      ← Tela de login do painel admin
```

---

## O QUE FOI IMPLEMENTADO (CRONOLÓGICO)

### 12/04/2026 — Início do projeto
- Site Me Guia Viagens criado do zero
- HTML/CSS completo: hero, stats, serviços, como funciona, destinos, diferenciais, depoimentos, contato, footer
- APIs serverless no Vercel: auth, content, publish, upload
- Painel admin com editor visual (clique para editar qualquer elemento)
- Deploy no Vercel conectado ao GitHub

### 18/04/2026 — Editor v4 + Admin completo
- Editor visual v4 com suporte a:
  - Adicionar novos pacotes pelo admin
  - Remover cards da home
  - Editar cores globais do site
  - Upload de imagens do computador
  - Botão de publicar com commit automático no GitHub
- Logo Me Guia enviada para o repositório

### 19/04/2026 — Conteúdo real da agência
- Textos reais da Me Guia Viagens aplicados via editor
- Depoimentos reais de clientes (Cintia, Josane, Ana Paula, Rodrigo)
- Stats atualizados com dados reais

### 20/04/2026 — Sistema de Pacotes v6.0 (Dossiê GUIA-SISTEMA-PACOTES)

#### Sistema de cards dinâmicos
- Criado `js/database.js` — fonte única de verdade com todos os pacotes
- Cards da home gerados dinamicamente via JavaScript (não mais HTML estático)
- Sincronização total entre home e página do pacote via `__db_overrides`
- Pacotes: Fortaleza, Orlando, Olímpia, Las Vegas, Porto de Galinhas, Cancún

#### Estrutura do database.js
Cada pacote tem:
```javascript
{
  category, title, subtitle, location, duration,
  price, priceCartao, parcelas, flag, badge, dates,
  images: [foto_card, foto2, foto3],
  desc, incluso[], nao_incluso[], roteiro[]
}
```

#### Sincronização de dados (como funciona)
- Admin edita preço na home → salva em `__db_overrides.{pkgId}.priceCartao`
- Admin edita preço no pacote → salva em `__db_overrides.{pkgId}.price`
- Ambas as páginas leem do mesmo `DB[pkgId]` após os overrides serem aplicados
- Resultado: home e página do pacote sempre mostram o mesmo valor

#### Ajustes de UI
- Fotos dos depoimentos removidas → substituídas por iniciais (C, J, A, R)
- Stats bar centralizada com `max-width: 900px` e simetria total
- No mobile: stats vira 2 colunas
- Seção de destinos movida para cima (logo após stats)
- Object-fit no painel de imagem: ⬛ Preencher / 🔲 Centralizar / 📐 Original

#### Hero atualizado
- Botão "Ver Destinos" substituído por "Fale Conosco" (WhatsApp)
- Trust badges adicionados: "Atendimento consultivo · Especialista em viagens internacionais · Suporte completo"

#### Logo
- Logo `logo.png` (736×235px, PNG) aplicada no header e footer
- Tamanho: 50px de altura
- Header: 68px de altura para acomodar a logo

#### Fix de imagens (problema recorrente — RESOLVIDO)
**Problema:** imagem editada no admin não persistia após publicar.

**Causa raiz:** 3 problemas simultâneos:
1. `renderCards()` não aplicava imagens do `srvCms` ao `THUMB` antes de montar os cards
2. Chaves legadas `img-fortaleza` no `content.json` não eram lidas pelo novo sistema
3. Após publicar, os cards no DOM não eram re-renderizados com as novas imagens

**Solução implementada:**
- `renderCards()` agora lê `srvCms` e atualiza `THUMB[pkgId]` antes de montar qualquer card
- `renderCards()` também lê chaves `img-{pkgId}` direto do servidor
- `store()` no editor salva imagem em `__db_overrides.{pkgId}.images[0]` além de `img-{pkgId}`
- Após publicar com sucesso, o editor chama `renderCards()` para re-renderizar os cards
- `applyPacoteCmsOverrides()` no pacote.html aplica `__db_overrides.images` ao carrossel

---

## VARIÁVEIS DE AMBIENTE (Vercel)

Configuradas em: https://vercel.com → projeto meguiaviagens → Settings → Environment Variables

| Variável | Descrição |
|----------|-----------|
| `GITHUB_TOKEN` | Token do GitHub com scope `repo` |
| `ADMIN_SECRET` | Senha do painel admin |
| `GITHUB_OWNER` | `lucasferraripro` |
| `GITHUB_REPO` | `meguiaviagens-site` |

---

## COMO USAR O PAINEL ADMIN

1. Acesse: https://meguiaviagens.vercel.app/admin/login.html
2. Digite email e senha
3. Redireciona para `index.html?editor=1`
4. Barra escura aparece no topo
5. Clique em qualquer texto/imagem para editar
6. Clique em **🚀 Publicar** para salvar no ar

### O que o admin pode fazer:
- ✏️ Editar qualquer texto (título, preço, parcelas, descrição)
- 🖼️ Trocar fotos (upload do computador ou URL)
- 🎨 Mudar cores globais do site
- ➕ Adicionar novos pacotes
- 🗑️ Remover cards da home
- 📐 Escolher ajuste da imagem: Preencher / Centralizar / Original

### Chaves do CMS (data-eid):
| Elemento | data-eid |
|----------|----------|
| Foto do card | `img-{pkgId}` ex: `img-fortaleza` |
| Preço cartão | `pix-{pkgId}` |
| Parcelas | `parcel-{pkgId}` |
| Título | `titulo-{pkgId}` |
| Destino | `dest-{pkgId}` |
| Badge | `badge-{pkgId}` |
| Foto no pacote | `{pkgId}-pkg-img-{idx}` ex: `fortaleza-pkg-img-0` |
| Preço no pacote | `{pkgId}-pkg-price` |

---

## PACOTES CADASTRADOS

| ID | Destino | Preço |
|----|---------|-------|
| `fortaleza` | Fortaleza & Jericoacoara | R$ 2.190,00 |
| `orlando` | Orlando & Disney | R$ 8.900,00 |
| `olimpia` | Olímpia — Hot Park Resort | R$ 1.890,00 |
| `lasvegas` | Las Vegas + Los Angeles | R$ 9.490,00 |
| `portogalinhas` | Porto de Galinhas | R$ 2.890,00 |
| `cancun` | Cancún All Inclusive | R$ 5.990,00 |

Para adicionar novo pacote: editar `js/database.js` ou usar o botão ➕ no painel admin.

---

## PROBLEMAS CONHECIDOS E SOLUÇÕES

| Problema | Causa | Solução |
|----------|-------|---------|
| Imagem não salva após publicar | THUMB não atualizado antes do render | Corrigido em 20/04 18:08 |
| Preço diferente na home vs pacote | Sem `__db_overrides` | Corrigido em 20/04 15:17 |
| Push rejeitado | CMS fez commit pelo editor | `git fetch origin && git merge origin/main --no-edit && git push` |
| Site não atualiza após publicar | Cache Vercel | Aguardar 1-2 min ou rodar `vercel --prod --yes` |

---

## COMANDOS ÚTEIS

```bash
# Ver histórico de commits
git log --oneline -20 --format="%h %ad %s" --date=format:"%d/%m/%Y %H:%M"

# Voltar para versão anterior
git reset --hard HASH
git push --force origin HEAD
vercel --prod --yes

# Fazer deploy manual
vercel --prod --yes

# Sincronizar com GitHub (quando push é rejeitado)
git fetch origin
git merge origin/main --no-edit
git push origin HEAD

# Ver o que mudou em um commit
git show HASH --stat
```
