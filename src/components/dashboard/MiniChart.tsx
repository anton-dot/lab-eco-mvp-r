import React, { useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface MiniChartProps {
  data: number[];
  isPositive?: boolean;
  width?: number;
  height?: number;
}

const MiniChart: React.FC<MiniChartProps> = ({
  data,
  isPositive = true,
  width = 80,
  height = 30,
}) => {
  const chartData = useMemo(() => 
    data.map((value, index) => ({
      value,
      index,
    })), [data]
  );

  const { min, max } = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 100 };
    const values = [...data].sort((a, b) => a - b);
    const minVal = values[0];
    const maxVal = values[values.length - 1];
    const range = maxVal - minVal;
    const padding = range * 0.1 || (maxVal * 0.05);
    return {
      min: Math.max(0, minVal - padding),
      max: maxVal + padding,
    };
  }, [data]);

  const color = isPositive ? "#10b981" : "#ef4444";

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis hide domain={[min, max]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniChart;

