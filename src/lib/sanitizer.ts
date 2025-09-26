// Sanitizador para código ASM (VonSim / AC)
// Mantiene: ORG, DB/DW (también si empiezan la línea), EQU (opcional), etiquetas "X:"
// e instrucciones del set permitido. Remueve el resto.

const ALLOWED_MNEMONICS = new Set([
    // Transferencia de datos
    "MOV","PUSH","POP","PUSHF","POPF","IN","OUT",
    // Aritméticas
    "ADD","ADC","SUB","SBB","CMP","NEG","INC","DEC",
    // Lógicas
    "AND","OR","XOR","TEST","NOT",
    // Interrupciones / flags
    "INT","IRET","CLI","STI",
    // Transferencia de control
    "CALL","RET","JC","JNC","JZ","JNZ","JS","JNS","JO","JNO","JMP",
    // Control
    "NOP","HLT"
  ]);
  
  // Directivas del ensamblador (podés ajustar)
  const ALLOWED_DIRECTIVES = new Set(["ORG","DB","DW","EQU"]); // EQU opcional
  
  // Regex helpers
  const RE_COMMENT = /;.*/;                               // todo lo que sigue a ';'
  const RE_LABEL   = /^[A-Za-z_][\w]*:$/;                 // etiqueta sola, p. ej. RUT_F10:
  const RE_VAR     = /^[A-Za-z_][\w]*\s+(DB|DW)\b/i;      // var DB/DW ...
  const RE_DIRECTIVE_LINE_START = /^(DB|DW)\b/i;          // línea que empieza con DB/DW
  const RE_EQU     = /^[A-Za-z_][\w]*\s+EQU\b/i;          // nombre EQU valor
  const RE_ORG     = /^ORG\b/i;                           // ORG direccion (hex/dec)
  const RE_WS_COMMAS = /\s*,\s*/g;                        // espacios alrededor de comas
  
  /**
   * Sanitiza código ASM:
   * - quita comentarios y líneas vacías
   * - conserva: ORG, etiquetas, DB/DW/EQU, mnemónicos válidos
   * - normaliza espacios
   */
  export function sanitizeAsm(input: string): string {
    const lines = input.replace(/\r\n?/g, "\n").split("\n");
    const out: string[] = [];
  
    for (const raw of lines) {
      // 1) quitar comentarios
      const line = raw.replace(RE_COMMENT, "").trim();
      if (!line) continue;
  
      // 2) ¿Etiqueta sola?
      if (RE_LABEL.test(line)) {
        out.push(line.toUpperCase()); // mayus para uniformidad
        continue;
      }
  
      // 3) ¿Directivas?
      // 3.1 ORG
      if (RE_ORG.test(line)) {
        // Normalizar "ORG 2000H" -> "ORG 2000H"
        out.push(normalizeDirective(line));
        continue;
      }
      // 3.2 EQU (si querés permitirla)
      if (RE_EQU.test(line) && ALLOWED_DIRECTIVES.has("EQU")) {
        out.push(normalizeDirective(line));
        continue;
      }
      // 3.3 Variables tipo: var DB ... / var DW ...
      if (RE_VAR.test(line)) {
        out.push(normalizeDirective(line));
        continue;
      }
      // 3.4 Línea que empieza con DB/DW sin etiqueta
      if (RE_DIRECTIVE_LINE_START.test(line)) {
        out.push(normalizeDirective(line));
        continue;
      }
  
      // 4) ¿Instrucción?
      //    Primer token = posible mnemónico
      const firstTok = line.split(/\s+/)[0].toUpperCase();
      if (ALLOWED_MNEMONICS.has(firstTok)) {
        out.push(normalizeInstruction(line));
        continue;
      }
  
      // 5) Nada de lo anterior → descartar
    }
  
    // 6) Colapsar líneas vacías múltiples
    return collapseBlankLines(out.join("\n")).trim();
  }
  
  function normalizeDirective(s: string): string {
    // Uppercase el mnemon/directiva y etiqueta si corresponde; respeta operandos
    // p.ej.: "org 2000h" → "ORG 2000H", "var db 1,2" → "VAR DB 1,2"
    const parts = s.split(/\s+/);
    // Si es "label DB ..." queremos label en mayus y el "DB" en mayus
    if (parts.length >= 2 && /^(DB|DW|EQU)$/i.test(parts[1])) {
      parts[0] = parts[0].toUpperCase();    // label
      parts[1] = parts[1].toUpperCase();    // DB/DW/EQU
      const rest = s.slice(s.indexOf(parts[1]) + parts[1].length).replace(RE_WS_COMMAS, ", ");
      return `${parts[0]} ${parts[1]}${rest}`;
    }
    // Directiva que inicia la línea (ORG / DB / DW)
    parts[0] = parts[0].toUpperCase();
    const rest = s.slice(s.indexOf(parts[0]) + parts[0].length);
    return `${parts[0]}${rest}`.replace(RE_WS_COMMAS, ", ").replace(/\s+/g, " ").trim();
  }
  
  function normalizeInstruction(s: string): string {
    // Uppercase del mnemónico, normalizar comas y espacios
    const trimmed = s.trim().replace(RE_WS_COMMAS, ", ");
    const firstSpace = trimmed.indexOf(" ");
    if (firstSpace === -1) return trimmed.toUpperCase();
    const op = trimmed.slice(0, firstSpace).toUpperCase();
    const args = trimmed.slice(firstSpace + 1).replace(/\s+/g, " ");
    return `${op} ${args}`.trim();
  }
  
  function collapseBlankLines(s: string): string {
    return s.replace(/\n{2,}/g, "\n");
  }
  