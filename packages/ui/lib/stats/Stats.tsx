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
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import HeatMap from '@uiw/react-heat-map';
import UIWTooltip from '@uiw/react-tooltip';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { views, COLORS } from '../../lib';

type StatsProps = {
  mode: number;
};
type Metric = { sum: number; count: number };
type StatData = {
  Total: Metric;
  facebook: Metric;
  twitter: Metric;
  youtube: Metric;
  twitch: Metric;
  [key: string]: Metric;
};
interface AnalyticsEntry {
  total: number;
  facebook?: number;
  twitter?: number;
  youtube?: number;
  twitch?: number;
  [key: string]: number | undefined;
}

const formatToMinutes = (s: number) => {
  const mins = Math.round(s / 60);
  return mins;
};

export const Stats: React.FC<StatsProps> = ({ mode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [postHistory, setPostHistory] = useState<any[]>([]);
  const [timeHistory, setTimeHistory] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState(views[0]); //0 for time 1 for posts
  const [isMd, setIsMd] = useState(window.innerWidth >= 768);
  const isDashboard = mode === 0 && isMd;

  useEffect(() => {
    chrome.storage.local.get(['post_count_history', 'time_count_history', 'date'], result => {
      const today = new Date().toDateString();
      if (result.date !== today) {
        // Reset post count for a new day
        console.log('Post count reset for the new day.');
        let post_history = result.post_count_history || [];
        let time_history = result.time_count_history || [];

        // Calculate gap in days (in case user didn't open browser for 2 days)
        const lastDate = new Date(result.date);
        const currentDate = new Date(today);
        const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        for (let i = 0; i < Math.min(diffDays, 30); i++) {
          post_history.unshift({ total: 0, facebook: 0, twitter: 0, youtube: 0, twitch: 0 });
          post_history.pop();
          time_history.unshift({ total: 0, facebook: 0, twitter: 0, youtube: 0, twitch: 0 });
          time_history.pop();
        }
        console.log({ post_history, time_history });
        chrome.storage.local.set({
          post_count_history: post_history,
          time_count_history: time_history,
          date: today,
        });
      }
    });
  }, []);

  useEffect(() => {
    const handler = (e: any) => setIsMd(e.matches);
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    chrome.storage.local.get(['darkMode', 'post_count_history', 'time_count_history'], result => {
      setDarkMode(result.darkMode ?? false);
      setPostHistory(result.post_count_history || []);
      setTimeHistory(result.time_count_history || []);
      console.log({ post_count_history: result.post_count_history, time_count_history: result.time_count_history });
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);

  const todayData = useMemo(() => {
    const source = viewMode.id === 0 ? timeHistory : postHistory;
    const today = source[0] || {};
    return [
      {
        name: 'Facebook',
        value: viewMode.id === 0 ? formatToMinutes(today.facebook || 0) : today.facebook || 0,
        color: COLORS.facebook,
      },
      {
        name: 'Twitter',
        value: viewMode.id === 0 ? formatToMinutes(today.twitter || 0) : today.twitter || 0,
        color: COLORS.twitter,
      },
      {
        name: 'YouTube',
        value: viewMode.id === 0 ? formatToMinutes(today.youtube || 0) : today.youtube || 0,
        color: COLORS.youtube,
      },
      {
        name: 'Twitch',
        value: viewMode.id === 0 ? formatToMinutes(today.twitch || 0) : today.twitch || 0,
        color: COLORS.twitch,
      },
    ].filter(item => item.value > 0);
  }, [viewMode, postHistory, timeHistory]);

  const handleExport = () => {
    chrome.storage.local.get(['post_count_history', 'time_count_history'], data => {
      const postHistory: AnalyticsEntry[] = data.post_count_history || [];
      const timeHistory: AnalyticsEntry[] = data.time_count_history || [];

      // 1. Identify ALL unique platforms across BOTH history arrays
      const platforms = new Set<string>();
      [...postHistory, ...timeHistory].forEach((item: AnalyticsEntry) => {
        Object.keys(item).forEach(key => {
          if (key !== 'total') platforms.add(key);
        });
      });
      const platformList = Array.from(platforms);

      // 2. Create Header
      // Columns: Index, TotalPosts, TotalTime, Posts_PlatformA, Time_PlatformA, etc.
      let csvContent = '\uFEFF';
      const headers = ['Index', 'TotalPosts', 'TotalTime'];
      platformList.forEach(p => {
        headers.push(`Posts_${p}`, `Time_${p}`);
      });
      csvContent += headers.join(',') + '\n';

      // 3. Iterate and build rows
      const maxLength = Math.max(postHistory.length, timeHistory.length);

      for (let i = 0; i < maxLength; i++) {
        const posts: AnalyticsEntry = postHistory[i] || { total: 0 };
        const times: AnalyticsEntry = timeHistory[i] || { total: 0 };

        const rowValues: (string | number)[] = [i, posts.total || 0, times.total || 0];

        // Add pairs for each platform: [PostCount, TimeSpent]
        platformList.forEach(p => {
          rowValues.push(posts[p] || 0);
          rowValues.push(times[p] || 0);
        });

        csvContent += rowValues.join(',') + '\n';
      }

      // 4. Download Logic
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up memory
    });
  };
  const handleImport = () => {
    console.log('Import function triggered');
  };

  const lastXDaysData = useMemo(() => {
    const source = viewMode.id === 0 ? timeHistory : postHistory;
    const days = isDashboard ? 14 : 7;
    return source
      .slice(0, days)
      .reverse()
      .map((day, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        return {
          Total: viewMode.id === 0 ? formatToMinutes(day.total) : day.total,
          facebook: viewMode.id === 0 ? formatToMinutes(day.facebook) : day.facebook,
          twitter: viewMode.id === 0 ? formatToMinutes(day.twitter) : day.twitter,
          twitch: viewMode.id === 0 ? formatToMinutes(day.twitch) : day.twitch,
          youtube: viewMode.id === 0 ? formatToMinutes(day.youtube) : day.youtube,
          label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        };
      });
  }, [viewMode, postHistory, timeHistory, isDashboard]);

  const last12MonthsData = useMemo(() => {
    const source = viewMode.id === 0 ? timeHistory : postHistory;
    const platforms = ['facebook', 'twitter', 'youtube', 'twitch'];
    const now = new Date();
    const monthsMap: { [key: string]: StatData } = {};

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('en-US', { month: 'short' });
      monthsMap[key] = {
        Total: { sum: 0, count: 0 },
        facebook: { sum: 0, count: 0 },
        twitter: { sum: 0, count: 0 },
        youtube: { sum: 0, count: 0 },
        twitch: { sum: 0, count: 0 },
      };
    }
    const getValue = (val: any) => (viewMode.id === 0 ? formatToMinutes(val || 0) : val || 0);
    source.forEach((day, index) => {
      const d = new Date();
      d.setDate(d.getDate() - index);
      const key = d.toLocaleDateString('en-US', { month: 'short' });

      if (monthsMap[key]) {
        // Accumulate Total
        monthsMap[key].Total.sum += getValue(day.total);
        monthsMap[key].Total.count += 1;

        platforms.forEach(p => {
          monthsMap[key][p].sum += getValue(day[p]);
          monthsMap[key][p].count += 1;
        });
      }
    });

    return Object.keys(monthsMap).map(key => {
      const data = monthsMap[key];
      const calcAvg = (p: any) => (data[p].count > 0 ? Math.round(data[p].sum / data[p].count) : 0);
      return {
        label: key,
        Total: calcAvg('Total'),
        facebook: calcAvg('facebook'),
        twitter: calcAvg('twitter'),
        youtube: calcAvg('youtube'),
        twitch: calcAvg('twitch'),
      };
    });
  }, [viewMode, postHistory, timeHistory]);

  const heatmapData = useMemo(() => {
    const source = viewMode.id === 0 ? timeHistory : postHistory;
    return source.map((day, index) => {
      const d = new Date();
      d.setDate(d.getDate() - index);
      return {
        date: d.toLocaleDateString().split('T')[0].replace(/-/g, '/'),
        count: viewMode.id === 0 ? formatToMinutes(day.total) : day.total,
      };
    });
  }, [viewMode, postHistory, timeHistory]);
  const todayTotal = viewMode.id === 0 ? `${formatToMinutes(timeHistory[0]?.total)}m` : postHistory[0]?.total || 0;
  const todayDifference =
    viewMode.id === 0
      ? ((timeHistory[0]?.total || 0) - (timeHistory[1]?.total || 0)) / (timeHistory[1]?.total || 1)
      : ((postHistory[0]?.total || 0) - (postHistory[1]?.total || 0)) / (postHistory[1]?.total || 1);
  const todayPercentage = Math.abs(todayDifference * 100).toFixed(1);
  const snapToNextSunday = (daysAgo: number) => {
    const date = new Date(Date.now() - daysAgo * 864e5);
    const day = date.getDay();
    if (day !== 0) date.setDate(date.getDate() + (7 - day));
    return date;
  };
  const CARD_STYLE = isDashboard
    ? 'flex flex-col items-center justify-center bg-primary rounded-3xl shadow-xl text-center transition-all hover:shadow-2xl p-3'
    : 'flex flex-col items-center justify-center text-center';
  return (
    <div className={`p-1 mx-auto min-h-screen`}>
      <div className="flex items-center justify-between w-full mb-4">
        <label htmlFor="view-listbox" className="text-lg font-bold text-font">
          Select View Mode
        </label>
        {isDashboard && (
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
              Export CSV
            </button>
            <label className="px-4 py-2 text-sm font-medium text-white rounded cursor-pointer">
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>
          </div>
        )}
      </div>
      <Listbox value={viewMode} onChange={setViewMode}>
        <ListboxButton
          id="view-listbox"
          className="flex justify-between mt-1 block w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm rounded-md shadow-sm bg-bg text-font text-left cursor-default relative">
          <div className="flex items-center space-x-2">
            {viewMode.icon}
            <span className="block truncate">{viewMode.name}</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </ListboxButton>
        <ListboxOptions className="z-10 w-full bg-bg shadow-lg max-h-70 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {views.map(view => (
            <ListboxOption
              key={view.id}
              value={view}
              className={({ active }) =>
                `${active ? 'bg-secondary' : 'text-font'}
                cursor-default select-none relative text-font py-2 px-3`
              }>
              {({ selected }) => (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2 truncate">
                    {view.icon}
                    <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>{view.name}</span>
                  </div>
                  {selected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                      />
                    </svg>
                  )}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div className={CARD_STYLE}>
          <p className="text-6xl font-extrabold tracking-tight" style={{ color: COLORS.total }}>
            {todayTotal}
          </p>
          <h1 className="text-lg font-semibold text-font">{viewMode.id === 0 ? 'Active Time' : 'Posts Seen'} Today</h1>
          <div className={`flex items-center mt-2 text-sm font-bold`}>
            <span>{todayDifference > 0 ? '▲' : '▼'}</span>
            <span className="ml-1">{todayPercentage}%</span>
            <span className="ml-1 opacity-70 font-normal text-[10px] uppercase">vs yesterday</span>
          </div>
        </div>
        <div className={CARD_STYLE} style={{ width: '100%', height: 250 }}>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-font">
            Platform Split {viewMode.id === 0 ? '(minutes)' : ''}
          </h2>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={todayData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={'50%'}
                outerRadius={'70%'}
                paddingAngle={5}
                isAnimationActive={false}>
                {todayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#18181b' : '#fff',
                  color: darkMode ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '11px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
                }}
                itemStyle={{ color: darkMode ? '#fff' : '#000' }}
                labelStyle={{ color: darkMode ? '#fff' : '#000' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={CARD_STYLE}>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-font mb-3">
            {isDashboard ? '14-Day Trend' : '7-Day Trend'} {viewMode.id === 0 ? '(minutes)' : ''}
          </h2>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <ComposedChart data={lastXDaysData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                <XAxis dataKey="label" fontSize={10} axisLine={false} tickLine={false} interval={isDashboard ? 1 : 0} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tickMargin={5} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#18181b' : '#fff',
                    border: 'none',
                    color: darkMode ? '#fff' : '#000',
                    borderRadius: '8px',
                    fontSize: '10px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
                  }}
                />
                <CartesianGrid strokeDasharray="1 4" />
                <Legend
                  iconSize={8}
                  align="center"
                  verticalAlign="bottom"
                  wrapperStyle={{
                    fontSize: '8px',
                    paddingTop: '10px',
                    width: '100%',
                    left: 0,
                    textAlign: 'center',
                  }}
                />
                <Line type="monotone" dataKey="Total" stroke={COLORS.total} strokeWidth={2} dot={{ r: 2 }} />
                <Bar dataKey="facebook" stackId="a" fill={COLORS.facebook} />
                <Bar dataKey="twitter" stackId="a" fill={COLORS.twitter} />
                <Bar dataKey="youtube" stackId="a" fill={COLORS.youtube} />
                <Bar dataKey="twitch" stackId="a" fill={COLORS.twitch} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={CARD_STYLE}>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-font mb-3">
            12-Month Avg Trend {viewMode.id === 0 ? '(minutes)' : ''}
          </h2>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <ComposedChart data={last12MonthsData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                <XAxis dataKey="label" fontSize={10} axisLine={false} tickLine={false} interval={isDashboard ? 1 : 0} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tickMargin={5} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#18181b' : '#fff',
                    border: 'none',
                    color: darkMode ? '#fff' : '#000',
                    borderRadius: '8px',
                    fontSize: '10px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
                  }}
                />
                <CartesianGrid strokeDasharray="1 4" />
                <Legend
                  iconSize={8}
                  align="center"
                  verticalAlign="bottom"
                  wrapperStyle={{
                    fontSize: '8px',
                    paddingTop: '10px',
                    width: '100%',
                    left: 0,
                    textAlign: 'center',
                  }}
                />
                <Line type="monotone" dataKey="Total" stroke={COLORS.total} strokeWidth={2} dot={{ r: 2 }} />
                <Bar dataKey="facebook" stackId="a" fill={COLORS.facebook} />
                <Bar dataKey="twitter" stackId="a" fill={COLORS.twitter} />
                <Bar dataKey="youtube" stackId="a" fill={COLORS.youtube} />
                <Bar dataKey="twitch" stackId="a" fill={COLORS.twitch} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${CARD_STYLE} sm:col-span-2`}>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-font mb-3">
            Recent Activity {viewMode.id === 0 ? '(minutes)' : ''}
          </h2>
          <div className="flex justify-center w-full">
            <HeatMap
              value={heatmapData}
              width={isDashboard ? '100%' : 230}
              startDate={snapToNextSunday(isDashboard ? 360 : 60)}
              endDate={new Date()}
              rectSize={12}
              space={3}
              legendCellSize={0}
              rectRender={(props, data) => {
                if (!data.date) return <rect {...props} />;
                const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                return (
                  <UIWTooltip
                    key={props.key}
                    placement="top"
                    content={`${data.count || 0} ${viewMode.id === 0 ? 'mins' : 'posts'} on ${formattedDate}`}>
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
      </div>
    </div>
  );
};
