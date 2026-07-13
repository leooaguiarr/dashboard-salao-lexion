# Lexion — Dashboard de Barbearia & Salão

Sistema de gestão para salões e barbearias: agenda, clientes, leads (Kanban),
financeiro, automações de mensagens e link público de agendamento.

**Produção:** https://lexionsalao.vercel.app

## Estrutura do projeto

```
public/           ← O site (é SÓ isso que o Vercel publica)
  index.html      ← Página única (dashboard + login + página pública)
  app.js          ← Lógica principal do app
  api.js          ← Camada de dados (Supabase + fallback localStorage)
  index.css       ← Estilos do app
  auth.css        ← Estilos da tela de login
  assets/         ← Imagens
docs/             ← Documentação (não vai para o site)
  supabase_setup.sql                      ← Script de criação das tabelas no Supabase
  plano_appweb_cabeleireiros_lexion.md    ← Plano do produto
server.js         ← Servidor de desenvolvimento local (NÃO sobe para o Vercel)
vercel.json       ← Configuração do deploy (pasta public/ + rotas do link público)
.vercelignore     ← Garante que só o site estático seja publicado
```

## Rodar localmente

```bash
node server.js
# abre http://localhost:8000
```

## Deploy

Deploy automático pelo Vercel a cada push na branch `main`.

> **Importante:** o `server.js` é apenas para desenvolvimento local. Ele está no
> `.vercelignore` porque, se subir para o Vercel, é detectado como servidor Node
> e derruba o site com erro 500 (`FUNCTION_INVOCATION_FAILED`).

## Link público de agendamento

Cada salão tem um link no formato `https://lexionsalao.vercel.app/<slug>`
(o slug é configurado em Configurações → Dados do Estabelecimento).
Qualquer rota desconhecida é reescrita para o `index.html` (ver `vercel.json`),
e o app detecta o slug na URL e abre a página de agendamento do cliente,
sem passar pela tela de login.

A página pública busca os dados reais do salão (serviços, profissionais e
horários ocupados) no Supabase pelo slug, e grava o agendamento direto na
conta do salão — via funções RPC `get_public_salon` e `create_public_booking`
(criadas por `docs/public_booking_setup.sql`). Se o slug não existir no banco,
mostra "link não encontrado"; sem Supabase (dev local), cai no modo demo.

## Banco de dados (Supabase)

- Credenciais em `public/api.js` (URL + chave `anon`, protegida por RLS).
- Instalação do zero: rodar `docs/supabase_setup.sql` e depois
  `docs/public_booking_setup.sql` no SQL Editor do Supabase.
- Banco já existente: rodar apenas `docs/public_booking_setup.sql`
  (idempotente — também corrige nomes de colunas camelCase e a constraint
  de unicidade de `business_info`, sem os quais a sincronização do
  dashboard falha silenciosamente).
- Sem login (ou sem Supabase), o app funciona em modo demo com dados no
  `localStorage` do navegador.
