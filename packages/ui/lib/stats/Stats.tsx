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
} from 'recharts';
import HeatMap from '@uiw/react-heat-map';
import UIWTooltip from '@uiw/react-tooltip';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';

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

const formatToMinutes = (s: number) => {
  const mins = Math.round(s / 60);
  return mins;
};

const views = [
  {
    id: 0,
    name: 'Time Spent',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    id: 1,
    name: 'Post Counts',
    icon: (
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
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    ),
  },
];

export const Stats: React.FC<StatsProps> = ({ mode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [postHistory, setPostHistory] = useState<any[]>([]);
  const [timeHistory, setTimeHistory] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState(views[0]); //0 for time 1 for posts

  useEffect(() => {
    chrome.storage.local.get(['darkMode', 'post_count_history', 'time_count_history'], result => {
      setDarkMode(result.darkMode ?? false);
      setPostHistory(result.post_count_history || []);
      setTimeHistory(result.time_count_history || []);
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

  const last7DaysData = useMemo(() => {
    const source = viewMode.id === 0 ? timeHistory : postHistory;
    return source
      .slice(0, 7)
      .reverse()
      .map((day, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          Total: viewMode.id === 0 ? formatToMinutes(day.total) : day.total,
          facebook: viewMode.id === 0 ? formatToMinutes(day.facebook) : day.facebook,
          twitter: viewMode.id === 0 ? formatToMinutes(day.twitter) : day.twitter,
          twitch: viewMode.id === 0 ? formatToMinutes(day.twitch) : day.twitch,
          youtube: viewMode.id === 0 ? formatToMinutes(day.youtube) : day.youtube,
          label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        };
      });
  }, [viewMode, postHistory, timeHistory]);

  const last12MonthsData = useMemo(() => {
    const source = viewMode.id === 0 ? timeHistory : postHistory;
    const monthsMap: { [key: string]: { sum: number; count: number } } = {};
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthsMap[key] = { sum: 0, count: 0 };
    }

    source.forEach((day, index) => {
      const d = new Date();
      d.setDate(d.getDate() - index);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      if (monthsMap[key]) {
        monthsMap[key].sum += viewMode.id === 0 ? formatToMinutes(day.total || 0) : day.total || 0;
        monthsMap[key].count += 1;
      }
    });

    return Object.keys(monthsMap).map(key => {
      const { sum, count } = monthsMap[key];
      return {
        label: key,
        average: count > 0 ? Math.round(sum / count) : 0,
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

  return (
    <div className={`p-2 mx-auto dark:bg-zinc-900 min-h-screen`}>
      <Listbox value={viewMode} onChange={setViewMode}>
        <ListboxButton
          id="platform-listbox"
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

      <div className="text-center mb-6">
        <p className="text-6xl font-extrabold tracking-tight" style={{ color: COLORS.total }}>
          {todayTotal}
        </p>
        <h1 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
          {viewMode.id === 0 ? 'Active Time' : 'Posts Seen'} Today
        </h1>
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
              color: darkMode ? '#fff' : '#000',
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
          <Line type="monotone" dataKey="Total" stroke={COLORS.total} strokeWidth={2} dot={{ r: 2 }} />
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
                color: darkMode ? '#fff' : '#000',
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
