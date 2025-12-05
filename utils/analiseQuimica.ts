// utils/analiseQuimica.ts

// Tipos
export interface ParametroPortaria {
  nome: string;
  limite: string;
  unidade: string;
  chaveBackend: string;
  tipo: "pH" | "maximo" | "ausente" | "numerico";
  min?: number;
  max?: number;
}

export interface ResultadoVerificacao {
  atende: boolean;
  mensagem: string;
  status: "ok" | "alerta" | "ausente";
}

// Parâmetros da portaria GM/MS nº 888/2021
export const parametrosPortaria: Record<string, ParametroPortaria> = {
  pH: {
    nome: "pH",
    limite: "6,0 a 9,0",
    min: 6.0,
    max: 9.0,
    unidade: "",
    chaveBackend: "pH",
    tipo: "pH",
  },
  sulfato: {
    nome: "Sulfatos",
    limite: "250 mg/L (máx)",
    max: 250,
    unidade: "mg/L",
    chaveBackend: "sulfato",
    tipo: "maximo",
  },
  ferroTotal: {
    nome: "Ferro Total",
    limite: "0,30 mg/L (máx)",
    max: 0.3,
    unidade: "mg/L",
    chaveBackend: "ferroTotal",
    tipo: "maximo",
  },
  manganesTotal: {
    nome: "Manganês Total",
    limite: "0,10 mg/L (máx)",
    max: 0.1,
    unidade: "mg/L",
    chaveBackend: "manganesTotal",
    tipo: "maximo",
  },
  durezaTotal: {
    nome: "Dureza Total",
    limite: "300 mg/L (máx)",
    max: 300,
    unidade: "mg/L",
    chaveBackend: "durezaTotal",
    tipo: "maximo",
  },
  coliformesTotais: {
    nome: "Coliformes Totais",
    limite: "Ausente",
    unidade: "",
    chaveBackend: "coliformesTotais",
    tipo: "ausente",
  },
  escherichiaColi: {
    nome: "Análise Microbiológica (E. coli)",
    limite: "Ausente",
    unidade: "",
    chaveBackend: "escherichiaColi",
    tipo: "ausente",
  },
  turbidez: {
    nome: "Turbidez",
    limite: "5,0 NTU (máx)",
    max: 5.0,
    unidade: "NTU",
    chaveBackend: "turbidez",
    tipo: "maximo",
  },
  cor: {
    nome: "Cor",
    limite: "15 Hazen (máx)",
    max: 15,
    unidade: "Hazen",
    chaveBackend: "cor",
    tipo: "maximo",
  },
};

/**
 * Extrai valor numérico de uma string
 * Exemplos: "10,5 mg/L" → 10.5, "Ausente" → 0
 */
export const extrairValorNumerico = (valor: string): number | null => {
  if (
    !valor ||
    valor === "ND" ||
    valor === "Ausente" ||
    valor === "< 0,1" ||
    valor === "ND"
  )
    return 0;

  // Remove texto e mantém apenas números e vírgula/ponto
  const match = valor.match(/[0-9,]+(\.[0-9]+)?/);
  if (!match) return null;

  const numeroStr = match[0].replace(",", ".");
  return parseFloat(numeroStr);
};

/**
 * Verifica se um valor atende aos limites da portaria
 */
export const verificarLimite = (
  parametroChave: string,
  valor: string,
  parametrosPortaria: Record<string, ParametroPortaria>
): ResultadoVerificacao => {
  const config = parametrosPortaria[parametroChave];

  // Se não tem valor nos dados
  if (!valor || valor.trim() === "") {
    return {
      atende: false,
      mensagem: "Dado não disponível",
      status: "ausente",
    };
  }

  // Para coliformes totais (deve ser "Ausente")
  if (config.tipo === "ausente") {
    const valorLower = valor.toLowerCase();
    const atende =
      valorLower === "ausente" || valorLower === "0" || valor === "< 0,1";
    return {
      atende,
      mensagem: atende ? "Atende: Ausente" : `Presente: ${valor}`,
      status: atende ? "ok" : "alerta",
    };
  }

  const valorNumerico = extrairValorNumerico(valor);

  if (valorNumerico === null) {
    return {
      atende: true,
      mensagem: `Valor: ${valor}`,
      status: "ok",
    };
  }

  let atende = true;
  let mensagem = `Limite: ${config.limite}`;

  if (config.tipo === "pH") {
    atende =
      valorNumerico >= (config.min || 0) &&
      valorNumerico <= (config.max || 0);
    mensagem = atende
      ? `pH ${valorNumerico} (dentro do limite: ${config.limite})`
      : `pH ${valorNumerico} (fora do limite: ${config.limite})`;
  } else if (config.tipo === "maximo") {
    atende = valorNumerico <= (config.max || 0);
    mensagem = atende
      ? `${valorNumerico} ${config.unidade} (dentro do limite: ${config.limite})`
      : `${valorNumerico} ${config.unidade} (fora do limite: ${config.limite})`;
  }

  return {
    atende,
    mensagem,
    status: atende ? "ok" : "alerta",
  };
};


export const obterCorCard = (status: "ok" | "alerta" | "ausente"): string => {
  switch (status) {
    case "ok":
      return "bg-gray-800 border-green-500";
    case "alerta":
      return "bg-red-900/30 border-red-500";
    case "ausente":
      return "bg-yellow-900/30 border-yellow-500";
    default:
      return "bg-gray-900";
  }
};

/**
 * Formata valor para exibição (opcional)
 */
export const formatarValorAnalise = (valor: string): string => {
  if (!valor) return "N/D";
  return valor;
};