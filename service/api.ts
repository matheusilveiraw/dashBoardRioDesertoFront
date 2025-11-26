//import api from "@/service/api"; // se seu tsconfig tem paths configurados
//caminho para importar

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/relatorios/piezometro/355/filtro?mesAnoInicio=11/2023&mesAnoFim=10/2025",
    timeout: 10000
});

export default api;