"use client";

import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { useAnaliseIATelaQualidadeAgua } from "@/hooks/useAnaliseIATelaQualidadeAgua";

interface AnaliseIAPropriedades {
    analise: string | null;
    analiseOriginalIA: string | null;
    estaCarregando: boolean;
    aoSalvar: (texto: string) => void;
    idZeus: number | null;
}

/**
 * Componente que exibe a análise gerada pela IA para os dados de Qualidade da Água.
 * 
 * Permite a edição da análise e a avaliação da qualidade da resposta da IA.
 */
export default function AnaliseIA({
    analise,
    analiseOriginalIA,
    estaCarregando,
    aoSalvar,
    idZeus
}: AnaliseIAPropriedades) {
    const {
        estaEditando,
        textoEditado,
        setTextoEditado,
        aoAvaliar,
        aoEditar,
        aoSalvarEdicao,
        aoCancelarEdicao
    } = useAnaliseIATelaQualidadeAgua(analise, analiseOriginalIA, aoSalvar, idZeus);

    if (estaCarregando) {
        return (
            <div className="card mt-4">
                <div className="flex align-items-center">
                    <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="4" />
                    <span className="ml-2 font-bold">IA analisando dados...</span>
                </div>
            </div>
        );
    }

    if (analise) {
        return (
            <div className="card mt-4">
                <div className="flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0">Análise da IA</h5>
                    {!estaEditando ? (
                        <div className="flex gap-2">
                            <Button
                                label="Avaliar"
                                icon="pi pi-star"
                                onClick={aoAvaliar}
                                size="small"
                                severity="info"
                                outlined
                            />
                            <Button
                                label="Editar"
                                icon="pi pi-pencil"
                                onClick={aoEditar}
                                size="small"
                            />
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                label="Salvar"
                                icon="pi pi-check"
                                onClick={aoSalvarEdicao}
                                size="small"
                                severity="success"
                            />
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                onClick={aoCancelarEdicao}
                                size="small"
                                severity="secondary"
                            />
                        </div>
                    )}
                </div>
                {!estaEditando ? (
                    <div id="textoApareceNoPdf" style={{ whiteSpace: 'pre-line' }}>{analise}</div>
                ) : (
                    <InputTextarea
                        value={textoEditado}
                        onChange={(e) => setTextoEditado(e.target.value)}
                        rows={15}
                        className="w-full"
                        autoResize
                    />
                )}
            </div>
        );
    }

    return null;
}
