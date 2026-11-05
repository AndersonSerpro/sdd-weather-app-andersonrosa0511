# Especificação do Produto — Weather App

## Overview

Aplicação web de página única para consultar rapidamente o clima de uma cidade e planejar os próximos dias. A pessoa usuária pesquisa uma cidade, escolhe um resultado desambiguado e visualiza as condições atuais e a previsão de cinco dias. A interface é mobile-first, em pt-BR, permite alternar Celsius e Fahrenheit e não requer login nem chave de API. Os dados meteorológicos e de geocoding são fornecidos pela Open-Meteo.

## Functional Requirements

- **RF1 — Busca e seleção de cidade:** permitir pesquisar uma cidade por nome, exibir resultados correspondentes com cidade, região quando disponível e país, e exigir seleção explícita quando houver resultados.
- **RF2 — Clima atual:** para a cidade selecionada, exibir temperatura, condição meteorológica, umidade, velocidade do vento, pressão e precipitação atual, junto à identificação da cidade.
- **RF3 — Previsão de cinco dias:** exibir hoje e os quatro dias seguintes, com temperatura mínima e máxima, condição meteorológica, precipitação e velocidade máxima do vento para cada dia.
- **RF4 — Unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit e atualizar todos os valores de temperatura apresentados sem buscar os dados novamente.
- **RF5 — Estados e recuperação:** informar os estados inicial/vazio, carregamento e erro; em falhas recuperáveis, oferecer uma ação para tentar novamente.
- **RF6 — Cidades predefinidas e identidade:** apresentar a marca “Qual é o tempo?” e oferecer seleção direta de Curitiba, Maringá e Matinhos, no Paraná, para carregar suas condições e previsão.
- **RF7 — Previsão por hora e recomendação:** exibir a previsão horária do dia local e destacar uma sugestão prática baseada nas próximas três horas.

## User Stories

- **US1 — Busca:** Como decisor do dia a dia, quero buscar e selecionar minha cidade para consultar rapidamente o clima local.
- **US2 — Desambiguação:** Como viajante planejador, quero distinguir cidades com o mesmo nome pela região e pelo país para planejar a viagem com dados do destino correto.
- **US3 — Condições atuais:** Como decisor do dia a dia, quero ver as condições atuais da cidade selecionada para decidir o que vestir ou levar.
- **US4 — Planejamento:** Como viajante planejador, quero consultar a previsão de hoje e dos quatro dias seguintes para organizar meus planos.
- **US5 — Unidade familiar:** Como decisor do dia a dia, quero alternar entre Celsius e Fahrenheit para interpretar as temperaturas na unidade que conheço.
- **US6 — Recuperação:** Como viajante planejador, quero receber uma mensagem clara e poder tentar novamente quando a busca ou a previsão falhar.
- **US7 — Atalho para cidades do Paraná:** Como pessoa que consulta o clima local, quero escolher Curitiba, Maringá ou Matinhos com um botão para ver a previsão sem digitar uma busca.
- **US8 — Planejamento por hora:** Como pessoa que planeja o dia, quero acompanhar a previsão por horário e receber uma sugestão destacada para me preparar para chuva, sol forte ou frio.

## Acceptance Criteria

Os critérios usam o formato Dado / Quando / Então e podem ser verificados manualmente ou por testes automatizados.

### RF1 — Busca e seleção de cidade

- **Dado** que a tela de busca está disponível, **quando** a pessoa informa um nome de cidade e envia a busca, **então** são exibidos os resultados correspondentes com cidade e país, incluindo região quando fornecida pela fonte de dados.
- **Dado** que há mais de um resultado correspondente, **quando** os resultados são exibidos, **então** a pessoa consegue diferenciá-los e precisa selecionar um antes de carregar a previsão.
- **Dado** que uma cidade foi selecionada, **quando** a busca é concluída, **então** a cidade selecionada é identificada junto aos dados meteorológicos.

### RF2 — Clima atual

- **Dado** que uma cidade foi selecionada e a API retornou dados atuais, **quando** a previsão é apresentada, **então** são exibidos temperatura, condição, umidade, vento, pressão e precipitação.
- **Dado** que um campo meteorológico não foi retornado, **quando** os demais dados são apresentados, **então** o campo ausente é indicado sem impedir a exibição do restante da tela.

### RF3 — Previsão de cinco dias

