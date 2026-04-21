"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/dexie";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

// Styles CSS spécifiques à injecter globalement ou gérer ici via des classes
export default function HeatMapDisplay() {
  const sessions = useLiveQuery(() => db.sessions.where('interrupted').equals(0).toArray(), []); // Seulement sessions complétées

  const today = new Date();
  // Commencer 6 mois en arrière pour l'affichage (au lieu de 1 an pour s'adapter au mobile)
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  // Agréger les données par date via YYYY-MM-DD
  const getData = () => {
    if (!sessions) return [];
    
    const aggregated: Record<string, number> = {};
    sessions.forEach(s => {
      const dateStr = (s.dateStart as string).split('T')[0];
      const count = Math.floor(s.duration / 60); // Représente les minutes
      aggregated[dateStr] = (aggregated[dateStr] || 0) + count;
    });

    return Object.keys(aggregated).map(date => ({
      date,
      count: aggregated[date]
    }));
  };

  const data = getData();

  return (
    <div className="w-full bg-glass-dark border border-white/5 rounded-2xl p-4 shadow-inner mt-8">
      <h3 className="text-neon-cyan uppercase tracking-widest font-bold text-sm mb-4">Activité Annuelle</h3>
      <div className="heatmap-container overflow-hidden">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={data}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty opacity-20 fill-white/10';
            }
            if (value.count < 30) return 'color-scale-1 fill-neon-cyan/30';
            if (value.count < 60) return 'color-scale-2 fill-neon-cyan/60';
            if (value.count < 120) return 'color-scale-3 fill-neon-cyan/80';
            return 'color-scale-4 fill-neon-cyan';
          }}
          titleForValue={(value) => {
            if (!value) return "Aucun focus ce jour";
            return `${value.count} minutes le ${value.date}`;
          }}
          showWeekdayLabels={false}
        />
      </div>
    </div>
  );
}
