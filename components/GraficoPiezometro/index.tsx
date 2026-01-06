//CORPO PRINCIPAL DO COMPONENTE DE GRÁFICO PIEZÔMETRO

"use client";
import { useRef } from "react";
import GraficoTelaNivelEstatico from "./GraficoTelaNivelEstatico";
import AnaliseIA from "./AnaliseIA";
import TabelaDadosPiezometro from "./TabelaDadosPiezometro";
import { SplitButton } from 'primereact/splitbutton';

import { usePiezometroData } from "@/hooks/usePiezometroData";
import { useExportacaoRelatorioTelaNivelEstatico } from "@/hooks/useExportacaoRelatorioTelaNivelEstatico";
import BarraFiltros from "./BarraFiltros";
import Swal from "sweetalert2";

export default function GraficoPiezometro() {
  const chartRef = useRef(null);
  const {
    filters,
    piezometros,
    carregando,
    lineData,
    lineOptions,
    tabelaDados,
    opcoesFiltro,
    updateFilters,
    handleSelecionarPiezometro,
    buscarGrafico,
    analiseIANivelEstatico,
    setAnaliseIANivelEstatico,
    analiseOriginalIA,
    carregandoIANivelEstatico,
  } = usePiezometroData();

  const { aoGerarPdf, aoGerarWord } = useExportacaoRelatorioTelaNivelEstatico(
    chartRef as any,
    piezometros,
    filters.idSelecionado
  );


  const exportItems = [
    {
      label: 'PDF',
      icon: 'pi pi-file-pdf',
      command: aoGerarPdf
    },
    {
      label: 'Word',
      icon: 'pi pi-file-word',
      command: aoGerarWord
    }
  ];

  return (
    <div id="dashboard-content" className="col-12">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1>Nível Estático, precipitação e vazão</h1>

        {analiseIANivelEstatico && (
          <SplitButton
            label="Exportar"
            icon="pi pi-download"
            model={exportItems}
            onClick={aoGerarPdf}
            className="p-button-secondary"
          />
        )}
      </div>

      {/* Barra de Filtros */}
      <BarraFiltros
        opcoesFiltro={opcoesFiltro}
        tipoFiltroSelecionado={filters.tipoFiltroSelecionado}
        aoMudarTipoFiltro={(valor) =>
          updateFilters({ tipoFiltroSelecionado: valor })
        }
        piezometros={piezometros}
        idSelecionado={filters.idSelecionado}
        aoMudarPiezometro={handleSelecionarPiezometro}
        estaCarregando={carregando}
        dataInicio={filters.dataInicio}
        dataFim={filters.dataFim}
        aoMudarDataInicio={(valor) => updateFilters({ dataInicio: valor })}
        aoMudarDataFim={(valor) => updateFilters({ dataFim: valor })}
        porDia={filters.porDia}
        aoMudarPorDia={(valor) => updateFilters({ porDia: valor })}
        aoBuscar={buscarGrafico}
      />

      {/* GRÁFICO */}
      <GraficoTelaNivelEstatico
        ref={chartRef}
        dadosGrafico={lineData}
        opcoesGrafico={lineOptions}
        tipoPiezometro={filters.tipoSelecionado}
        tabelaDados={tabelaDados}
      />

      {/* ANÁLISE DA IA */}
      <div id="analise-ia-container" className="avoid-break mb-5">
        <AnaliseIA
          analise={analiseIANivelEstatico}
          analiseOriginalIA={analiseOriginalIA}
          estaCarregando={carregandoIANivelEstatico}
          aoSalvar={(texto) => setAnaliseIANivelEstatico(texto)}
          cdPiezometro={filters.idSelecionado}
        />
      </div>

      {/* LISTA DOS DADOS DA TABELA */}
      {tabelaDados.length > 0 && filters.tipoSelecionado && (
        <TabelaDadosPiezometro
          dados={tabelaDados}
          tipoSelecionado={filters.tipoSelecionado}
          porDia={filters.porDia}
        />
      )}

    </div>
  );
}