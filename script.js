/* ================================
   TABS
================================ */
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const panelNL = document.getElementById("panel-nl");
    const panelCPC = document.getElementById("panel-cpc");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            if (tab.dataset.tab === "nl") {
                panelNL.classList.remove("hidden");
                panelCPC.classList.add("hidden");
            } else {
                panelCPC.classList.remove("hidden");
                panelNL.classList.add("hidden");
            }
        });
    });

    document.getElementById("btnNlToCpc").addEventListener("click", nlToCpc);
    document.getElementById("btnCpcToNl").addEventListener("click", cpcToNl);
});

/* ================================
   NL → CPC
================================ */
function normalize(text) {
    return text.toLowerCase()
        .replace(/[.,!?]/g, "")
        .trim();
}

function nlToCpc() {
    const input = document.getElementById("nlInput").value.trim();
    const out = document.getElementById("nlOutput");

    if (!input) {
        out.innerText = "Digite uma frase.";
        return;
    }

    const text = normalize(input);
    let nextCode = "P".charCodeAt(0);

    const map = {};

    function getSymbol(sentence) {
        if (!map[sentence]) {
            map[sentence] = String.fromCharCode(nextCode++);
        }
        return map[sentence];
    }

    function parseAtom(part) {
        part = part.trim();
        let neg = false;

        if (part.startsWith("não ")) {
            neg = true;
            part = part.replace("não ", "");
        }
        return neg ? "¬" + getSymbol(part) : getSymbol(part);
    }

    function parseOps(text) {
        if (text.includes(" e ")) {
            return "(" + text.split(" e ").map(parseAtom).join(" ∧ ") + ")";
        }
        if (text.includes(" ou ")) {
            return "(" + text.split(" ou ").map(parseAtom).join(" ∨ ") + ")";
        }
        return parseAtom(text);
    }

    let formula = "";

    if (text.startsWith("se ") && text.includes(" então ")) {
        const [, left, right] = text.match(/se (.+) então (.+)/);
        formula = parseOps(left) + " → " + parseOps(right);
    } else {
        formula = parseOps(text);
    }

    let result = "Fórmula: " + formula + "\n\nMapeamento:\n";
    for (const [phrase, letter] of Object.entries(map)) {
        result += `${letter} = ${phrase}\n`;
    }

    out.innerText = result;
}

/* ================================
   CPC → NL
================================ */

function tokenize(str) {
    const tokens = [];
    let i = 0;

    while (i < str.length) {
        const ch = str[i];

        if (/\s/.test(ch)) { i++; continue; }
        if (/[A-Z]/.test(ch)) { tokens.push({ type: "VAR", value: ch }); i++; continue; }
        if (["(", ")"].includes(ch)) { tokens.push({ type: ch }); i++; continue; }
        if (ch === "¬" || ch === "~") { tokens.push({ type: "NOT" }); i++; continue; }
        if (ch === "∧" || ch === "^") { tokens.push({ type: "AND" }); i++; continue; }
        if (ch === "∨" || ch === "v") { tokens.push({ type: "OR" }); i++; continue; }
        if (ch === "-" && str[i+1] === ">") { tokens.push({ type: "IMP" }); i += 2; continue; }
        if (ch === "<" && str[i+1] === "-" && str[i+2] === ">") { tokens.push({ type: "BIC" }); i += 3; continue; }

        throw new Error("Símbolo inválido: " + ch);
    }
    return tokens;
}

function parseFormula(tokens) {
    let pos = 0;

    function peek() { return tokens[pos] || null; }
    function consume() { return tokens[pos++]; }

    function parsePrimary() {
        const t = peek();
        if (!t) throw new Error("Expressão inválida");
        if (t.type === "VAR") { consume(); return { type: "var", name: t.value }; }
        if (t.type === "(") {
            consume();
            const expr = parseBic();
            if (!peek() || peek().type !== ")") throw new Error("Faltou fechar parênteses");
            consume();
            return expr;
        }
        throw new Error("Token inesperado: " + t.type);
    }

    function parseNot() {
        const t = peek();
        if (t && t.type === "NOT") { consume(); return { type: "not", child: parseNot() }; }
        return parsePrimary();
    }

    function parseAnd() {
        let node = parseNot();
        while (peek() && peek().type === "AND") {
            consume();
            node = { type: "bin", op: "∧", left: node, right: parseNot() };
        }
        return node;
    }

    function parseOr() {
        let node = parseAnd();
        while (peek() && peek().type === "OR") {
            consume();
            node = { type: "bin", op: "∨", left: node, right: parseAnd() };
        }
        return node;
    }

    function parseImp() {
        let node = parseOr();
        while (peek() && peek().type === "IMP") {
            consume();
            node = { type: "bin", op: "→", left: node, right: parseOr() };
        }
        return node;
    }

    function parseBic() {
        let node = parseImp();
        while (peek() && peek().type === "BIC") {
            consume();
            node = { type: "bin", op: "↔", left: node, right: parseImp() };
        }
        return node;
    }

    return parseBic();
}

function collectVars(ast, set = new Set()) {
    if (ast.type === "var") set.add(ast.name);
    if (ast.left) collectVars(ast.left, set);
    if (ast.right) collectVars(ast.right, set);
    if (ast.child) collectVars(ast.child, set);
    return set;
}

function astToText(ast, map) {
    if (ast.type === "var") return map[ast.name] || "proposição " + ast.name;
    if (ast.type === "not") return "não " + astToText(ast.child, map);
    if (ast.op === "∧") return astToText(ast.left, map) + " e " + astToText(ast.right, map);
    if (ast.op === "∨") return astToText(ast.left, map) + " ou " + astToText(ast.right, map);
    if (ast.op === "→") return "se " + astToText(ast.left, map) + ", então " + astToText(ast.right, map);
    if (ast.op === "↔") return astToText(ast.left, map) + " se e somente se " + astToText(ast.right, map);
}

function cpcToNl() {
    const input = document.getElementById("cpcInput").value.trim();
    const output = document.getElementById("cpcOutput");

    try {
        const tokens = tokenize(input);
        const ast = parseFormula(tokens);
        const vars = collectVars(ast);

        const container = document.getElementById("varContainer");
        container.innerHTML = "";

        const map = {};

        vars.forEach(v => {
            const div = document.createElement("div");
            div.className = "var-item";

            div.innerHTML = `
                <label>${v}:</label>
                <input id="var_${v}" placeholder="Descreva ${v}">
            `;

            container.appendChild(div);
        });

        /////////////////////
        // TRADUZIR DEPOIS //
        /////////////////////

        setTimeout(() => {
            vars.forEach(v => {
                const val = document.getElementById("var_" + v)?.value;
                map[v] = val || "";
            });

            output.innerText = astToText(ast, map);
        }, 50);

    } catch (err) {
        output.innerText = "Erro: " + err.message;
    }
}
