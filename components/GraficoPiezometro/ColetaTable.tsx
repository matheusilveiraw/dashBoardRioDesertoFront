//componente do tabela de coletas detalhadas no piezômetro

'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface ColetaTableProps {
    data: any[];
    expandedRows: any;
    onRowToggle: (e: any) => void;
}

export default function ColetaTable({ data, expandedRows, onRowToggle }: ColetaTableProps) {
    const formatarData = (dataString: string) => {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const rowExpansionTemplate = (rowData: any) => {
        return (
            <div className="p-3">
                <p>Detalhes para o registro {rowData.n_registro}</p>
                {/* dados vão vir aqui */}
            </div>
        );
    };

    return (
        <div className="card mt-4">
            <h5 className="mb-4 text-white">Registros de Coleta Detalhados</h5>
            <DataTable 
                value={data}
                expandedRows={expandedRows}
                onRowToggle={onRowToggle}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="n_registro"
                className="p-datatable-sm"
                emptyMessage="Nenhum registro de coleta encontrado"
            >
                <Column expander style={{ width: '3rem' }} />
                <Column 
                    field="n_registro" 
                    header="Nº REGISTRO" 
                    sortable 
                />
                <Column 
                    field="data" 
                    header="DATA" 
                    body={(rowData) => formatarData(rowData.data)}
                    sortable 
                />
                <Column 
                    field="identificacao" 
                    header="IDENTIFICAÇÃO" 
                    sortable 
                />
            </DataTable>
        </div>
    );
}