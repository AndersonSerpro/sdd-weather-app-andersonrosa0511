# Tarefas de Implementação — Weather App

Este backlog deriva de [specs/weather-app-spec.md](../specs/weather-app-spec.md) e [plans/weather-app-plan.md](../plans/weather-app-plan.md). A implementação atual já possui busca Open-Meteo, estados básicos, conversão C/F, apresentação de clima e previsão e alguns testes; as tarefas abaixo fecham lacunas sem reconstruir esses fluxos.

## Entrega 1 — Decisão de produto e contrato de dados

### T-01 — Definir a semântica de precipitação
- **Descrição:** Resolver a ambiguidade de RF2/RF3 antes de fixar a métrica. Registrar na especificação se cada campo representa volume acumulado ou probabilidade, o período, unidade, nome exibido e campo correspondente da Open-Meteo. Não assumir que os dois campos têm a mesma semântica.
- **Critérios de aceite:** A especificação distingue precipitação atual e diária; define para cada uma métrica, período de agregação, unidade e rótulo; os critérios de RF2/RF3 não permitem interpretar a métrica como outra grandeza.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`
- **Tipo:** Data

### T-02 — Representar dados ausentes e vento máximo no domínio
- **Descrição:** Atualizar os tipos para representar campos meteorológicos indisponíveis sem valores fictícios e incluir velocidade máxima diária. Manter temperaturas em Celsius como valor de domínio.
- **Critérios de aceite:** Campos numéricos meteorológicos que podem faltar aceitam `null`; `ForecastDay` contém vento máximo diário; os tipos continuam distinguindo a métrica de precipitação conforme T-01; `pnpm build` não acusa incompatibilidades nos consumidores.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/types/weather.ts`
- **Tipo:** Data

## Entrega 2 — Geocoding e previsão

### T-03 — Validar respostas de geocoding
- **Descrição:** Preservar a consulta, codificação e mapeamento existentes; tratar resposta JSON inválida ou estrutura incompatível como erro recuperável, sem confundi-la com uma busca válida sem resultados.
- **Critérios de aceite:** A consulta com espaços/acentos mantém a codificação; status HTTP não-ok, JSON inválido e estrutura incompatível geram `WeatherServiceError`; `results` vazio continua sendo busca sem resultados.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/services/weatherService.ts`
- **Tipo:** Data

### T-04 — Mapear previsão diária completa e parcial
- **Descrição:** Completar o pedido e o mapeamento de forecast com vento máximo, sem converter campos ausentes em zero; validar a estrutura essencial e a série de cinco dias consecutivos.
- **Critérios de aceite:** A URL inclui os campos definidos para clima atual e previsão, inclusive vento máximo diário; campos individuais ausentes/null são mapeados como indisponíveis; payload sem estrutura essencial ou série diária inválida gera erro recuperável; uma série válida resulta em exatamente cinco datas consecutivas, começando pela data local fornecida pela API.
- **Dependências:** T-01, T-02.
- **Arquivos prováveis:** `src/services/weatherService.ts`
- **Tipo:** Data

## Entrega 3 — Seleção explícita e recuperação

### T-05 — Separar resultados de busca da cidade selecionada
- **Descrição:** Ajustar a orquestração do hook para que pesquisar apenas produza resultados; carregar forecast somente após seleção explícita e repetir no retry a operação que falhou.
- **Critérios de aceite:** Busca com um ou vários resultados não chama `getWeather`; `selectCity` chama forecast para a cidade escolhida; retry após falha de busca repete geocoding, e após falha de forecast repete a cidade selecionada; consulta vazia não chama serviço; não há seleção automática.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`
- **Tipo:** Data

