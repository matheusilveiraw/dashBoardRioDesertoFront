"use client";

import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { useAnaliseIATelaRelNivelEstatico } from "@/hooks/useAnaliseIATelaRelNivelEstatico";

interface AnaliseIAPropriedades {
    analise: string | null;
    analiseOriginalIA: string | null;
    estaCarregando: boolean;
    aoSalvar: (texto: string) => void;
    cdPiezometro: number | null;
}

/**
 * Componente para exibição e gerenciamento da análise gerada por IA.
 * 
 * Segue os princípios de Responsabilidade Única (SRP) ao delegar a lógica para um hook customizado.
 */
export default function AnaliseIA({
    analise,
    analiseOriginalIA,
    estaCarregando,
    aoSalvar,
    cdPiezometro
}: AnaliseIAPropriedades) {

    const {
        estaEditando,
        textoEditado,
        setTextoEditado,
        aoAvaliar,
        aoEditar,
        aoSalvarEdicao,
        aoCancelarEdicao
    } = useAnaliseIATelaRelNivelEstatico(analise, analiseOriginalIA, aoSalvar, cdPiezometro);

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
