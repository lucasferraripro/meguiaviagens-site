# Me Guia Viagens — Dados do Projeto

## 🌐 Site publicado
**URL:** https://meguiaviagens.vercel.app

## 🔐 Painel de edição (editor visual)
- **URL:** https://meguiaviagens.vercel.app/admin/login.html
- **Email:** admin@meguiaviagens.com.br
- **Senha:** MeGuia@2025

## 📦 Repositório GitHub
- **URL:** https://github.com/lucasferraripro/meguiaviagens-site
- **Conta:** lucasferraripro

## 📱 WhatsApp configurado
- **Número:** +55 42 9973-2517
- **Formato wa.me:** 554299732517

## 🎨 Identidade visual
- Cor principal (navy): #1B3A8C
- Cor destaque (dourado): #E8B84B
- Logo: logo.png

## 📄 Páginas
- `index.html` — Página principal
- `pacote.html` — Página de pacotes (dinâmica, carrega por ?id=)
- `admin/login.html` — Painel editor

## ✈️ Pacotes
| ID URL | Destino | Preço |
|--------|---------|-------|
| ?id=fortaleza | Fortaleza & Jericoacoara | R$ 2.190/pessoa |
| ?id=orlando | Orlando & Disney | R$ 8.900/pessoa |
| ?id=olimpia | Olímpia Hot Park Resort | R$ 1.890/pessoa |
| ?id=lasvegas | Las Vegas + Los Angeles | R$ 9.490/pessoa |
| ?id=portogalinhas | Porto de Galinhas | R$ 2.890/pessoa |
| ?id=cancun | Cancún All Inclusive | R$ 5.990/pessoa |

## 🛠️ Para atualizar o site
1. Edite os arquivos localmente
2. Abra o terminal nesta pasta
3. Execute:
   ```
   git add .
   git commit -m "sua mensagem"
   git push
   ```
4. O Vercel faz o redeploy automático em ~30 segundos

## 🔑 Variáveis de ambiente (Vercel)
- `GITHUB_TOKEN` — token para o CMS gravar conteúdo
- `ADMIN_SECRET` — senha do painel (MeGuia@2025)