### T-06 — Exibir resultados de cidade selecionáveis
- **Descrição:** Estender a busca existente para apresentar cidade, região quando disponível e país, expondo uma ação acessível para selecionar cada resultado.
- **Critérios de aceite:** Cada resultado identifica cidade e país e inclui região quando fornecida; resultados homônimos são distinguíveis; cada opção pode ser alcançada e acionada por teclado e tem nome acessível; o formulário continua impedindo submissão vazia.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`
- **Tipo:** UI

### T-07 — Conectar seleção e resultados na tela principal
- **Descrição:** Ligar os resultados e a seleção expostos pelo hook à barra de busca existente, mantendo os estados iniciais, loading, vazio e erro já implementados.
- **Critérios de aceite:** Resultados de busca são enviados à UI; selecionar um resultado chama `selectCity`; forecast aparece somente após seleção; estados já existentes continuam renderizados sem dados meteorológicos fictícios.
- **Dependências:** T-05, T-06.
- **Arquivos prováveis:** `src/App.tsx`
- **Tipo:** UI

## Entrega 4 — Apresentação dos dados

### T-08 — Formatar temperaturas indisponíveis
- **Descrição:** Adaptar o formatador existente para exibir um marcador neutro quando uma temperatura estiver ausente, preservando conversão e arredondamento atuais para valores numéricos.
- **Critérios de aceite:** C e F continuam convertendo corretamente temperaturas numéricas; temperatura nula não causa exceção nem exibe `NaN`; o marcador neutro não recebe símbolo de unidade como se fosse valor numérico.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/lib/temperature.ts`
- **Tipo:** UI

### T-09 — Apresentar clima atual com campos parciais
- **Descrição:** Atualizar a apresentação de clima atual para indicar individualmente dados ausentes e usar a semântica de precipitação definida em T-01.
- **Critérios de aceite:** Temperatura, condição, umidade, vento, pressão e precipitação usam valores disponíveis; cada campo ausente tem marcador neutro sem ocultar os demais; unidade e rótulo da precipitação correspondem à decisão registrada em T-01; cidade selecionada permanece identificada.
- **Dependências:** T-01, T-02, T-08.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`
- **Tipo:** UI

### T-10 — Apresentar métricas diárias completas
- **Descrição:** Atualizar cada item da previsão para mostrar velocidade máxima do vento e a métrica diária de precipitação definida, mantendo as datas e temperaturas já exibidas.
- **Critérios de aceite:** Cada dia exibe mínima, máxima, condição, precipitação e vento máximo; métrica e unidade de precipitação correspondem a T-01; campos ausentes têm marcador neutro; valores C/F permanecem corretos.
- **Dependências:** T-01, T-02, T-08.
- **Arquivos prováveis:** `src/components/ForecastCard.tsx`
- **Tipo:** UI

## Entrega 5 — Testes unitários

### T-11 — Cobrir contratos e falhas do serviço meteorológico
- **Descrição:** Ampliar testes de serviço existentes para geocoding e forecast, com respostas completas, parciais, inválidas e erros de rede/HTTP.
- **Critérios de aceite:** Testes verificam parâmetros e codificação de geocoding; estrutura inválida é distinta de lista vazia; forecast requisita/mapa vento máximo e precipitação segundo T-01; campos ausentes permanecem indisponíveis; séries inválidas e falhas HTTP/rede resultam em erro tipado; série válida produz cinco dias.
- **Dependências:** T-03, T-04.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`
- **Tipo:** Test

