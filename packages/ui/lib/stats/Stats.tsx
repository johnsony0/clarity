import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import HeatMap from '@uiw/react-heat-map';
import UIWTooltip from '@uiw/react-tooltip';

type StatsProps = {
  mode: number;
};

const COLORS = {
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  youtube: '#FF0000',
  twitch: '#9146FF',
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
          label: d.toLocaleDateString('en-US', { weekday: 'short' }), // e.g., "Mon"
        };
      });
  }, [history]);

  const heatmapData = useMemo(() => {
    return history.map((day, index) => {
      const d = new Date();
      d.setDate(d.getDate() - index);
      return {
        date: d.toISOString().split('T')[0].replace(/-/g, '/'),
        count: day.total,
      };
    });
  }, [history]);
  const todayTotal = history[0]?.total || 0;

  return (
    // Fixed width 300px. p-6 (24px) padding means internal width is 252px.
    <div className={`p-6 w-[300px] mx-auto ${darkMode ? 'dark' : ''} bg-white dark:bg-zinc-900 min-h-screen`}>
      {/* 1. Header */}
      <div className="text-center mb-6">
        <p className="text-6xl font-extrabold text-blue-500 tracking-tight">{todayTotal}</p>
        <h1 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Posts Today</h1>
      </div>

      {/* 2. Distribution Pie - Reduced to 250px */}
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
                fontSize: '10px',
              }}
            />
          </PieChart>
        </div>
      </div>

      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">7-Day Trend</h2>
        <LineChart width={250} height={120} data={last7DaysData}>
          <XAxis dataKey="label" fontSize={9} axisLine={false} tickLine={false} />
          <YAxis hide domain={[0, 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#18181b' : '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '10px',
            }}
          />
          <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot={{ r: 2 }} />
        </LineChart>
      </div>

      <div className="w-full flex flex-col items-center">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">90-Day Activity</h2>

        <div className="flex justify-center w-full">
          <HeatMap
            value={heatmapData}
            startDate={new Date(new Date().setDate(new Date().getDate() - 90))}
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
              0: darkMode ? '#27272a' : '#ebedf0',
              60: '#c6e48b',
              125: '#7bc96f',
              250: '#239a3b',
              500: '#196127',
            }}
            style={{
              color: darkMode ? '#adbac7' : '#444d56',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          />
        </div>
      </div>
    </div>
  );
};
