'use client';

import { RefObject } from "react";
import { Chart } from "primereact/chart";
import { saveAs } from 'file-saver';
import Swal from "sweetalert2";

interface PiezometroOption {
    label: string;
    value: number;
}

/**
 * Hook customizado para gerenciar a exportação de relatórios (PDF e Word) na tela de Nível Estático.
 * 
 * Segue o princípio de Responsabilidade Única (SRP) ao isolar a manipulação de DOM e bibliotecas de exportação.
 */
export const useExportacaoRelatorioTelaNivelEstatico = (
    chartRef: RefObject<Chart>,
    piezometros: PiezometroOption[],
    idSelecionado: number | null
) => {

    const obterNomePiezometro = () => {
        const piezometro = piezometros.find(p => p.value === idSelecionado);
        return piezometro ? piezometro.label : 'Não selecionado';
    };

    const aoGerarPdf = async () => {
        const canvasGrafico = chartRef.current?.getCanvas();
        const elementoAnaliseIA = document.getElementById("textoApareceNoPdf");

        if (!canvasGrafico || !elementoAnaliseIA) {
            console.error("Não foi possível encontrar os elementos para gerar o PDF.");
            Swal.fire({
                icon: 'error',
                title: 'Erro na exportação',
                text: 'Certifique-se de que o gráfico e a análise estão visíveis.'
            });
            return;
        }

        // Criar container temporário para impressão
        const containerImpressao = document.createElement("div");
        containerImpressao.style.padding = "20px";

        const tituloPiezometro = document.createElement("h3");
        tituloPiezometro.textContent = `${obterNomePiezometro()}:`;
        tituloPiezometro.style.marginBottom = "20px";
        tituloPiezometro.style.color = "#000";
        containerImpressao.appendChild(tituloPiezometro);

        const containerRelatorio = document.createElement("div");
        containerRelatorio.style.backgroundColor = "#333";
        containerRelatorio.style.color = "#fff";
        containerRelatorio.style.padding = "20px";

        const cabecalhoGrafico = document.querySelector(".chart-header")?.cloneNode(true);
        if (cabecalhoGrafico) {
            containerRelatorio.appendChild(cabecalhoGrafico);
        }

        const urlImagemGrafico = canvasGrafico.toDataURL("image/png");
        const imagemGrafico = document.createElement("img");
        imagemGrafico.src = urlImagemGrafico;
        imagemGrafico.style.width = "100%";
        containerRelatorio.appendChild(imagemGrafico);

        containerImpressao.appendChild(containerRelatorio);

        const textoAnalise = (elementoAnaliseIA as HTMLElement).innerText;
        const containerAnalise = document.createElement('div');
        containerAnalise.style.marginTop = '20px';

        textoAnalise.split('\n').forEach(linha => {
            const p = document.createElement('p');
            p.textContent = linha || '\u00A0';
            p.style.color = 'black';
            p.style.margin = '0';
            p.style.breakInside = 'avoid';
            containerAnalise.appendChild(p);
        });
        containerImpressao.appendChild(containerAnalise);

        try {
            const html2pdf = (await import("html2pdf.js")).default;
            const opcoes = {
                margin: 1,
                filename: `relatorio-piezometro-${obterNomePiezometro()}.pdf`,
                image: { type: "jpeg" as const, quality: 0.98 },
                html2canvas: { scale: 2, letterRendering: true },
                jsPDF: { unit: "in", format: "letter", orientation: "landscape" as const },
            };

            await html2pdf().from(containerImpressao).set(opcoes).save();
        } catch (erro) {
            console.error("Erro ao gerar PDF:", erro);
            Swal.fire({ icon: 'error', title: 'Erro ao gerar PDF' });
        }
    };

    const aoGerarWord = async () => {
        const canvasGrafico = chartRef.current?.getCanvas();
        const elementoAnaliseIA = document.getElementById("textoApareceNoPdf");

        if (!canvasGrafico || !elementoAnaliseIA) {
            console.error("Não foi possível encontrar os elementos para gerar o Word.");
            return;
        }

        const urlImagemGrafico = canvasGrafico.toDataURL("image/png");
        const textoAnalise = (elementoAnaliseIA as HTMLElement).innerText;
        const linhasAnaliseHtml = textoAnalise.split('\n')
            .map(linha => `<p style="margin: 0;">${linha || '&nbsp;'}</p>`)
            .join('');

        const htmlString = `
            <div style="font-family: Arial; padding: 20px;">
                <h3 style="color: #000; margin-bottom: 20px;">${obterNomePiezometro()}:</h3>
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="${urlImagemGrafico}" style="width: 600px;" />
                </div>
                <div style="margin-top: 20px; color: #000;">
                    ${linhasAnaliseHtml} 
                </div>
            </div>
        `;

        const opcoes = {
            orientation: 'landscape' as const,
            margins: { top: 720, right: 720, bottom: 720, left: 720 },
        };

        try {
            const htmlToDocx = (await import('html-to-docx')).default;
            const bufferArquivo = await htmlToDocx(htmlString, null, opcoes);
            saveAs(bufferArquivo as Blob, `relatorio-piezometro-${obterNomePiezometro()}.docx`);
        } catch (erro) {
            console.error("Erro ao gerar Word:", erro);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao gerar Word',
                text: 'Ocorreu um problema ao tentar exportar para Word.'
            });
        }
    };

    return {
        aoGerarPdf,
        aoGerarWord
    };
};
