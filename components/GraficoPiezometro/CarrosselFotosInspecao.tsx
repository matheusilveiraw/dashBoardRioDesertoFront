"use client";

import React from 'react';
import { Carousel } from 'primereact/carousel';
import { Skeleton } from 'primereact/skeleton';

interface FotoInspecao {
    idFoto: number;
    cdPiezometro: number;
    nmArquivo: string;
    caminhoCompleto: string;
    dataInsercao: string;
}

interface PropriedadesCarrossel {
    fotos: FotoInspecao[];
    estaCarregando: boolean;
}

/**
 * Componente que exibe um carrossel de "fotos" das inspeções.
 * Como as fotos ainda não estão acessíveis pelo servidor, exibimos as informações do arquivo.
 */
export default function CarrosselFotosInspecao({ fotos, estaCarregando }: PropriedadesCarrossel) {

    const opcoesResponsividade = [
        { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
        { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
        { breakpoint: '767px', numVisible: 1, numScroll: 1 }
    ];

    const formatarDataHora = (dataString: string) => {
        try {
            const data = new Date(dataString);
            return data.toLocaleString('pt-BR');
        } catch (e) {
            return dataString;
        }
    };

    const templateFoto = (foto: FotoInspecao) => {
        return (
            <div className="p-2 h-full">
                <div className="surface-card p-4 shadow-2 border-round border-1 border-300 flex flex-column align-items-center justify-content-center text-center h-15rem bg-gray-50">
                    <i className="pi pi-image text-4xl text-400 mb-3"></i>
                    <div className="text-900 font-bold mb-2 line-height-3 text-sm" style={{ wordBreak: 'break-all' }}>
                        {foto.nmArquivo}
                    </div>
                    <div className="text-600 text-xs mb-3">
                        {formatarDataHora(foto.dataInsercao)}
                    </div>
                    <div className="text-500 text-xs font-italic surface-200 p-2 border-round w-full overflow-hidden text-overflow-ellipsis" title={foto.caminhoCompleto}>
                        {foto.caminhoCompleto}
                    </div>
                </div>
            </div>
        );
    };

    if (estaCarregando) {
        return (
            <div className="grid">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="col-12 md:col-4">
                        <Skeleton height="15rem" />
                    </div>
                ))}
            </div>
        );
    }

    if (!fotos || fotos.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 mb-5">
            <div className="flex align-items-center gap-2 mb-3">
                <i className="pi pi-camera text-primary text-2xl"></i>
                <h2 className="m-0 text-xl font-bold">Fotos de Inspeção</h2>
            </div>

            <Carousel
                value={fotos}
                numVisible={3}
                numScroll={1}
                responsiveOptions={opcoesResponsividade}
                itemTemplate={templateFoto}
                circular={fotos.length > 3}
                autoplayInterval={7000}
            />
        </div>
    );
}
