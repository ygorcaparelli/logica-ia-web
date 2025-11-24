🧠 Estratégia de Tradução

Para garantir precisão nas traduções entre Linguagem Natural (NL) e Lógica Proposicional (CPC), o agente utiliza as seguintes estratégias fundamentais:

1. Normalização e Preparação do Texto

Antes de interpretar a frase, o sistema aplica uma limpeza estruturada:

🔤 Converte tudo para minúsculas

🧹 Remove pontuações como . , ? !

✂️ Elimina espaços duplicados

🔍 Simplifica padrões linguísticos

Essa etapa garante que a frase seja analisada de forma mais consistente e previsível.

2. Identificação de Estruturas da Linguagem Natural (NL → CPC)

O agente reconhece automaticamente padrões comuns da lógica expressos em português:

Conectivos e suas traduções:

Conjunção (∧) → “e”

Disjunção (∨) → “ou”

Negação (¬) → “não”, “não é verdade que”

Condicional (→) → “se … então …”

Bicondicional (↔) → “se e somente se”

Exemplos de mapeamento:

“Se X então Y” → X → Y

“X e Y” → X ∧ Y

“X ou Y” → X ∨ Y

“não X” → ¬X

O sistema também cria parênteses quando necessário, garantindo a precedência correta dos operadores.

3. Atribuição Automática de Proposições (P, Q, R…)

Cada trecho atômico da frase recebe uma letra proposicional:

Primeiro termo → P

Segundo termo → Q

Terceiro termo → R

Exemplo:
“Se estudar e revisar, então passo na prova.”

→ Fórmula gerada:
(P ∧ Q) → R
→ Mapeamento:

P = estudar

Q = revisar

R = passo na prova

4. Tokenização da Fórmula (CPC → NL)

A fórmula inserida é quebrada em partes (tokens):

Letras proposicionais: P, Q, R, S…

Conectivos: ¬, ∧, ∨, →, ↔

Alternativas aceitas: ~, ^, v, ->, <->

Parênteses: ( e )

Isso permite interpretar corretamente a estrutura da expressão lógica.

5. Parser com Precedência Lógica

O sistema analisa a expressão considerando a hierarquia correta dos operadores:

Negação (¬)

Conjunção (∧)

Disjunção (∨)

Implicação (→)

Bicondicional (↔)

Essa análise gera uma árvore sintática (AST), usada para reconstruir a frase em português.

6. Reconstrução da Frase em Português (CPC → NL)

Com a árvore sintática e os significados definidos pelo usuário, o agente reescreve a fórmula como uma frase natural:

∧ → “e”

∨ → “ou”

¬X → “não X”

X → Y → “se X, então Y”

X ↔ Y → “X se e somente se Y”

O resultado final é uma frase clara, coerente e fiel à estrutura lógica da fórmula.



📊 Exemplos de Input/Output e Análise

A seguir apresentamos alguns casos de teste utilizados para validar o funcionamento e a precisão do agente na tradução entre Linguagem Natural (NL) e Fórmulas do Cálculo Proposicional Clássico (CPC).

✅ Caso de Sucesso – Simples

Léxico:

P = está chovendo

Q = vou ao cinema

Input (NL):

“Se não estiver chovendo, então vou ao cinema.”

Output esperado:

¬P → Q


Resultado do agente:

¬P → Q


Análise:
O agente identificou corretamente a estrutura condicional (“se… então…”) e aplicou adequadamente a negação no antecedente (“não estar chovendo”). A fórmula gerada corresponde exatamente ao significado lógico da frase.

✅ Caso de Sucesso – Complexo

Léxico:

P = estudo

Q = passo na prova

R = fico feliz

Input (NL):

“Estudar é condição necessária e suficiente para passar na prova e ficar feliz.”

Resultado do agente:

P ↔ (Q ∧ R)


Análise:
O agente reconheceu a expressão “necessária e suficiente” como um bicondicional (↔).
Além disso, entendeu que “passar na prova e ficar feliz” representa uma conjunção, agrupando corretamente como (Q ∧ R).
A precedência dos operadores foi respeitada, produzindo uma fórmula formal e precisa.

⚠️ Caso de Ambiguidade – Limitação Conhecida

Léxico:

P = como bolo

Q = como sorvete

Input (NL):

“Eu como bolo ou sorvete.”

Resultado do agente:

P ∨ Q


Análise:
O conectivo “ou” em português pode ter dois sentidos: inclusivo ou exclusivo.
Como o Cálculo Proposicional Clássico usa ∨ como ou inclusivo, o agente produz P ∨ Q.

Entretanto, se a intenção do usuário fosse “um ou outro, mas não ambos”, o agente não poderia identificar isso automaticamente, pois esse seria um caso de XOR (ou exclusivo), não representado no CPC padrão.

🚧 Limitações e Possibilidades de Melhoria

Embora o agente seja eficiente dentro do escopo proposto, algumas limitações são inerentes ao processo:

🟡 Ambiguidade Linguística

Expressões como

“Ele viu o homem com o telescópio”
podem gerar múltiplas interpretações e, portanto, múltiplas fórmulas possíveis.
O agente não tem contexto suficiente para decidir qual interpretação é correta.

🟡 Ausência de Lógica de Predicados

O sistema trabalha apenas com proposições completas (V ou F).
Não suporta quantificadores como ∀ (para todo) ou ∃ (existe), típicos da Lógica de Primeira Ordem.

🟡 Dependência da Estrutura da Frase

Frases muito longas, informais ou com múltiplas orações subordinadas podem dificultar o reconhecimento dos padrões lógicos.

🚀 Melhorias Futuras

Para aprimorar o agente, algumas evoluções planejadas são:

✔ Implementar um validador sintático mais robusto do lado CPC → NL

✔ Suporte a lógica de predicados (quantificadores)

✔ Expansão do conjunto de padrões reconhecidos no NL → CPC

✔ Histórico de traduções para permitir ajustes progressivos

✔ Interface visual mais interativa com destaque dos conectivos


👨‍💻 Autor

Desenvolvido por: Ygor Caparelli
Trabalho acadêmico — UNIFACEF
