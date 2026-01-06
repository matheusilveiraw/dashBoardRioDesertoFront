'use client';

import React from 'react';
import GraficoPiezometro from "@/components/GraficoPiezometro/index";

const Dashboard = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <GraficoPiezometro />
            </div>
        </div>
    );
};

export default Dashboard;