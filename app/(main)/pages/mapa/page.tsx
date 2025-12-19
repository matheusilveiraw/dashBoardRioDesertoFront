"use client";

import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";

interface Piezometer {
  id: string;
  nome: string;
  tipo: string;
  x: number;
  y: number;
  cotaSup: string;
  cotaBase: string;
}

export default function MapaPage() {
  const [zoom, setZoom] = useState(100);
  const [piezometers, setPiezometers] = useState<Piezometer[]>([]);
  const [selectedPiezometer, setSelectedPiezometer] =
    useState<Piezometer | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const SVG_WIDTH = 793.7007874015749;
  const SVG_HEIGHT = 1122.5196850393702;

  useEffect(() => {
    fetch("/piezometers.json")
      .then((res) => res.json())
      .then((data) => setPiezometers(data))
      .catch((err) => console.error("Error loading piezometers:", err));
  }, []);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handlePinClick = (piezometer: Piezometer) => {
    setSelectedPiezometer(piezometer);
    setDialogVisible(true);
  };

  // Convert SVG coordinates to percentage for responsive positioning
  const getPinPosition = (x: number, y: number) => {
    return {
      left: `${(x / SVG_WIDTH) * 100}%`,
      top: `${(y / SVG_HEIGHT) * 100}%`,
    };
  };

  return (
    <div className="col-12">

      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Mapa de Monitoramento Ambiental</h1>
      </div>

      <div className="card filter-bar">
        <div className="filter-item">
          <span className="filter-label">Período</span>
          <div className="flex gap-2">
            <Calendar
              dateFormat="mm/yy"
              view="month"
              placeholder="Início"
              showIcon
              panelClassName="calendar-panel-fixed"
              appendTo="self"
            />
            <Calendar
              dateFormat="mm/yy"
              view="month"
              placeholder="Fim"
              showIcon
              panelClassName="calendar-panel-fixed"
              appendTo="self"
            />
          </div>
        </div>
        <div className="ml-auto">
          <Button
            label="APLICAR"
            className="p-button-warning font-bold"
          />
        </div>
      </div>

      <div className="flex justify-content-end mb-4">
        <div className="flex gap-2">
          <Button
            icon="pi pi-search-minus"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            tooltip="Diminuir zoom"
            tooltipOptions={{ position: "bottom" }}
          />
          <Button
            icon="pi pi-refresh"
            onClick={handleResetZoom}
            tooltip="Resetar zoom"
            tooltipOptions={{ position: "bottom" }}
          />
          <Button
            icon="pi pi-search-plus"
            onClick={handleZoomIn}
            disabled={zoom >= 300}
            tooltip="Aumentar zoom"
            tooltipOptions={{ position: "bottom" }}
          />
          <span className="flex align-items-center ml-2 text-sm text-600">
            {zoom}%
          </span>
        </div>
      </div>

      <div
        className="surface-card shadow-2 border-round p-3"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflowX: "auto",
            overflowY: "auto",
            border: "1px solid #dee2e6",
            borderRadius: "6px",
            backgroundColor: "#f8f9fa",
            padding: "1rem",
            position: "relative",
          }}
        >
          {/* SVG Map Container */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src="/mapa_monitoramento_mina.svg"
              alt="Mapa de Monitoramento Ambiental - Mina"
              style={{
                minWidth: `${zoom}%`,
                width: `${zoom}%`,
                height: "auto",
                display: "block",
                transition: "width 0.2s ease, min-width 0.2s ease",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              {piezometers.map((piezometer) => {
                const position = getPinPosition(piezometer.x, piezometer.y);
                const isPZP = piezometer.tipo === "PZP";

                return (
                  <div
                    key={piezometer.id}
                    onClick={() => handlePinClick(piezometer)}
                    style={{
                      position: "absolute",
                      ...position,
                      transform: "translate(-50%, -100%)",
                      cursor: "pointer",
                      pointerEvents: "all",
                      transition: "transform 0.2s ease",
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translate(-50%, -100%) scale(1.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translate(-50%, -100%) scale(1)";
                    }}
                    title={piezometer.nome}
                  >
                    {/* Pin Icon */}
                    <svg
                      width="24"
                      height="32"
                      viewBox="0 0 24 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z"
                        fill={isPZP ? "#FFD700" : "#0000FF"}
                        stroke="#000"
                        strokeWidth="1"
                      />
                      <circle cx="12" cy="12" r="5" fill="#FFF" />
                      <text
                        x="12"
                        y="15"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="#000"
                      >
                        {isPZP ? "P" : "F"}
                      </text>
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Information Dialog */}
      <Dialog
        header="Informações do Piezômetro"
        visible={dialogVisible}
        style={{ width: "400px" }}
        onHide={() => setDialogVisible(false)}
        draggable={false}
        resizable={false}
      >
        {selectedPiezometer && (
          <div className="flex flex-column gap-3">
            <div className="flex align-items-center gap-2">
              <i
                className={`pi ${selectedPiezometer.tipo === "PZP" ? "pi-map-marker" : "pi-circle"}`}
                style={{
                  color:
                    selectedPiezometer.tipo === "PZP" ? "#FFD700" : "#0000FF",
                  fontSize: "2rem",
                }}
              ></i>
              <div>
                <h3 className="m-0 mb-1">{selectedPiezometer.nome}</h3>
                <span className="text-sm text-600">
                  {selectedPiezometer.tipo === "PZP"
                    ? "Piezômetro Profundo"
                    : "Poço Freático Cacimba"}
                </span>
              </div>
            </div>

            <div className="surface-ground p-3 border-round">
              <div className="grid">
                <div className="col-12 mb-2">
                  <span className="text-600 text-sm">Tipo:</span>
                  <div className="font-semibold">{selectedPiezometer.tipo}</div>
                </div>

                {selectedPiezometer.cotaSup !== "N/A" && (
                  <div className="col-6">
                    <span className="text-600 text-sm">Cota Superior:</span>
                    <div className="font-semibold text-primary">
                      {selectedPiezometer.cotaSup}
                    </div>
                  </div>
                )}

                {selectedPiezometer.cotaBase !== "N/A" && (
                  <div className="col-6">
                    <span className="text-600 text-sm">Cota Base:</span>
                    <div className="font-semibold text-primary">
                      {selectedPiezometer.cotaBase}
                    </div>
                  </div>
                )}

                <div className="col-12 mt-2">
                  <span className="text-600 text-sm">Coordenadas (SVG):</span>
                  <div className="font-mono text-sm">
                    X: {selectedPiezometer.x.toFixed(2)}, Y:{" "}
                    {selectedPiezometer.y.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-content-end gap-2">
              <Button
                label="Fechar"
                icon="pi pi-times"
                onClick={() => setDialogVisible(false)}
                className="p-button-text"
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}