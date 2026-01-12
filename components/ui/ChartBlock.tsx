"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";

type ChartType = "bar" | "line" | "pie";

type ChartBlockProps = {
  chartType: ChartType;
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
};

export function ChartBlock({
  chartType,
  data,
  xKey,
  yKey,
}: ChartBlockProps) {
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect mobile screen
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="h-[320px] w-full rounded-xl border bg-background p-3 sm:p-4">
      <ResponsiveContainer width="100%" height="100%">
        {getChart(chartType, data, xKey, yKey, isMobile)}
      </ResponsiveContainer>
    </div>
  );
}

function getChart(
  chartType: ChartType,
  data: any[],
  xKey: string,
  yKey: string,
  isMobile: boolean
): ReactElement {
  // ======================
  // BAR CHART
  // ======================
  if (chartType === "bar") {
    // 👉 Mobile = horizontal bars (BEST UX)
    if (isMobile) {
      return (
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey={xKey}
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar dataKey={yKey} radius={[0, 6, 6, 0]} />
        </BarChart>
      );
    }

    // 👉 Desktop = vertical bars
    return (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xKey}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={60}
          tickFormatter={(v) =>
            typeof v === "string" && v.length > 12 ? v.slice(0, 12) + "…" : v
          }
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yKey} radius={[6, 6, 0, 0]} />
      </BarChart>
    );
  }

  // ======================
  // LINE CHART
  // ======================
  if (chartType === "line") {
    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xKey}
          interval={isMobile ? 1 : 0}
          tick={{ fontSize: isMobile ? 11 : 12 }}
        />
        <YAxis />
        <Tooltip />
        <Line
          dataKey={yKey}
          strokeWidth={2}
          dot={!isMobile}
        />
      </LineChart>
    );
  }

  // ======================
  // PIE CHART
  // ======================
  return (
    <PieChart>
      <Tooltip />
      <Pie
        data={data}
        dataKey={yKey}
        nameKey={xKey}
        cx="50%"
        cy="50%"
        outerRadius={isMobile ? 90 : 110}
        label={!isMobile}
      />
    </PieChart>
  );
}
