'use client';

import { useEffect, useState } from "react";
import api from "@/service/api";
import { Chart } from 'primereact/chart';

export default function GraficoPiezometro() {

    const [lineData, setLineData] = useState({});
    const [lineOptions, setLineOptions] = useState({});

    useEffect(() => {
        async function carregarDados() {
            try {
                const resposta = await api.get("");

                const dados = [...resposta.data].reverse();

                // Labels -> Mês/Ano formatado
                const labels = dados.map((item: any) =>
                    new Date(item.mes_ano).toLocaleDateString("pt-BR", {
                        month: "short",
                        year: "numeric"
                    })
                );

                // Extração dos valores
                const precipitacao = dados.map((item: any) => item.precipitacao);
                const vazao = dados.map((item: any) => item.vazao_bombeamento);
                const nivelEstatico = dados.map((item: any) => item.nivel_estatico);
                const cotaSuperficie = dados.map((item: any) => item.cota_superficie);
                const cotaBase = dados.map((item: any) => item.cota_base);

                // Configuração do gráfico com múltiplos eixos Y
                const grafico = {
                    labels,
                    datasets: [
                        {
                            label: "Precipitação",
                            data: precipitacao,
                            borderColor: '#2f4860',
                            tension: 0.4,
                            yAxisID: 'y1'
                        },
                        {
                            label: "Vazão Bombeamento",
                            data: vazao,
                            borderColor: '#00bb7e',
                            tension: 0.4,
                            yAxisID: 'y1'
                        },
                        {
                            label: "Nível Estático",
                            data: nivelEstatico,
                            borderColor: '#ff6384',
                            tension: 0.4,
                            yAxisID: 'y'
                        },
                        {
                            label: "Cota Superfície",
                            data: cotaSuperficie,
                            borderColor: '#ff9f40',
                            tension: 0.4,
                            yAxisID: 'y'
                        },
                        {
                            label: "Cota Base",
                            data: cotaBase,
                            borderColor: '#9966ff',
                            tension: 0.4,
                            yAxisID: 'y'
                        }
                    ]
                };

                setLineData(grafico);

                setLineOptions({
                    plugins: {
                        legend: {
                            labels: { color: '#000' }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#000' }
                        },

                        // Eixo Y ESQUERDO
                        y: {
                            type: 'linear',
                            position: 'left',
                            ticks: { color: '#000' },
                            title: { display: true, text: "Cotas / Nível (m)" }
                        },

                        // Eixo Y DIREITO
                        y1: {
                            type: 'linear',
                            position: 'right',
                            ticks: { color: '#000' },
                            grid: { drawOnChartArea: false },
                            title: { display: true, text: "Precipitação / Vazão (m³)" }
                        }
                    }
                });

            } catch (err) {
                console.error("Erro ao carregar API:", err);
            }
        }

        carregarDados();
    }, []);

    return (
        <div className="card">
            <h5>Relatório Piezômetro</h5>

            {lineData.labels ? (
                <Chart type="line" data={lineData} options={lineOptions} />
            ) : (
                <p>Carregando gráfico...</p>
            )}
        </div>
    );
}