### T-12 — Cobrir a máquina de estados e retry do hook
- **Descrição:** Criar testes unitários do hook para seleção explícita, estados da busca/forecast e retry da operação apropriada.
- **Critérios de aceite:** Busca com múltiplos resultados não seleciona cidade nem carrega forecast; seleção carrega apenas a cidade escolhida; resultados vazios e erros produzem estados corretos; retry repete geocoding ou forecast conforme a falha anterior; entrada em branco não chama serviços.
- **Dependências:** T-05.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`
- **Tipo:** Test

### T-13 — Testar seleção acessível de cidades
- **Descrição:** Ampliar os testes do componente de busca para cobrir apresentação, desambiguação e seleção por teclado.
- **Critérios de aceite:** Testes verificam cidade/região/país, seleção de resultado, operação por teclado e ausência de seleção implícita; submissão vazia permanece sem callback.
- **Dependências:** T-06.
- **Arquivos prováveis:** `tests/unit/SearchBar.test.tsx`
- **Tipo:** Test

### T-14 — Testar apresentação parcial do clima atual
- **Descrição:** Adicionar testes unitários focados na renderização dos campos disponíveis e ausentes do clima atual.
- **Critérios de aceite:** Testes verificam marcador neutro por campo ausente, permanência dos demais valores, unidade/rótulo de precipitação definido em T-01 e temperatura C/F; `CurrentWeather` aceita dados parciais sem quebrar.
- **Dependências:** T-09.
- **Arquivos prováveis:** `tests/unit/CurrentWeather.test.tsx`
- **Tipo:** Test

### T-15 — Testar apresentação parcial da previsão diária
- **Descrição:** Adicionar testes unitários focados na renderização dos campos disponíveis e ausentes de um dia previsto.
- **Critérios de aceite:** Testes verificam marcador neutro por campo ausente, permanência dos demais valores, unidade/rótulo de precipitação definido em T-01 e temperatura C/F; `ForecastCard` aceita dados parciais sem quebrar.
- **Dependências:** T-10.
- **Arquivos prováveis:** `tests/unit/ForecastCard.test.tsx`
- **Tipo:** Test

### T-16 — Cobrir conversão e formatação de temperaturas ausentes
- **Descrição:** Estender testes do utilitário de temperatura para valores ausentes sem duplicar os testes numéricos C/F existentes.
- **Critérios de aceite:** Testes cobrem C→F e F→C conforme a API atual de formatação/apresentação e confirmam o marcador neutro para temperatura ausente; a suíte existente continua passando.
- **Dependências:** T-08.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`
- **Tipo:** Test

