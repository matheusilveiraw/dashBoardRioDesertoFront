// Em: src/components/GraficoPiezometro/AnaliseQuimica.tsx
'use client';

import { Skeleton } from 'primereact/skeleton';

interface AnaliseQuimicaProps {
    data: any;
    carregando: boolean;
}

export default function AnaliseQuimica({ data, carregando }: AnaliseQuimicaProps) {
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
                <p className="text-500">Nenhuma análise química disponível para este registro.</p>
            </div>
        );
    }

    const { informacoesAmostra, totalParametros, analises } = data;

    // Função para formatar chaves para exibição
    const formatarChave = (chave: string) => {
        return chave
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/Dissolvido/g, ' Dissolvido')
            .replace(/Total/g, ' Total');
    };

    return (
        <div className="p-3">
            {/* Informações da Amostra */}
            <div className="mb-4">
                <h6 className="font-bold mb-2 text-white">Informações da Amostra</h6>
                <div className="grid">
                    <div className="col-6">
                        <span className="text-500">Data: </span>
                        <span className="font-medium">{informacoesAmostra?.data}</span>
                    </div>
                    <div className="col-6">
                        <span className="text-500">Identificação: </span>
                        <span className="font-medium">{informacoesAmostra?.identificacao}</span>
                    </div>
                    <div className="col-6">
                        <span className="text-500">Coletor: </span>
                        <span className="font-medium">{informacoesAmostra?.coletor || 'Não informado'}</span>
                    </div>
                    <div className="col-6">
                        <span className="text-500">Total de Parâmetros: </span>
                        <span className="font-medium">{totalParametros}</span>
                    </div>
                    <div className="col-12">
                        <span className="text-500">Nome: </span>
                        <span className="font-medium">{informacoesAmostra?.nomeIdentificacao}</span>
                    </div>
                </div>
            </div>

            {/* Análises Químicas */}
            <div>
                <h6 className="font-bold mb-2 text-white">Análises Químicas</h6>
                <div className="grid">
                    {Object.entries(analises || {}).map(([key, value]) => (
                        <div key={key} className="col-12 md:col-6 lg:col-4 mb-2">
                            <div className="border-1 surface-border p-2 border-round">
                                <div className="text-500 text-sm">{formatarChave(key)}</div>
                                <div className="font-medium">{String(value)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}