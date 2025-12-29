import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import HeatMap from '@uiw/react-heat-map';
import UIWTooltip from '@uiw/react-tooltip';

type StatsProps = {
  mode: number;
};

const COLORS = {
  facebook: '#4c8bf5',
  twitter: '#58a1d8',
  youtube: '#ef5350',
  twitch: '#8e62e9',
  total: '#94a3b8',
};

export const Stats: React.FC<StatsProps> = ({ mode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    chrome.storage.local.get(['darkMode', 'post_count_history'], result => {
      setDarkMode(result.darkMode ?? false);
      setHistory(result.post_count_history || []);
    });
  }, []);

  const todayData = useMemo(() => {
    const today = history[0] || {};
    return [
      { name: 'Facebook', value: today.facebook || 0, color: COLORS.facebook },
      { name: 'Twitter', value: today.twitter || 0, color: COLORS.twitter },
      { name: 'YouTube', value: today.youtube || 0, color: COLORS.youtube },
      { name: 'Twitch', value: today.twitch || 0, color: COLORS.twitch },
    ].filter(item => item.value > 0);
  }, [history]);

  const last7DaysData = useMemo(() => {
    return history
      .slice(0, 7)
      .reverse()
      .map((day, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          total: day.total,
          facebook: day.facebook,
          twitter: day.twitter,
          twitch: day.twitch,
          youtube: day.youtube,
          label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        };
      });
  }, [history]);

  const last12MonthsData = useMemo(() => {
    const monthsMap: { [key: string]: { sum: number; count: number } } = {};
    const now = new Date();

    // 1. Initialize the last 12 months with 0s to ensure we always have 12 points
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthsMap[key] = { sum: 0, count: 0 };
    }

    // 2. Aggregate history data into the buckets
    history.forEach((day, index) => {
      const d = new Date();
      d.setDate(d.getDate() - index);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      // Only add to the map if the month is one of our 12 tracked months
      if (monthsMap[key]) {
        monthsMap[key].sum += day.total || 0;
        monthsMap[key].count += 1;
      }
    });

    // 3. Convert map to array and calculate the average
    return Object.keys(monthsMap).map(key => {
      const { sum, count } = monthsMap[key];
      return {
        label: key, // e.g., "Jan 24"
        average: count > 0 ? Math.round(sum / count) : 0,
      };
    });
  }, [history]);

  const heatmapData = useMemo(() => {
    return history.map((day, index) => {
      const d = new Date();
      d.setDate(d.getDate() - index);
      return {
        date: d.toLocaleDateString().split('T')[0].replace(/-/g, '/'),
        count: day.total,
      };
    });
  }, [history]);
  const todayTotal = history[0]?.total || 0;
  return (
    <div className={`p-2 mx-auto ${darkMode ? 'dark' : ''} bg-white dark:bg-zinc-900 min-h-screen`}>
      <div className="text-center mb-6">
        <p className="text-6xl font-extrabold tracking-tight" style={{ color: COLORS.total }}>
          {todayTotal}
        </p>
        <h1 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Posts Today</h1>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="flex flex-col items-center">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Platform Split</h2>
          <PieChart width={250} height={160}>
            <Pie
              data={todayData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={5}
              isAnimationActive={false}>
              {todayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#18181b' : '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '11px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
              }}
            />
          </PieChart>
        </div>
      </div>

      <div className="mb-8 flex flex-col items-center justify-center ">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">7-Day Trend</h2>

        <ComposedChart
          style={{ maxWidth: 300, width: '100%', height: 200 }}
          data={last7DaysData}
          margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
          <XAxis dataKey="label" fontSize={10} axisLine={false} tickLine={false} interval={0} />
          <YAxis fontSize={10} axisLine={false} tickLine={false} tickMargin={5} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />

          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#18181b' : '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '11px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
            }}
          />

          <Legend
            iconSize={8}
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{
              fontSize: '8px',
              paddingTop: '10px',
              left: 5,
              width: '100%',
            }}
          />
          <Line type="monotone" dataKey="total" stroke={COLORS.total} strokeWidth={2} dot={{ r: 2 }} />
          <Bar dataKey="facebook" stackId="a" fill={COLORS.facebook} />
          <Bar dataKey="twitter" stackId="a" fill={COLORS.twitter} />
          <Bar dataKey="youtube" stackId="a" fill={COLORS.youtube} />
          <Bar dataKey="twitch" stackId="a" fill={COLORS.twitch} radius={[4, 4, 0, 0]} />
        </ComposedChart>
      </div>

      <div className="w-full flex flex-col items-center">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Recent Activity</h2>

        <div className="flex justify-center w-full">
          <HeatMap
            value={heatmapData}
            width={230}
            startDate={new Date(new Date().setDate(new Date().getDate() - 60))}
            endDate={new Date()}
            rectSize={12}
            space={3}
            legendCellSize={0}
            rectRender={(props, data) => {
              return (
                <UIWTooltip key={props.key} placement="top" content={`count: ${data.count || 0}, date: ${data.date}`}>
                  <rect {...props} />
                </UIWTooltip>
              );
            }}
            panelColors={{
              1: '#cbd5e1',
              50: '#94a3b8',
              150: '#64748b',
              300: '#475569',
              500: '#1e293b',
            }}
            style={{
              color: darkMode ? '#adbac7' : '#444d56',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </div>
      </div>

      <div className="w-[250px] mx-auto flex flex-col items-center">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">12-Month Avg Trend</h2>

        <div className="w-full h-[180px]">
          <LineChart
            width={250}
            height={180}
            data={last12MonthsData}
            margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
            <XAxis dataKey="label" fontSize={8} axisLine={false} tickLine={false} interval={2} />
            <YAxis fontSize={9} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#18181b' : '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '10px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
              }}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke={COLORS.total}
              strokeWidth={3}
              dot={{ r: 3, fill: COLORS.total, strokeWidth: 2 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};
