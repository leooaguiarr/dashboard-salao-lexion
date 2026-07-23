# Handoff & Status do Projeto (AI Agent Log)

**ATENÇÃO AGENTE IA (Agent Instructions):**
1. **Leia este arquivo** sempre que iniciar uma nova sessão de trabalho neste projeto para entender o contexto e as últimas modificações.
2. **Sempre atualize este arquivo** ao final do seu turno de trabalho ou após concluir um grande bloco de tarefas. Registre o que foi feito, decisões de arquitetura e bugs conhecidos. Como este projeto é editado por múltiplos agentes em máquinas diferentes, este log é a única fonte de verdade para manter a continuidade do trabalho.
3. **Sempre faça o commit e push das alterações para o GitHub** após concluir qualquer alteração ou atualização no projeto (use comandos git apropriados para fazer o commit e push para a branch correspondente, geralmente `main`), garantindo que o repositório remoto permaneça atualizado.

---

## 📅 Últimas Modificações (Sessão de Hoje)

1. **Adicionado Campo de Comissão para Profissionais:**
   - Adicionado o campo "Comissão sobre Serviço (%)" no modal de criação e edição de Profissionais em `index.html`.
   - Atualizado o `app.js` para persistir o percentual de `commission` no objeto do profissional e exibi-lo no card do barbeiro na aba de Configurações.
   - Isso servirá de base para futuros cálculos de repasses financeiros no Dashboard.

2. **Captura de Data de Nascimento e Aniversários no Dashboard:**
   - Adicionado novo fluxo no **Agendamento Público (Simulador/Link)**: ao inserir o WhatsApp, o sistema agora checa se o cliente já existe (via RPC `check_client_exists` no Supabase ou verificação local).
   - Se o cliente for novo, um campo de "Data de Nascimento" é exibido obrigando o preenchimento para avançar.
   - Os dados são salvos na tabela `clients` com a nova coluna `birth` formatada como "YYYY-MM-DD".
   - **Dashboard**: Criado o painel "Próximos Aniversariantes" abaixo das Ações Recomendadas de CRM. O painel lista clientes que fazem aniversário nos próximos 7 dias (ou hoje) e inclui um botão de ação rápida para enviar uma mensagem de parabéns pré-definida via WhatsApp.
   - **SQL Supabase**: A função `create_public_booking` foi atualizada no arquivo `docs/public_booking_setup.sql` e uma nova função `check_client_exists` foi adicionada. É necessário que o proprietário do banco rode este script manualmente no SQL Editor do Supabase, já que não temos execução remota direta de migrations.
1. **Correção de Erro de Schema Supabase (clients):**
   - O campo virtual `daysSinceLast` criado no frontend pela função `getRecallClients()` estava quebrando o upsert de clientes no Supabase (*"Could not find the 'daysSinceLast' column"*).
   - O arquivo `api.js` foi atualizado para deletar silenciosamente propriedades virtuais (`daysSinceLast`) do objeto do cliente tanto na função de save quanto na migração para a nuvem.
1. **Mensagem Padrão de Agendamento via WhatsApp:**
   - Adicionado um novo campo configurável em **Configurações > Dados do Estabelecimento** chamado "Mensagem Padrão de Agendamento (WhatsApp)" com suporte às tags dinâmicas `{dia}` (dia da semana atual) e `{link}` (link de agendamento do salão).
   - Na seção **Link de Agendamento**, foi criada uma **área de composição editável** (textarea) onde a mensagem já vem montada com o dia e o link preenchidos. O profissional pode editar livremente antes de clicar em **"Enviar no WhatsApp"** (abre wa.me sem número — o profissional escolhe o contato). Há também um botão de copiar ao lado.
   - A mensagem padrão é: `Bom dia, agende seu horário para hoje {dia}, não deixe pra última hora 💈 {link}`.
   - **⚠️ IMPORTANTE (Schema Supabase):** A propriedade `whatsappBookingMessage` **NÃO tem coluna** na tabela `business_info` do Supabase. Ela é persistida **apenas no localStorage**. O `api.js` foi atualizado com um filtro `allowedCols` que sanitiza o objeto `businessInfo` antes do upsert, enviando apenas colunas conhecidas ao Supabase. Campos extras ficam apenas no localStorage. Se no futuro for necessário sincronizar entre máquinas, rode: `ALTER TABLE business_info ADD COLUMN "whatsappBookingMessage" TEXT;`

