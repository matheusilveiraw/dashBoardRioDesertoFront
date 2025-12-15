import React, { useMemo } from 'react';
import { Chart } from 'primereact/chart';


interface PropriedadesGrafico {
    dados: any;
}

export default function GraficosAnalise({ dados }: PropriedadesGrafico) {

    // Função para parser de valores numéricos
    // Trata "18,30", "ND", "341 a 24,7ºC", "< 0,5", etc.
    const parseValor = (valorStr: string) => {
        if (!valorStr) return null;
        if (valorStr.trim().toUpperCase() === 'ND') return null;

        // Tenta limpar caracteres não numéricos iniciais se houver (ex: "< 10")
        // Mas cuidado com "341 a 24,7ºC". Queremos o 341.
        // Regex para pegar o primeiro número válido (com vírgula ou ponto)
        // Substituir vírgula por ponto antes

        let valorLimpo = valorStr.replace(',', '.');

        // Se tiver texto como " a ", pega só a primeira parte
        if (valorLimpo.includes(' a ')) {
            valorLimpo = valorLimpo.split(' a ')[0];
        }

        // Remove caracteres como < ou > e espaços
        valorLimpo = valorLimpo.replace(/[<>]/g, '').trim();

        const numero = parseFloat(valorLimpo);
        return isNaN(numero) ? null : numero;
    };

    // Converte data "YYYY-MM-DD" para "DD/MM/YYYY"
    const formatarData = (dataStr: string) => {
        if (!dataStr) return '';
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const graficosProcessados = useMemo(() => {
        if (!dados || !dados.amostras || dados.amostras.length === 0) return [];

        // Ordenar amostras por data
        const amostrasOrdenadas = [...dados.amostras].sort((a: any, b: any) => {
            return new Date(a.informacoesAmostra.data).getTime() - new Date(b.informacoesAmostra.data).getTime();
        });

        const datas = amostrasOrdenadas.map((a: any) => formatarData(a.informacoesAmostra.data));

        // Identificar todos os símbolos únicos
        const simbolosMap = new Map<string, string>(); // Símbolo -> Nome (pode usar o próprio símbolo)

        amostrasOrdenadas.forEach((amostra: any) => {
            if (amostra.analises) {
                amostra.analises.forEach((analise: any) => {
                    simbolosMap.set(analise.simbolo, analise.simbolo);
                });
            }
        });

        const listaGraficos: any[] = [];

        simbolosMap.forEach((simbolo) => {
            const dataValues = amostrasOrdenadas.map((amostra: any) => {
                const analiseEncontrada = amostra.analises?.find((a: any) => a.simbolo === simbolo);
                return analiseEncontrada ? parseValor(analiseEncontrada.resultado) : null;
            });

            // Verificar se tem algum dado válido para não plotar gráfico vazio
            const temDados = dataValues.some((v: any) => v !== null);

            if (temDados) {
                listaGraficos.push({
                    titulo: simbolo,
                    color: '#FFC107', // Usando a cor primária do tema ou variando se necessário
                    chartData: {
                        labels: datas,
                        datasets: [
                            {
                                label: simbolo,
                                data: dataValues,
                                fill: false,
                                borderColor: '#FFC107',
                                backgroundColor: '#FFC107',
                                tension: 0.3,
                                spanGaps: true
                            }
                        ]
                    },
                    options: {
                        maintainAspectRatio: false,
                        aspectRatio: 0.8,
                        plugins: {
                            legend: {
                                display: false // Esconde legenda padrão para usar a customizada
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: '#aaa'
                                },
                                grid: {
                                    color: '#333',
                                    drawBorder: false
                                }
                            },
                            y: {
                                ticks: {
                                    color: '#aaa'
                                },
                                grid: {
                                    color: '#333',
                                    drawBorder: false
                                }
                            }
                        }
                    }
                });
            }
        });

        return listaGraficos;

    }, [dados]);

    if (!dados || !dados.amostras) return null;

    return (
        <div className="grid">
            {graficosProcessados.map((grafico, index) => (
                <div key={index} className="col-12 md:col-6 lg:col-6">
                    <div className="chart-container h-full">
                        <div className="chart-header">
                            <div className="chart-title">{grafico.titulo}</div>
                            <div className="chart-legend">
                                <div className="legend-item">
                                    <div
                                        className="legend-color"
                                        style={{ backgroundColor: grafico.color }}
                                    ></div>
                                    {grafico.titulo}
                                </div>
                            </div>
                        </div>
                        <Chart type="line" data={grafico.chartData} options={grafico.options} height="300px" />
                    </div>
                </div>
            ))}
            {graficosProcessados.length === 0 && (
                <div className="col-12">
                    <div className="chart-container">
                        <p className="text-center">Nenhum dado analítico encontrado para exibir gráficos.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