- **Dado** que uma cidade foi selecionada e a API retornou previsão diária, **quando** a previsão é apresentada, **então** são exibidos exatamente cinco dias consecutivos, começando por hoje.
- **Dado** que um dia da previsão possui dados completos, **quando** esse dia é apresentado, **então** são mostradas as temperaturas mínima e máxima, condição, precipitação e velocidade máxima do vento.

### RF4 — Unidade de temperatura

- **Dado** que temperaturas em Celsius estão visíveis, **quando** a pessoa seleciona Fahrenheit, **então** a temperatura atual e todas as temperaturas mínima e máxima da previsão são convertidas e a unidade é indicada junto aos valores.
- **Dado** que a pessoa alterna a unidade, **quando** a conversão é concluída, **então** os dados meteorológicos já carregados são reutilizados sem uma nova requisição.
- **Dado** que Fahrenheit está selecionado, **quando** a pessoa retorna para Celsius, **então** todas as temperaturas voltam a ser exibidas em Celsius.

### RF5 — Estados e recuperação

- **Dado** que nenhuma cidade foi selecionada, **quando** a tela inicial é apresentada, **então** a pessoa recebe uma orientação para buscar uma cidade e não vê dados meteorológicos fictícios.
- **Dado** que uma busca ou carregamento de previsão está em andamento, **quando** a resposta ainda não chegou, **então** a interface indica que está carregando.
- **Dado** que a API retorna erro ou a conexão falha, **quando** a operação não pode ser concluída, **então** a interface apresenta uma mensagem compreensível e uma ação para tentar novamente.
- **Dado** que a busca é concluída sem cidades correspondentes, **quando** os resultados são apresentados, **então** a interface informa que nenhuma cidade foi encontrada.

### RF6 — Cidades predefinidas e identidade

- **Dado** que a aplicação é apresentada, **quando** a pessoa identifica a marca, **então** o nome visível é “Qual é o tempo?”.
- **Dado** que os atalhos de cidades estão disponíveis, **quando** a pessoa ativa Curitiba, Maringá ou Matinhos, **então** a previsão da cidade escolhida é carregada diretamente sem uma requisição de geocoding.
- **Dado** que a pessoa usa somente teclado, **quando** navega pelos atalhos, **então** cada cidade pode receber foco e ser selecionada com Enter ou Espaço.

### RF7 — Previsão por hora e recomendação

- **Dado** que uma cidade foi selecionada, **quando** a previsão é carregada, **então** a tela apresenta os horários disponíveis do dia local com hora, condição, temperatura e probabilidade de chuva.
- **Dado** que um campo horário esteja ausente, **quando** os outros dados são exibidos, **então** esse campo usa um marcador neutro sem ocultar as demais horas.
- **Dado** que há previsão para as próximas três horas, **quando** uma delas indicar probabilidade de chuva de pelo menos 50%, **então** a recomendação destacada orienta a levar guarda-chuva.
- **Dado** que não há o alerta de chuva, **quando** alguma das próximas três horas indicar índice UV de pelo menos 6, **então** a recomendação destacada alerta sobre sol forte e protetor solar.
- **Dado** que não há alertas de chuva ou UV, **quando** alguma das próximas três horas indicar temperatura de no máximo 10 °C, **então** a recomendação destacada orienta levar uma japona.
- **Dado** que nenhuma condição de alerta ocorre, **quando** a recomendação é exibida, **então** a interface informa que não há alerta importante nas próximas horas.

## Non-Functional Requirements

- **Performance:** a interface inicial deve ficar utilizável em menos de 2 segundos em uma conexão típica; durante operações de rede, deve fornecer feedback de carregamento.
- **Responsividade:** a experiência deve ser mobile-first e utilizável em larguras de 320 px até desktop, sem rolagem horizontal da página.
- **Acessibilidade:** controles devem ser operáveis por teclado, ter nomes acessíveis e foco visível; usar estrutura semântica e buscar contraste mínimo WCAG AA para texto.
- **Resiliência:** falhas de rede, respostas inválidas ou indisponibilidade da API não devem travar a interface; mensagens de erro devem permitir uma nova tentativa quando aplicável.
- **Publicação:** usar Open-Meteo sem chave de API ou segredo no cliente e permitir publicação como aplicação estática.
- **Idioma e localização:** textos da interface em pt-BR; datas e números devem ser apresentados em formato apropriado ao idioma e à localização da cidade.
- **Recomendação:** avaliar as próximas três horas na timezone da cidade; priorizar chuva (probabilidade ≥50%), depois UV (≥6), depois frio (temperatura ≤10 °C), com mensagem neutra quando não houver alerta.
- **Qualidade:** lint, build, testes unitários e testes E2E devem poder ser executados no projeto.

