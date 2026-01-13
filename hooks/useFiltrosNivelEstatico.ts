'use client';

import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { getPiezometrosAtivos } from "@/service/nivelEstaticoApis";

export interface PiezometroOpcao {
    label: string;
    value: number;
    tipo: string;
}

export interface FiltrosNivelEstatico {
    idSelecionado: number | null;
    tipoSelecionado: string | null;
    tipoFiltroSelecionado: string | null;
    dataInicio: Date | null;
    dataFim: Date | null;
    porDia: boolean;
}

/**
 * Hook especializado em gerenciar os filtros e as opções de piezômetros para a tela de Nível Estático.
 * 
 * Responsável por:
 * 1. Manter o estado dos filtros (Piezômetro, Período, Tipo de Visualização).
 * 2. Buscar as opções de piezômetros ativos no banco de dados.
 * 3. Filtrar a lista de piezômetros por categoria (PP, PR, PV, PC).
 */
export const useFiltrosNivelEstatico = () => {
    const [filtros, setFiltros] = useState<FiltrosNivelEstatico>({
        idSelecionado: null,
        tipoSelecionado: null,
        tipoFiltroSelecionado: null,
        dataInicio: null,
        dataFim: null,
        porDia: false
    });

    const [piezometros, setPiezometros] = useState<PiezometroOpcao[]>([]);
    const [estaCarregandoOpcoes, setEstaCarregandoOpcoes] = useState(false);

    // Opções constantes para o dropdown de categoria/tipo
    const opcoesFiltroTipo = [
        { label: "Todos os Tipos", value: null },
        { label: "PP - Piezômetro de Profundidade", value: "PP" },
        { label: "PR - Régua", value: "PR" },
        { label: "PV - Ponto de Vazão", value: "PV" },
        { label: "PC - Calhas", value: "PC" },
        { label: "PB - Piezômetro de Bacia", value: "PB" },
    ];

    // Carrega a lista de piezômetros baseada na categoria selecionada
    const carregarPiezometros = useCallback(async (tipoCategoria: string | null) => {
        setEstaCarregandoOpcoes(true);
        try {
            const filtroArray = tipoCategoria ? [tipoCategoria] : [];
            const resposta = await getPiezometrosAtivos(filtroArray);

            const formatados = resposta.data.map((p: any) => ({
                label: `${p.idPiezometro} - ${p.nomePiezometro} (${p.tipoPiezometro})`,
                value: p.cdPiezometro,
                tipo: p.tipoPiezometro
            }));

            setPiezometros(formatados);

            // Se o piezômetro que estava selecionado não existe na nova lista (após mudar categoria), limpamos a seleção
            setFiltros(prev => {
                if (prev.idSelecionado && !formatados.find((p: any) => p.value === prev.idSelecionado)) {
                    return { ...prev, idSelecionado: null, tipoSelecionado: null };
                }
                return prev;
            });
        } catch (erro) {
            console.error("Erro ao carregar piezômetros para o filtro:", erro);
            Swal.fire({ icon: "error", title: "Erro", text: "Não foi possível carregar a lista de piezômetros." });
        } finally {
            setEstaCarregandoOpcoes(false);
        }
    }, []);

    // Atualiza a lista sempre que o filtro de categoria mudar
    useEffect(() => {
        carregarPiezometros(filtros.tipoFiltroSelecionado);
    }, [filtros.tipoFiltroSelecionado, carregarPiezometros]);

    // Atualiza o estado dos filtros de forma genérica
    const atualizarFiltros = useCallback((novosFiltros: Partial<FiltrosNivelEstatico>) => {
        setFiltros(prev => ({ ...prev, ...novosFiltros }));
    }, []);

    // Helper específico para selecionar um piezômetro e já setar o tipo dele automaticamente
    const aoSelecionarPiezometro = useCallback((id: number) => {
        const encontrado = piezometros.find(p => p.value === id);
        atualizarFiltros({
            idSelecionado: id,
            tipoSelecionado: encontrado?.tipo || null
        });
    }, [piezometros, atualizarFiltros]);

    return {
        filtros,
        piezometros,
        estaCarregandoOpcoes,
        opcoesFiltroTipo,
        atualizarFiltros,
        aoSelecionarPiezometro
    };
};
