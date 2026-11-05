# Discovery — Requisitos do Weather App

## Contexto

Aplicação web de previsão do tempo para consultas rápidas e planejamento pessoal. A pessoa usuária busca uma cidade e consulta as condições atuais e a previsão para os próximos cinco dias. A experiência deve priorizar dispositivos móveis, com suporte também para desktop.

## Requisitos Funcionais

- **RF1 — Buscar cidade:** permitir busca por nome e apresentar informações suficientes para diferenciar cidades homônimas.
- **RF2 — Clima atual:** exibir temperatura, condição meteorológica, umidade, vento, pressão e precipitação.
- **RF3 — Previsão:** exibir a previsão de cinco dias, incluindo temperaturas mínima e máxima, condição e informações de vento e precipitação.
- **RF4 — Unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit e atualizar os valores exibidos.
- **RF5 — Estados da interface:** apresentar estados de carregamento, erro e ausência de resultados, com uma forma de tentar novamente quando apropriado.

## Requisitos Não-Funcionais

- **RNF1 — Performance:** a carga inicial deve levar menos de 2 segundos em uma conexão típica; a resposta à busca deve ser percebida como rápida.
- **RNF2 — Responsividade:** adotar abordagem mobile-first e funcionar em larguras de 320 px até desktop.
- **RNF3 — Acessibilidade:** oferecer navegação por teclado, elementos semânticos com nomes acessíveis e contraste básico compatível com WCAG AA.
- **RNF4 — Resiliência:** lidar com falhas de rede ou da API sem interromper a aplicação, informando a pessoa usuária e permitindo nova tentativa.
- **RNF5 — Simplicidade de publicação:** usar uma fonte de dados pública que não exija chave de API, permitindo publicação estática.
- **RNF6 — Clareza das mensagens:** comunicar erros em linguagem compreensível, sem depender de detalhes técnicos da API.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Limitação de requisições ou indisponibilidade da API | Média | Alto: consultas podem falhar ou ficar indisponíveis. | Tratar erros e indisponibilidade, informar a pessoa usuária e considerar cache leve. |
| Cidade ambígua ou geocodificada incorretamente | Alta | Médio: pode ser exibida a previsão de um local diferente do desejado. | Mostrar região e país nas sugestões para permitir desambiguação. |
| Diferenças de layout entre dispositivos | Média | Médio: controles ou dados podem ficar difíceis de usar em telas menores. | Projetar mobile-first e validar em viewports móveis e desktop. |
| Falha de rede do usuário | Média | Médio: a busca ou atualização da previsão não será concluída. | Exibir estado de erro claro e oferecer ação para tentar novamente. |
| Conversão de unidade incorreta | Baixa | Alto: temperaturas apresentadas podem induzir decisões inadequadas. | Centralizar conversões em funções testáveis e cobri-las com testes unitários. |

## Perguntas em Aberto (Open Questions)

1. Qual fonte de dados será usada e ela exige chave ou tem custos? **Impacto:** determina integração, segurança de credenciais e custo de operação.
2. O que significa “previsão de cinco dias”: hoje mais quatro dias ou os cinco dias seguintes? **Impacto:** altera o intervalo de datas e a quantidade de itens exibidos.
3. A aplicação deve solicitar geolocalização automaticamente? **Impacto:** afeta permissões, privacidade e o fluxo inicial de busca.
4. Qual unidade deve ser selecionada inicialmente? **Impacto:** define os valores vistos antes de qualquer interação com o controle de unidade.
5. É necessário oferecer suporte offline ou armazenar resultados em cache? **Impacto:** afeta a complexidade, a atualidade dos dados e o comportamento sem rede.
6. Quais idiomas devem ser suportados? **Impacto:** determina requisitos de tradução, formatação de datas e apresentação de unidades.
7. É necessário salvar histórico de buscas ou cidades favoritas? **Impacto:** pode exigir persistência local, novos fluxos de interface e regras de privacidade.

## Suposições (Assumptions)

- A aplicação será usada principalmente com acesso à internet.
- O uso é individual e não requer autenticação.
- Os navegadores-alvo são versões modernas (evergreen).
- A primeira versão não precisa armazenar dados em um servidor.

## Personas

- **Viajante planejador:** consulta a previsão da semana para organizar atividades e viagens; usa desktop e celular.
- **Decisor do dia a dia:** consulta rapidamente o clima atual para decidir o que vestir ou levar; usa principalmente o celular.

## Decisões

- **Fonte de dados:** Open-Meteo para geocoding e previsão, sem chave de API, por ser uma fonte pública adequada à publicação estática.
- **Período da previsão:** cinco dias, contando hoje e os quatro dias seguintes, para deixar explícito o intervalo exibido.
- **Unidade padrão:** Celsius; Fahrenheit permanece disponível pelo controle de unidade.
- **Autenticação e persistência:** não haverá autenticação nem persistência em servidor na primeira versão, pois o produto é de uso individual.
- **Idioma da interface:** pt-BR.
- **Geolocalização automática:** não será solicitada na primeira versão; a consulta começa pela busca manual de cidade.