## Edge Cases

| Caso | Comportamento esperado |
| --- | --- |
| Campo de busca vazio ou contendo apenas espaços | Não enviar requisição e manter a orientação para informar uma cidade. |
| Cidade inexistente ou geocoding sem resultados | Exibir estado vazio informando que nenhuma cidade foi encontrada e permitir nova busca. |
| Nome de cidade com acentos, espaços ou caracteres especiais | Enviar a consulta sem quebrar a interface nem interpretar o texto como marcação ou código. |
| Nome compartilhado por várias cidades | Exibir resultados distinguíveis por região e país; não selecionar automaticamente um deles. |
| Erro ou indisponibilidade no serviço de geocoding | Informar que a busca não pôde ser concluída e permitir tentar novamente. |
| Falha no serviço de previsão após selecionar cidade | Manter a cidade identificada, apresentar erro e oferecer nova tentativa de carregamento. |
| Conexão lenta ou requisição que excede o tempo de espera | Manter indicação de carregamento enquanto aplicável; ao falhar, apresentar erro recuperável sem bloquear novas interações. |
| Resposta parcial com campo atual ou diário ausente | Exibir os dados disponíveis e um marcador neutro no campo ausente; não quebrar o layout. |
| Alternância de unidade antes da conclusão do carregamento | Preservar a unidade escolhida e aplicá-la aos dados quando forem exibidos. |
| Seleção de cidade predefinida | Carregar a cidade e coordenadas correspondentes sem passar pela busca ou selecionar outro resultado. |
| Resposta horária incompleta | Manter os horários e campos disponíveis e indicar os valores ausentes sem interromper o clima atual ou a previsão diária. |

## Assumptions

- A pessoa usuária tem acesso à internet na maior parte do tempo.
- A aplicação é de uso individual, sem conta, autenticação ou dados pessoais persistidos no servidor.
- Os navegadores suportados são versões modernas (evergreen).
- O serviço Open-Meteo fornece os dados necessários de geocoding, clima atual e previsão diária sem chave de API.
- A previsão de cinco dias compreende hoje mais os quatro dias seguintes, na data local da cidade consultada.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Limitação de requisições ou indisponibilidade da Open-Meteo | Média | Alto: buscas ou previsões podem ficar temporariamente indisponíveis. | Tratar erros, comunicar a falha e permitir nova tentativa. |
| Cidade ambígua ou resultado de geocoding incorreto | Alta | Médio: previsão de um local não desejado pode ser consultada. | Exibir região e país e exigir seleção explícita do resultado. |
| Falha ou lentidão da conexão da pessoa usuária | Média | Médio: a busca ou previsão pode não carregar. | Indicar carregamento, apresentar erro recuperável e evitar bloquear novas tentativas. |
| Exibição inconsistente em telas menores | Média | Médio: informações ou controles podem ficar difíceis de usar. | Projetar mobile-first e validar em larguras móveis e desktop. |
| Erro na conversão ou apresentação das unidades | Baixa | Alto: a pessoa pode interpretar incorretamente as temperaturas. | Usar conversões determinísticas, preservar Celsius internamente e cobrir a lógica com testes. |

## Out of Scope (v1)

- Login, contas de usuário ou sincronização entre dispositivos.
- Favoritos, histórico de buscas ou persistência de cidades.
- Solicitação automática de geolocalização.
- Idiomas além de pt-BR.
- Alertas, notificações push ou recomendações personalizadas além das regras locais e explicáveis de RF7.
- Uso offline ou garantia de dados meteorológicos atualizados sem conexão.

## Open Questions

Não há questões bloqueantes para a primeira versão. Fonte de dados, intervalo de cinco dias, unidade padrão, idioma, autenticação e geolocalização foram definidos no discovery. O timeout de rede depende do comportamento da plataforma e deve resultar no estado de erro recuperável descrito nesta especificação.

## Rastreabilidade

| User Story | Requisitos relacionados |
| --- | --- |
| US1 | RF1 |
| US2 | RF1 |
| US3 | RF2 |
| US4 | RF3 |
| US5 | RF4 |
| US6 | RF5 |
| US7 | RF6 |
| US8 | RF7 |