2. **Correção na Exclusão/Cancelamento de Agendamentos:**
   - Ajustada a lista de **Próximos Atendimentos** no Dashboard para ocultar agendamentos com status `'cancelled'` (cancelado), `'done'` (concluído) ou `'no_show'` (falta), mantendo apenas agendamentos futuros e ativos.
   - Atualizado o evento de clique do botão "Excluir" (`btn-delete-appointment`) para sincronizar e cancelar as mensagens automáticas pendentes associadas ao agendamento, e re-renderizar a página atual (utilizando `renderPageData`) para que a lista de agendamentos no Dashboard sum
2. **Planejamento de Fotos dos Profissionais:**
   - Criado o plano detalhado de alteração em [docs/plano_fotos_profissionais.md](file:///c:/Users/44209076813/Documents/Antigravity/dashboard_salao/docs/plano_fotos_profissionais.md) para permitir o cadastro e a exibição da foto de perfil dos barbeiros (exibindo avatares circulares no painel e na tela pública do cliente).
   - As imagens dos barbeiros padrões (`carlos_barber.png` e `felipe_barber.png`) já foram geradas via IA e copiadas para `public/assets/` para facilitar demonstrações.

3. **Criação da Proposta Comercial:**
   - Foi criado o arquivo `docs/proposta_comercial_lexion.html` contendo uma apresentação comercial premium e responsiva.
   - Definidos os preços com base na concorrência (Trinks, Avec): R$ 497 implantação + R$ 99/mês.
   - O documento resume funcionalidades, métricas e um comparativo de mercado.

4. **Correção de Cálculo de Receita e Gasto do Cliente:**
   - Na renderização da aba **Clientes**, o `totalSpent` foi corrigido para somar o valor dos serviços com base em agendamentos que têm `paymentStatus === 'paid'`, ignorando o `status === 'done'`. Isso permite que valores pagos antecipadamente entrem na conta.
   - Na aba **Financeiro**, o gráfico de `Faturamento por Serviço` também foi ajustado para somar apenas com base em `paymentStatus === 'paid'`.
   - Adicionada a porcentagem de representatividade no label de cada serviço no gráfico da aba financeira (ex: `Corte Degradê (40%)`), seguindo o padrão de "Métodos de Pagamento".

5. **Dashboard - Próximos Atendimentos Dinâmico:**
   - A aba inicial do dashboard não exibe mais apenas os agendamentos do dia atual. Agora, ela busca **todos os agendamentos futuros**, priorizando o dia de hoje.
   - Limitado a **10 agendamentos**. Se hoje houver menos de 10, o sistema puxa automaticamente os agendamentos de amanhã em diante até completar a lista.
   - O sistema filtra automaticamente os horários que já passaram, fazendo com que a fila "suba" em tempo real durante o dia.
   - Adicionada uma `dateLabel` visual para sinalizar agendamentos de outros dias.

6. **Configuração de Mensagem Padrão do WhatsApp:**
   - Adicionado um campo customizável na aba Configurações > "Dados do Estabelecimento" chamado "Mensagem Padrão de Retorno (WhatsApp)".
   - Suporte à tag `{nome}` para inserção dinâmica do nome do cliente na mensagem.
   - O botão "Chamar" na aba Clientes (CRM) agora utiliza esse texto configurado no lugar do texto hardcoded anterior.

7. **Lógica de Agendamento (Google Calendar Style):**
   - Refatoração na `renderAgenda` (`app.js`) para suportar sobreposição de horários reais.
   - Quando dois atendimentos colidem no tempo (baseado na duração do serviço), o sistema os agrupa no mesmo `cluster` e divide a largura (`width`) entre eles, renderizando-os **lado a lado** ao invés de um em cima do outro.

8. **Melhorias de Interface e Ajustes Finais:**
   - **Agenda Mensal:** Atualizada para exibir não apenas o total financeiro diário, mas também a contagem detalhada de agendamentos por **profissional** no formato (Nome: Qtd).
   - **Aba CRM (Clientes):** Remoção da contagem de dias em parênteses dos badges "Em Dia" e "Atrasado" para deixar o layout mais limpo.
   - **Correção de Layout:** Ajuste nas tags `</div>` da aba de configurações (Dados do Estabelecimento) que estavam causando quebra de layout após a inserção do campo do WhatsApp.

9. **UX do Modal de Agendamentos (Mobile First):**
   - Ao abrir um agendamento existente pela agenda, a tela agora é **simplificada**: exibe um "card de leitura" com nome do cliente, serviço e profissional.
   - Os dados gigantes de cadastro de clientes ficam ocultos, deixando a experiência limpa.
   - Botões de acesso rápido: **[ Pagamento ]** e **[ Horário ]** alternam os campos da modal de forma interativa sem poluir a tela.

10. **Integração Financeira Direta na Agenda:**
    - Adicionado o campo de `Valor (R$)` na modal de edição. Ele vem **pré-preenchido automaticamente** com o valor padrão do serviço.
    - Quando a opção "Pagamento Realizado?" é alterada para "Sim (Pago)", o sistema pega o `Valor (R$)` (que o usuário pode ter editado se deu desconto) e insere uma nova transação (`type: income`) diretamente no painel **Financeiro** (`data.transactions`).
    - O campo `price` **não é salvo** no objeto `appointment` final enviado ao banco de dados, pois a tabela `appointments` no Supabase não possui essa coluna e retornava erro de *schema cache*. Toda a lógica ocorre de forma efêmera e grava estritamente na tabela/lista de transações.

11. **Ícones de Status na Agenda:**
    - Adicionado a função `renderAppointmentStatusBadge` para atualizar dinamicamente os ícones dos cards:
      - 🕦 **Relógio Amarelo:** Pagamento pendente, mas horário ainda está no futuro.
      - ⚠️ **Exclamação Vermelha:** Horário do atendimento já passou (fim do tempo de serviço) e o pagamento continua pendente.
      - 💰 **Dinheiro Verde:** Pagamento confirmado.

12. **Navegação de Dias de Agendamento:**
    - Adicionadas "setas" de navegação (`<` e `>`) perto da seleção de datas na tela de agendamento público para pular dias rapidamente.
    - O sistema impede automaticamente a seleção de um dia em que os horários de fechamento já passaram (ex: bloqueio por margem de segurança de 2h) ou que está 100% lotado, fazendo um auto-skip para o próximo dia útil.

13. **Alerta Fim de Dia:**
    - Se o usuário acessar a agenda no dia atual e houver atendimentos encerrados sem registro de pagamento, um banner de alerta vermelho é renderizado no topo do calendário.


14. **Filtro de Faturamento por Profissional:**
    - Adicionado suporte a rastreamento de receitas e despesas por profissional (`profId`) em `data.transactions`.
    - O Dashboard Financeiro possui botões que filtram os cálculos e a Tabela de Transações com base no profissional selecionado (ou exibe o Geral da Barbearia).
    - O cadastro manual de entrada/saída financeira agora possui um campo opcional para vincular o valor a um profissional.
    - O gatilho de pagamento na agenda (ao marcar como pago) salva automaticamente o `profId` na transação financeira gerada.

15. **Dashboard - UI e Ordenação de Próximos Atendimentos:**
    - Corrigido o bug onde a lista de "Próximos Atendimentos" ignorava o dia e ordenava apenas pela hora.
    - O texto estático "Hoje" no topo foi trocado por uma legenda de cores (Hoje / Futuro).
    - Os cards de atendimento da home ganharam indicativos visuais (`is-hoje`, `is-futuro`) de fundo e borda para facilitar a identificação do dia.
    - O texto que exibe a data no card foi aprimorado para mostrar explicitamente "HOJE" ou "AMANHÃ", além do tradicional "DD/MM".

---

## 🚀 Atualizações Recentes (Última Sessão)

16. **Correção de Lógica de Cortesia e UX do Modal:**
    - Atualizado o sistema para identificar corretamente pagamentos "Cortesia" (`free`), registrando a transação com valor R$ 0,00 na aba Financeiro para manter o histórico preciso.
    - Adicionado script para zerar automaticamente o input de valor e bloqueá-lo quando a opção Cortesia é selecionada na edição do agendamento.
    - Títulos e textos dos botões no modal de edição foram dinamizados para diferenciar entre "Agendamento" (quando apenas criando/editando) e "Confirmar Pagamento / Salvar Pagamento" (quando confirmando pelo dashboard).

17. **Cálculo de Métricas de Clientes:**
    - Ajustada a função `calculateClientStats` para contar como visita os agendamentos que estão com status de pagamento `paid` ou `free`, mesmo que o status do agendamento não tenha sido trocado para `done`. Isso evita que métricas do cliente fiquem zeradas caso o profissional esqueça de concluir o agendamento após o pagamento.

18. **Sincronização de Exclusão no Supabase:**
    - Detectado e corrigido um bug onde a exclusão de Profissionais, Serviços e Leads apenas removia do array local, mas não enviava o comando de deleção para a nuvem (fazendo-os voltar após o refresh).
    - Adicionada a chamada para `DataService.deleteItem()` nos respectivos gatilhos de exclusão.

19. **Deleção de Clientes:**
    - Implementado um botão de "Excluir" no modal de Edição de Clientes (oculto durante novos cadastros), contendo aviso de confirmação e sincronização direta com a nuvem.

20. **Otimização Completa para Celulares e Tablets:**
    - Todo o CSS para telas móveis (`@media max-width: 768px`) foi revisado.
    - Os cartões de "Próximos Atendimentos" foram reescritos para usar `flex-wrap`, expandindo verticalmente para evitar sobreposição de textos longos e de valores (R$).
    - O botão de edição (lápis) agora fica permanentemente visível nos dispositivos móveis (já que o "hover" não existe) alinhado à direita.
    - Ajustados os botões de ação do CRM para ocuparem a largura total (`width: 100%`) facilitando o toque na tela.
    - Um backup local das regras css antigas foi guardado em `backup_mobile_opt`.

21. **Correção de Sobreposição de Camadas (z-index) no Scroll Mobile:**
    - Ajustado o `z-index` do cabeçalho superior (`.top-header`) no bloco CSS responsivo (`@media max-width: 768px`) de `90` para `10`.
    - Isso corrige o bug visual onde botões e títulos do topo do painel sobrepunham elementos interativos (como o simulador de smartphone ou modais) durante a rotagem da página.

22. **Correção de Fixação e Sobreposição no Simulador de Celular:**
    - Ajustada a estrutura interna do `.iphone-screen`, `.phone-status-bar` e `.phone-browser-header` com `flex-shrink: 0` e `z-index` elevado.
    - Definido `z-index: 50` e fundo sólido escuro (`var(--bg-primary)`) no `.top-header` (cabeçalho fixo com o botão "+ Novo Agendamento") e atribuído `z-index: 1` ao `.iphone-frame`.
    - Isso garante que o cabeçalho fique permanentemente fixo e visível por cima de tudo na tela enquanto o celular passa suavemente por trás do cabeçalho ao rolar a página.


23. **Controle de Caixa e Comiss�es (Financeiro):**
    - Adicionado suporte a `cashRegisters` no `app.js` e script SQL para cria��o da tabela no Supabase (`docs/supabase_cash_registers.sql`).
    - Criada a funcionalidade "Caixa do Dia" na aba Financeiro: bot�o para Abrir Caixa e Fechar Caixa.
    - Se um recebimento ou transa��o for em *Dinheiro* e o Caixa estiver Fechado, a transa��o entra como `pending` e n�o contabiliza no faturamento l�quido.
    - Quando o Caixa � aberto, o sistema varre as transa��es *pendentes* em dinheiro e as confirma automaticamente.
    - O Dashboard Financeiro agora permite filtrar por **Per�odos** (Hoje, 7 Dias, 30 Dias).
    - Adicionado no painel o c�lculo de **Comiss�es do Per�odo**, utilizando a porcentagem (`commission`) gravada no perfil do profissional. O sistema c�lcula o valor real (agendamentos pagos) e o valor *Previsto* (agendamentos confirmados mas pendentes de pagamento).

24. **Aprimoramento do Painel Caixa do Dia:**
    - A visualização do "Caixa do Dia" agora é dinâmica baseada no filtro de profissional.
    - No modo Geral (Todos), exibe o Saldo em Gaveta, a Projeção de Faturamento de Hoje (soma de todos os agendamentos ativos do dia) e os Gastos do Dia.
    - No modo Profissional, exibe o Saldo em Gaveta (fixo) e métricas específicas do barbeiro: Comissão Hoje, Agendamentos Hoje e Projeção de Comissão no Mês.
    - O layout dos filtros de Período e Profissional no Financeiro foi ajustado para ficarem lado a lado (row e nowrap) separados por uma linha vertical divisória.

## 🛠 Arquitetura e Restrições Atuais

- **Banco de Dados (Supabase):** Toda vez que um objeto é injetado localmente (`data.appointments`, `data.transactions`), a função `saveData()` o sincroniza com o backend. **Atenção extrema ao Schema:** Não adicione chaves novas (ex: `price` num agendamento) se você não tiver certeza de que a coluna existe no banco (Supabase), pois o RLS e o PostgREST irão rejeitar a query.
- **Frontend Vanilla:** Todo o painel (`index.html`) usa CSS puro e `app.js` lida com o estado. Sem frameworks (React/Vue).
- **Tratamento de Strings:** Sempre utilize IDs puros para lidar com DOM, e evite concatenações de HTML gigantescas sem validação `escapeHTML` caso exiba inputs diretos.

*Boa sorte no próximo turno! 🚀*