### T-17 — Testar a composição dos estados da aplicação
- **Descrição:** Ampliar os testes de App para validar a integração da busca, seleção, unidade e estados visíveis sem repetir testes internos dos componentes.
- **Critérios de aceite:** Testes verificam estado inicial sem clima, resultados antes da seleção, clima após seleção e estados empty/error/loading; o controle de unidade segue disponível e com nome acessível.
- **Dependências:** T-07, T-09, T-10.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`
- **Tipo:** Test

## Entrega 6 — Testes E2E e qualidade

### T-18 — Validar o fluxo E2E de busca, seleção e previsão
- **Descrição:** Adaptar o fluxo Playwright existente para interceptar respostas determinísticas, exigir seleção explícita e validar os dados de cinco dias.
- **Critérios de aceite:** Com fixtures de resultados homônimos, nenhum forecast ocorre antes da escolha; a seleção correta identifica a cidade; o fluxo confirma clima atual e exatamente cinco datas consecutivas com métricas diárias requeridas.
- **Dependências:** T-04, T-07, T-09, T-10.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-19 — Validar alternância C/F sem nova requisição
- **Descrição:** Estender o E2E existente para conferir todas as temperaturas e contar as requisições de forecast durante a alternância.
- **Critérios de aceite:** Temperatura atual e mínimas/máximas mudam corretamente entre C e F e retornam a C; a quantidade de requisições de forecast não aumenta ao alternar a unidade.
- **Dependências:** T-18.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-20 — Validar recuperação de falhas no E2E
- **Descrição:** Completar a cobertura E2E para ausência de resultados, falhas recuperáveis e dados parciais; manter a interceptação das APIs.
- **Critérios de aceite:** Cenários cobrem geocoding sem resultados e com falha/retry, forecast com falha/retry e resposta parcial.
- **Dependências:** T-11, T-12, T-17, T-18.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-21 — Validar responsividade no E2E
- **Descrição:** Validar a jornada principal em viewport móvel e desktop com interceptação das APIs.
- **Critérios de aceite:** Em 320 px e desktop não há rolagem horizontal da página nem sobreposição de conteúdo durante a jornada principal.
- **Dependências:** T-18.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-22 — Validar acessibilidade por teclado no E2E
- **Descrição:** Validar a operação por teclado e a visibilidade do foco nos controles da jornada principal.
- **Critérios de aceite:** Busca, seleção de cidade, retry e alternância de unidade podem ser operados por teclado; o foco permanece visível nos controles acionáveis.
- **Dependências:** T-13, T-18.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-23 — Executar os gates do projeto
- **Descrição:** Verificar lint, build, testes unitários e E2E após a implementação, corrigindo somente falhas introduzidas pelas tarefas deste backlog.
- **Critérios de aceite:** `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` terminam com sucesso; eventuais limitações ambientais são registradas sem mascarar falhas.
- **Dependências:** T-11, T-12, T-13, T-14, T-15, T-16, T-17, T-18, T-19, T-20, T-21, T-22.
- **Arquivos prováveis:** Nenhum arquivo de produção; `package.json` apenas se for necessário consultar os comandos existentes.
- **Tipo:** Test

### T-24 — Renomear a aplicação e adicionar cidades predefinidas
- **Descrição:** Exibir “Qual é o tempo?” como marca e adicionar atalhos acessíveis para Curitiba, Maringá e Matinhos, carregando o clima diretamente pelas coordenadas locais.
- **Critérios de aceite:** A marca visível usa o nome solicitado; existem três botões com nomes acessíveis e foco por teclado; ativar cada botão carrega a cidade e coordenadas corretas sem chamar geocoding; busca, toggle de unidade e estados existentes permanecem funcionais.
- **Dependências:** T-05, T-07.
- **Arquivos prováveis:** `src/App.tsx`, `tests/unit/App.test.tsx`, `tests/e2e/weather.spec.ts`.
- **Tipo:** UI

### T-25 — Exibir previsão horária e sugestão prática
- **Descrição:** Solicitar e mapear as horas do dia local na Open-Meteo, exibi-las em um quadro acessível e destacar uma recomendação baseada nas próximas três horas.
- **Critérios de aceite:** A série horária é filtrada pela data local da cidade e não mostra horários anteriores ao `current.time`; cada linha mostra hora, condição, temperatura e probabilidade de chuva; dados parciais exibem marcador neutro; a sugestão respeita a prioridade chuva ≥50%, UV ≥6, temperatura ≤10 °C e fallback neutro; testes cobrem limites e os casos de recomendação.
- **Dependências:** T-04, T-10, T-24.
- **Arquivos prováveis:** `src/services/weatherService.ts`, `src/types/weather.ts`, `src/components/HourlyForecast.tsx`, `src/components/WeatherSuggestion.tsx`, `src/lib/weatherSuggestion.ts`, `tests/unit/weatherService.test.ts`, `tests/unit/weatherSuggestion.test.ts`, `tests/unit/App.test.tsx`, `tests/e2e/weather.spec.ts`.
- **Tipo:** UI/Data/Test

### T-26 — Gerenciar cidades predefinidas
- **Descrição:** Permitir salvar resultados de busca como atalhos, impedir duplicidades e remover qualquer cidade predefinida; manter a lista no armazenamento local do navegador.
- **Critérios de aceite:** Cada resultado não salvo oferece ação acessível para adicionar; a lista é persistida em `localStorage`; cidades já salvas não são adicionadas novamente; cada atalho oferece ação acessível para remover; alterações persistem após recarregar e não afetam a seleção nem a previsão.
- **Dependências:** T-06, T-24.
- **Arquivos prováveis:** `src/App.tsx`, `src/components/SearchBar.tsx`, `tests/unit/App.test.tsx`, `tests/e2e/weather.spec.ts`.
- **Tipo:** UI/Data/Test

## Cobertura de requisitos

| Requisito | Tarefas principais |
| --- | --- |
| RF1 — Busca e seleção | T-03, T-05 a T-07, T-11 a T-13, T-17, T-18, T-20, T-22 |
| RF2 — Clima atual | T-01, T-02, T-04, T-08, T-09, T-11, T-14, T-18, T-20 |
| RF3 — Previsão de cinco dias | T-01, T-02, T-04, T-08, T-10, T-11, T-15, T-18, T-20, T-21 |
| RF4 — Unidade de temperatura | T-02, T-08 a T-10, T-14 a T-16, T-19 |
| RF5 — Estados e recuperação | T-03 a T-07, T-11, T-12, T-17, T-20, T-22 |
| RF6 — Cidades predefinidas e identidade | T-24 |
| RF7 — Previsão horária e recomendação | T-25 |
| RF6 — Cidades predefinidas e identidade | T-24, T-26 |
| RF7 — Previsão horária e recomendação | T-25 |
| RNFs — Performance, responsividade, acessibilidade, resiliência, publicação, localização e qualidade | T-01, T-03 a T-23, conforme critérios de cada tarefa |