'use client';

import { useState } from "react";

interface ParametroLegislacao {
    id_analise: number;
    id_parametro_legislacao: number;
    nome: string;
    simbolo: string;
}

/**
 * Hook para gerenciar a lógica interna da Barra de Filtros de Qualidade da Água.
 * 
 * Responsável por controlar a exibição dos filtros extras e a seleção de parâmetros.
 */
export const useBarraFiltrosQualidadeAgua = (
    parametros: ParametroLegislacao[],
    itensSelecionados: number[],
    aoMudarItensSelecionados: (itens: number[]) => void
) => {
    const [mostrarFiltrosExtras, setMostrarFiltrosExtras] = useState(false);

    const aoAlternarTodos = (selecionados: boolean) => {
        if (selecionados) {
            aoMudarItensSelecionados(parametros.map(p => p.id_analise));
        } else {
            aoMudarItensSelecionados([]);
        }
    };

    const aoAlternarParametro = (idAnalise: number) => {
        let novosSelecionados = [...itensSelecionados];
        if (novosSelecionados.includes(idAnalise)) {
            novosSelecionados = novosSelecionados.filter(id => id !== idAnalise);
        } else {
            novosSelecionados.push(idAnalise);
        }
        aoMudarItensSelecionados(novosSelecionados);
    };

    const alternarVisibilidadeFiltros = () => {
        setMostrarFiltrosExtras(!mostrarFiltrosExtras);
    };

    return {
        mostrarFiltrosExtras,
        aoAlternarTodos,
        aoAlternarParametro,
        alternarVisibilidadeFiltros
    };
};
