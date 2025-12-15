"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import GraficoPiezometro from '@/components/GraficoPiezometro';

export default function Page() {
  const searchParams = useSearchParams();
  const cdPiezometro = searchParams.get('cdPiezometro');
  const mesAnoInicio = searchParams.get('mesAnoInicio');
  const mesAnoFim = searchParams.get('mesAnoFim');

  if (!cdPiezometro || !mesAnoInicio || !mesAnoFim) {
    return null;
  }

  return (
    <div style={{ padding: 24 }}>
      <GraficoPiezometro
        initialCdPiezometro={Number(cdPiezometro)}
        initialMesAnoInicio={mesAnoInicio}
        initialMesAnoFim={mesAnoFim}
        autoApply
      />
    </div>
  );
}
