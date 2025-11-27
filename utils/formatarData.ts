export function formatarData(data: Date) {
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${mes}/${ano}`;
}