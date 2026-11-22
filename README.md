# RM Jardinagem

Landing page em português do Brasil para serviços de jardinagem e manutenção de áreas verdes.

## Visualização local

Execute `python3 -m http.server 8000` na raiz do repositório e acesse http://localhost:8000. A página é estática e dispensa instalação e compilação.

## Conteúdo

Os links de orçamento abrem o WhatsApp da RM Jardinagem com a mensagem inicial preenchida. O visitante confirma o envio no WhatsApp. As imagens de jardim e de atendimento são ilustrativas. A seção de avaliações está pronta para receber depoimentos autorizados de clientes.

## Conteúdo para publicação

- Confirme com a RM Jardinagem a disponibilidade dos serviços listados.
- A comparação e a galeria contêm imagens demonstrativas. Substitua-as por registros autorizados se houver fotos reais para publicar.
- Cadastre depoimentos autorizados em `reviews` de `assets/main.js`. Cada item aceita `name`, `service`, `rating` (inteiro de 0 a 5), `quote`, `portrait` opcional e `photos` opcional. As imagens usam objetos com `src` e `alt`. Indicadores confirmados podem ser cadastrados em `reviewFacts` como pares `label`/`value`, e parceiros e certificações em `reviewCredentials`.
- Ao definir o domínio público, use a URL absoluta da imagem no metadado `og:image`.
- Os eventos `whatsapp_click` e `quote_request` estão disponíveis no `dataLayer` com a origem em `cta_location`. O formulário monta a mensagem localmente e abre o WhatsApp para o visitante confirmar o envio.
