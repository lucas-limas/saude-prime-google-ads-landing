# Saúde Prime — Landing de Conversão para Google Ads

## Objetivo

Landing page focada em geração de leads para campanhas de Google Ads no segmento de planos de saúde.

A página usa um simulador em 4 etapas para reduzir fricção, coletar informações comerciais úteis e direcionar o lead para WhatsApp.

## Arquivos

- `index.html` — estrutura da landing
- `style.css` — visual responsivo
- `script.js` — simulador, WhatsApp, UTMs e eventos de tracking
- `README.md` — instruções

## 1. WhatsApp

Em `script.js`, altere:

`const WHATSAPP_NUMBER = "5561995585240";`

Use o número comercial no formato internacional, sem espaços, parênteses ou símbolos.

## 2. Google Ads / GA4

No `index.html`, há um bloco comentado para inserir Google Tag / GA4.

Substitua:

- `G-XXXXXXXXXX`
- `AW-XXXXXXXXXX`

pelos seus IDs reais.

Eventos preparados:

- `landing_view`
- `cta_click`
- `lead_step_view`
- `lead_step_selection`
- `generate_lead`

## 3. UTMs e GCLID

A página captura automaticamente:

- utm_source
- utm_medium
- utm_campaign
- utm_term
- utm_content
- gclid

O `gclid` fica disponível no objeto `tracking` do JavaScript. Para mensuração mais avançada, envie esse valor ao CRM junto com o lead e faça importação de conversões offline no Google Ads.

## 4. Estratégia de campanha

Idealmente crie páginas/URLs específicas para grupos de anúncios, mantendo correspondência entre:

palavra-chave → anúncio → landing → CTA.

Exemplo:

`/plano-de-saude/`

`/plano-de-saude/medsenior/`

`/plano-de-saude/empresarial/`

Evite mandar todos os anúncios para uma única página genérica se as intenções de busca forem muito diferentes.

## 5. Compliance

Antes de publicar:

- informe CNPJ, endereço e dados reais da corretora;
- publique uma política de privacidade real;
- confirme autorização comercial e produtos que sua corretora pode ofertar;
- revise qualquer afirmação sobre preço, rede, cobertura, carência ou benefícios;
- não solicite diagnóstico ou outras informações médicas no formulário inicial;
- valide textos publicitários com a operadora e regras aplicáveis.

## 6. Mobile

A landing foi projetada mobile-first na experiência do formulário, porque boa parte do tráfego de campanhas pode chegar por smartphone.

## 7. Próximas melhorias recomendadas

1. Criar página específica por intenção de busca.
2. Integrar formulário diretamente ao CRM.
3. Registrar `gclid` no CRM.
4. Importar conversões qualificadas/offline para o Google Ads.
5. Criar página de obrigado em vez de depender apenas do WhatsApp.
6. Testar duas versões do hero e do formulário.
7. Medir não apenas leads, mas leads qualificados e vendas.
