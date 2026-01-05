import axios from "axios";

export const rota = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 2000000,
});

export const getParametrosLegislacaoBuscaDadosRelacionados = () => {
    return rota.get("/parametros-legislacao/filtros");
};