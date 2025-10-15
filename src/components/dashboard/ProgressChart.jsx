import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "../common/Card";
import { useState, useMemo } from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-bold text-gray-800 dark:text-gray-100">{label}</p>
        {payload.map((pld) => (
          <p
            key={pld.dataKey}
            style={{ color: pld.stroke || pld.fill }}
            className="text-sm"
          >
            {pld.name}: {pld.value.toLocaleString()}
            {pld.dataKey === "volume" ? " kg" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ProgressChart = ({ workouts }) => {
  const [chartType, setChartType] = useState("workouts"); // 'workouts', 'volume'

  const chartData = useMemo(() => {
    const weeklyData = {};

    workouts.forEach((workout) => {
      const date = new Date(workout.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: weekKey,
          workouts: 0,
          volume: 0,
          exercises: 0,
        };
      }

      weeklyData[weekKey].workouts += 1;
      weeklyData[weekKey].volume += workout.totalVolume || 0;
      weeklyData[weekKey].exercises += workout.exercises?.length || 0;
    });

    return Object.values(weeklyData).slice(-8); // Last 8 weeks
  }, [workouts]);

  if (chartData.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Progress Chart
        </h3>
        <div className="text-center py-12 text-gray-500">
          <p>Not enough data to display charts yet.</p>
          <p className="text-sm mt-2">
            Keep logging workouts to see your progress!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Progress Over Time
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("workouts")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === "workouts"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Workouts / Exercises
          </button>
          <button
            onClick={() => setChartType("volume")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === "volume"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Volume
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        {chartType === "workouts" ? (
          // --- Separate bars for workouts and exercises ---
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="week"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="workouts"
              fill="#16a34a"
              name="Workouts"
              barSize={40}
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="exercises"
              fill="#3b82f6"
              name="Exercises"
              barSize={40}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        ) : (
          // --- Smooth, wavy line for volume ---
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="week"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#3b82f6", strokeDasharray: "3 3" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorVolume)"
              name="Total Volume (kg)"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>

      {/* Summary Section */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Weeks</p>
          <p className="text-xl font-bold text-gray-900">{chartData.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Avg. Workouts/Week</p>
          <p className="text-xl font-bold text-gray-900">
            {(
              chartData.reduce((sum, d) => sum + d.workouts, 0) /
              chartData.length
            ).toFixed(1)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Peak Week</p>
          <p className="text-xl font-bold text-gray-900">
            {Math.max(...chartData.map((d) => d.workouts))} workouts
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProgressChart;
