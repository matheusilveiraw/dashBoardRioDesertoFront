'use client';
import api from "@/service/api";
import { useEffect } from "react";

export default function TesteApi() {

    useEffect(() => {
        async function carregar() {
            try {
                const resposta = await api.get("");
                console.log("Dados da API:", resposta.data);
            } catch (err) {
                console.error("Erro na API:", err);
            }
        }

        carregar();
    }, []);

    return (
        <div>
            <h2>Testando API</h2>
        </div>
    );
}