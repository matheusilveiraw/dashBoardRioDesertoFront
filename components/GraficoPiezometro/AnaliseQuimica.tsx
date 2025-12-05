"use client";

import { Skeleton } from "primereact/skeleton";
import { Badge } from "primereact/badge";
import { useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import {
  parametrosPortaria,
  verificarLimite,
  obterCorCard,
  ParametroPortaria,
  ResultadoVerificacao
} from "@/utils/analiseQuimica";

interface AnaliseQuimicaProps {
  data: any;
  carregando: boolean;
}

export default function AnaliseQuimica(
  { data, carregando }: AnaliseQuimicaProps
) {
  const [expanded, setExpanded] = useState(false);

  if (carregando) {
    return (
      <div className="p-3">
        <div className="flex flex-column gap-3">
          <Skeleton width="100%" height="1.5rem" />
          <Skeleton width="100%" height="1.5rem" />
          <Skeleton width="100%" height="1.5rem" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-3">
        <p className="text-500">
          Nenhuma análise química disponível para este registro.
        </p>
      </div>
    );
  }

  const { informacoesAmostra, totalParametrosMapeados, totalOutrosDados, analises, outrosDados } = data;

  return (
    <div className="p-3 analise-quimica">
      {/* Informações da Amostra */}
      <div className="mb-4">
        <h6 className="font-bold mb-2 text-white">Informações da Amostra</h6>
        <div className="grid informacoes-amostra">
          <div className="col-12 md:col-6">
            <span className="text-500">Data: </span>
            <span className="font-medium">{informacoesAmostra?.data}</span>
          </div>
          <div className="col-12 md:col-6">
            <span className="text-500">Coletor: </span>
            <span className="font-medium">
              {informacoesAmostra?.coletor || "Não informado"}
            </span>
          </div>
          <div className="col-12 md:col-6">
            <span className="text-500">Parâmetros Mapeados: </span>
            <span className="font-medium">{totalParametrosMapeados}</span>
          </div>
          <div className="col-12 md:col-6">
            <span className="text-500">Outros Dados: </span>
            <span className="font-medium">{totalOutrosDados}</span>
          </div>
          <div className="col-12">
            <span className="text-500">Nome: </span>
            <span className="font-medium nome-identificacao">
              {informacoesAmostra?.nomeIdentificacao}
            </span>
          </div>
        </div>
      </div>

      {/* Tabela de Limites da Portaria */}
      <div className="mb-4">
        <h6 className="font-bold mb-2 text-white">
          Parâmetros da Portaria GM/MS nº 888/2021
        </h6>
        <div className="grid">
          {Object.entries(parametrosPortaria).map(([chave, parametro]) => {
            const valorNosDados = analises?.[parametro.chaveBackend] || "";
            const { atende, mensagem, status } = verificarLimite(
              chave,
              valorNosDados,
              parametrosPortaria
            );

            return (
              <div key={chave} className="col-12 md:col-6 lg:col-3 mb-2">
                <div
                  className={`border-1 p-3 border-round analise-card ${obterCorCard(
                    status
                  )}`}
                >
                  <div className="flex justify-content-between align-items-start mb-2">
                    <div>
                      <div className="text-white text-sm font-bold">
                        {parametro.nome}
                      </div>
                      <div className="text-500 text-xs">{parametro.limite}</div>
                    </div>

                    {status === "ok" && (
                      <Badge
                        value="OK"
                        severity="success"
                        className="text-xs"
                      />
                    )}
                    {status === "alerta" && (
                      <Badge
                        value="Alerta"
                        severity="danger"
                        className="text-xs"
                      />
                    )}
                    {status === "ausente" && (
                      <Badge
                        value="N/D"
                        severity="warning"
                        className="text-xs"
                      />
                    )}
                  </div>

                  <div className="mt-2">
                    {valorNosDados ? (
                      <div
                        className={`font-bold ${
                          status === "alerta" ? "text-red-300" : "text-white"
                        }`}
                      >
                        {valorNosDados}
                      </div>
                    ) : (
                      <div className="text-yellow-300 text-xs font-medium">
                        <i className="pi pi-exclamation-triangle mr-1"></i>
                        Dado não disponível
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-500 mt-2 mensagem-parametro">{mensagem}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab das outras análises */}
      {totalOutrosDados > 0 && (
        <div className="mb-4">
          <Accordion activeIndex={expanded ? 0 : null} onTabChange={(e) => setExpanded(e.index === 0)}>
            <AccordionTab 
              header={
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-chart-bar"></i>
                  <span>Outras Análises Disponíveis</span>
                  <Badge value={totalOutrosDados} severity="info" className="ml-2" />
                </div>
              }
            >
              <div className="grid">
                {Object.entries(outrosDados || {}).map(([simbolo, resultado]) => (
                  <div key={simbolo} className="col-12 md:col-6 lg:col-3 mb-2">
                    <div className="bg-gray-900 border-1 border-gray-700 p-2 border-round outra-analise-card">
                      <div className="text-gray-400 text-xs font-medium mb-1 simbolo-analise">
                        {simbolo}
                      </div>
                      <div className="text-white text-sm resultado-analise">
                        {resultado as string}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionTab>
          </Accordion>
        </div>
      )}
    </div>
  );
}