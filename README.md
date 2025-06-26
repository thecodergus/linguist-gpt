# ChatGPT Translator Extension for Translate-Tools/Linguist

Este repositório descreve uma extensão do **ChatGPT Translator**, que foi desenvolvida para integrar-se ao ecossistema de ferramentas de tradução, como as oferecidas pela extensão de navegador [Translate-Tools/Linguist](https://github.com/translate-tools/linguist). 

O principal objetivo dessa extensão é traduzir textos, documentos HTML inteiros e até mesmo código-fonte, respeitando suas estruturas originais, regras contextuais e oferecendo alta fidelidade no output traduzido.

---

## Funcionalidades Desenvolvidas

Esta extensão foi projetada para oferecer suporte avançado de tradução, incluindo:

### 1. **Tradução de Qualquer Idioma para Português Brasileiro**
   - A saída será sempre traduzida para **português brasileiro** independentemente do idioma de entrada.
   - O idioma de origem é identificado automaticamente.
   - Qualquer conteúdo textual encontrado (dentro de arquivos, HTML ou texto puro) é processado exclusivamente.

### 2. **Preservação Estrutural**
   - A extensão contém mecanismos explícitos para entender e respeitar a estrutura do conteúdo traduzido:
     - **HTML**: As tags, atributos (como `class`, `id`, ou `href`) e a hierarquia da página permanecem intactos. Apenas o texto visível para o usuário é traduzido.
     - **Código-Fonte**: Linguagens de programação como Python, JavaScript e outras são tratadas com cuidado. Comentários e strings são traduzidos, enquanto a lógica do código e a formatação original permanecem inalteradas.

### 3. **Saída Puramente Traduzida**
   - O modelo foi configurado para **retornar somente o conteúdo traduzido**, sem mensagens adicionais, explicações ou informações extras que possam poluir a saída.
   - Utilizando um encapsulamento explícito com a tag `<texto>`, delimitamos claramente os dados a serem processados.

### 4. **Delimitação de Conteúdo com Tags**
   - Todo conteúdo que o modelo interpretará é explicitamente delimitado pela estrutura:
     ```html
     <texto>
     (conteúdo aqui)
     </texto>
     ```
   - Isso evita ambiguidades e reduz a possibilidade de o modelo traduzir algo que não deveria.

---

## O que foi Implementado?

Aqui estão os detalhes específicos de melhorias feitas para que a extensão suporte as exigências e complexidades do Translate-Tools/Linguist:

1. **Prompt Personalizado para Tradução**
   - Um dos maiores desafios ao tratar linguagens de IA é garantir a obediência rígida às regras. Criamos um prompt altamente detalhado que:
     - Define o papel do modelo como "sistema de tradução automatizada".
     - Proíbe inclusões desnecessárias, forçando um retorno limpo e eficaz.
     - Estabelece a preservação total da estrutura HTML e código.

2. **Manuseio de Lotes (Batch)**
   - A extensão suporta operações em massa, permitindo a tradução paralela de múltiplos textos ao mesmo tempo.

3. **Adequação à Interface do Translate-Tools**
   - A extensão foi projetada para atender os métodos obrigatórios definidos pela interface `Translator`, incluindo funções como `translate()`, `translateBatch()`, `getLengthLimit()`, entre outras.

4. **Restrições de Comprimento e Timeout**
   - Adicionamos um controle rigoroso para lidar com textos de tamanhos maiores ou que exigem requisições longas:
     - Verifica e avisa quando o limite de caracteres é excedido.
     - Configura um tempo mínimo entre as requisições para evitar sobrecarregar a API.

5. **Combinação de Usabilidade e Performance**
   - A redução no `temperature` da API para 0.2 aumenta a precisão em vez de criatividade, essencial para manter a estrutura e a semântica do texto traduzido.
   - O método `checkLimitExceeding()` foi refatorado para retornar o número de caracteres excedentes (quando aplicável), seguindo a especificação da interface.

---

## Como Funciona?

Para cada execução de tradução, seja ela um único texto ou em lote, a extensão:
1. Delimita o conteúdo a ser processado com as tags `<texto>`.
2. Invoca o ChatGPT através da API OpenAI usando o prompt detalhado.
3. Garante a preservação estrutural (HTML/código) e retorna o conteúdo traduzido em português.

Um exemplo de como o texto traduzido pode ser encapsulado:

```html
<texto>
  Bem-vindo ao mundo da programação!
  <a class="link" href="https://example.com">Clique aqui</a> para aprender mais.
</texto>
```

---

## Aviso Importante
- Esta extensão não deve ser utilizada para propósitos que alterem ou manipulem código sensível sem validação humana.
- Sempre revise traduções críticas para assegurar que o significado foi preservado.
