"use client";

import { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import GraficosAnalise from "./GraficosAnalise";
import AnaliseIA from "./AnaliseIA";
import { getPiezometrosRelatorio, getColetaCompletaPorIdDataInicioDataFimApi, webHookIAAnaliseQualidade } from '@/service/api';
import Swal from "sweetalert2";

export type QualidadeAguaProps = {
    initialCdPiezometro?: number;
    initialMesAnoInicio?: string;
    initialMesAnoFim?: string;
    autoApply?: boolean;
    isReport?: boolean;
};

export default function QualidadeAgua({
    initialCdPiezometro,
    initialMesAnoInicio,
    initialMesAnoFim,
    autoApply = false,
    isReport = false,
}: QualidadeAguaProps = {}) {
    const [tipoFiltroSelecionado, setTipoFiltroSelecionado] = useState<string | null>(null);
    const [pontoSelecionado, setPontoSelecionado] = useState<number | null>(null);
    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [pontos, setPontos] = useState<any[]>([]);

    const [dadosColeta, setDadosColeta] = useState<any>(null);
    const [autoApplied, setAutoApplied] = useState(false);
    const [analiseIA, setAnaliseIA] = useState<string | null>(null);

    const opcoesFiltro = [
        { label: "Todos os Tipos", value: null },
        { label: "PP - Piezômetro de Profundidade", value: "PP" },
        { label: "PR - Régua", value: "PR" },
        { label: "PV - Ponto de Vazão", value: "PV" },
        { label: "PC - Calhas", value: "PC" },
    ];

    useEffect(() => {
        const buscarPiezometros = async () => {
            setCarregando(true);
            try {
                const response = await getPiezometrosRelatorio(tipoFiltroSelecionado);
                const data = response.data;
                const pontosFormatados = data.map((item: any) => ({
                    label: item.nm_piezometro,
                    value: item.id_zeus
                }));
                setPontos(pontosFormatados);
                setPontoSelecionado(null);
            } catch (error) {
                console.error("Erro ao buscar piezômetros:", error);
                setPontos([]);
            } finally {
                setCarregando(false);
            }
        };
        buscarPiezometros();
    }, [tipoFiltroSelecionado]);

    useEffect(() => {
        setDadosColeta(null);
        setAnaliseIA(null);
    }, [tipoFiltroSelecionado, pontoSelecionado, dataInicio, dataFim]);

    const parseMesAno = (mesAno?: string | null): Date | null => {
        if (!mesAno) return null;
        const m = mesAno.match(/^(0[1-9]|1[0-2])\/(19|20)\d{2}$/);
        if (!m) return null;
        const [mm, yyyy] = mesAno.split('/');
        return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, 1);
    };

    useEffect(() => {
        if (initialCdPiezometro) setPontoSelecionado(initialCdPiezometro);
        const di = parseMesAno(initialMesAnoInicio);
        const df = parseMesAno(initialMesAnoFim);
        if (di) setDataInicio(di);
        if (df) setDataFim(df);
    }, [initialCdPiezometro, initialMesAnoInicio, initialMesAnoFim]);

    useEffect(() => {
        if (!autoApply || autoApplied) return;
        if (pontoSelecionado && dataInicio && dataFim) {
            handleBuscar();
            setAutoApplied(true);
        }
    }, [autoApply, autoApplied, pontoSelecionado, dataInicio, dataFim]);

    const handleGeneratePdf = async () => {
        const analiseIAEl = document.getElementById("textoApareceNoPdf");
        const chartsContainer = document.getElementById("analises-scrap");

        if (!analiseIAEl || !chartsContainer) {
            console.error("Não foi possível encontrar os elementos para gerar o PDF.");
            return;
        }

        const finalPrintContainer = document.createElement("div");
        finalPrintContainer.style.padding = "20px";

        const selectedPoint = pontos.find(p => p.value === pontoSelecionado);
        const pointName = selectedPoint ? selectedPoint.label : 'Ponto Selecionado';

        const pointNameEl = document.createElement("h3");
        pointNameEl.textContent = `${pointName}:`;
        pointNameEl.style.marginBottom = "20px";
        pointNameEl.style.color = "#000";

        finalPrintContainer.appendChild(pointNameEl);

        const analiseText = (analiseIAEl as HTMLElement).innerText;
        const analiseContainer = document.createElement('div');
        analiseContainer.style.marginBottom = '20px';
        analiseContainer.style.pageBreakInside = 'avoid';

        const lines = analiseText.split('\n');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line || '\u00A0';
            p.style.color = 'black';
            p.style.margin = '0';
            p.style.breakInside = 'avoid';
            analiseContainer.appendChild(p);
        });
        finalPrintContainer.appendChild(analiseContainer);

        const chartContainers = chartsContainer.querySelectorAll('.chart-container');

        chartContainers.forEach((container, index) => {
            const containerClone = container.cloneNode(true) as HTMLElement;

            containerClone.classList.remove('h-full');
            containerClone.style.height = 'auto';
            containerClone.style.width = '100%';
            containerClone.style.display = 'block';

            const originalCanvas = container.querySelector('canvas');
            const clonedCanvas = containerClone.querySelector('canvas');

            if (originalCanvas && clonedCanvas) {
                const img = document.createElement('img');
                img.src = originalCanvas.toDataURL("image/png");
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.display = 'block';
                const parent = clonedCanvas.parentNode as HTMLElement;
                if (parent) {
                    parent.replaceChild(img, clonedCanvas);
                    parent.style.height = 'auto';
                    parent.style.width = '100%';
                    parent.style.position = 'static';
                    parent.className = '';
                }
            }

            const wrapper = document.createElement('div');
            wrapper.style.width = '65%';
            wrapper.style.marginLeft = 'auto';
            wrapper.style.marginRight = 'auto';
            wrapper.style.marginTop = '40px';
            wrapper.style.marginBottom = '40px';
            wrapper.style.textAlign = 'center';
            wrapper.style.pageBreakInside = 'avoid';

            if (index < chartContainers.length - 1) {
                wrapper.style.pageBreakAfter = 'always';
            }

            wrapper.appendChild(containerClone);

            finalPrintContainer.appendChild(wrapper);
        });


        const html2pdf = (await import("html2pdf.js")).default;

        const opt = {
            margin: 0.2,
            filename: "relatorio-qualidade.pdf",
            image: { type: "jpeg" as const, quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true },
            jsPDF: { unit: "in", format: "letter", orientation: "landscape" as const },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().from(finalPrintContainer).set(opt).save();
    };

    const handleBuscar = async () => {
        if (!pontoSelecionado || !dataInicio || !dataFim) {
            console.warn("Selecione o ponto e as datas.");
            Swal.fire({ icon: "warning", title: "Selecione o ponto e as datas" });
            return;
        }

        if (dataInicio > dataFim) {
            Swal.fire({
                icon: "error",
                title: "Datas inválidas",
                text: "A data inicial não pode ser maior que a data final."
            });
            return;
        }

        try {
            Swal.fire({
                title: 'Carregando...',
                html: 'Buscando dados e analisando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            setCarregando(true);
            setDadosColeta(null);
            setAnaliseIA(null);

            const formatMonthYear = (date: Date) => {
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${month}/${year}`;
            };

            const inicio = formatMonthYear(dataInicio);
            const fim = formatMonthYear(dataFim);

            const response = await getColetaCompletaPorIdDataInicioDataFimApi(pontoSelecionado, inicio, fim);
            const data = response.data;
            setDadosColeta(data);

            if (data && data.amostras) {
                const iaResponse = await webHookIAAnaliseQualidade(data, pontoSelecionado) as any;
                if (typeof iaResponse === 'string') {
                    setAnaliseIA(iaResponse);
                } else if (iaResponse && iaResponse[0] && iaResponse[0].output) {
                    setAnaliseIA(iaResponse[0].output); // Padrão n8n array
                } else if (iaResponse && iaResponse.output) {
                    setAnaliseIA(iaResponse.output);
                } else {
                    // Fallback se for objeto direto
                    setAnaliseIA(JSON.stringify(iaResponse));
                }
            }

            Swal.close();

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "Não foi possível carregar os dados."
            });
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="col-12">
            <div className="flex justify-content-between align-items-center mb-4">
                <h1>Qualidade Água</h1>
                {analiseIA && (
                    <button onClick={handleGeneratePdf} className="p-button p-component">
                        Exportar PDF
                    </button>
                )}
            </div>

            <FilterBar
                opcoesFiltro={opcoesFiltro}
                tipoFiltroSelecionado={tipoFiltroSelecionado}
                onTipoFiltroChange={setTipoFiltroSelecionado}
                pontos={pontos}
                pontoSelecionado={pontoSelecionado}
                onPontoChange={setPontoSelecionado}
                carregando={carregando}
                dataInicio={dataInicio}
                dataFim={dataFim}
                onDataInicioChange={setDataInicio}
                onDataFimChange={setDataFim}
                onBuscar={handleBuscar}
            />

            {dadosColeta && dadosColeta.amostras && (
                <div className="mt-5">
                    <GraficosAnalise dados={dadosColeta} isReport={isReport} />
                </div>
            )}

            <AnaliseIA
                carregando={carregando}
                analise={analiseIA}
                onSave={(text) => setAnaliseIA(text)}
            />
        </div>
    );
}
