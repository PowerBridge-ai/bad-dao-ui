import { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Filter, Download, RefreshCw } from 'lucide-react';
import TreasuryCard from '../components/common/TreasuryCard';

const Treasury = () => {
  const [timeRange, setTimeRange] = useState('1m');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock chart data
  const chartData = [
    { date: 'Apr 01', value: 2400000 },
    { date: 'Apr 03', value: 2800000 },
    { date: 'Apr 06', value: 2700000 },
    { date: 'Apr 09', value: 3000000 },
    { date: 'Apr 12', value: 2900000 },
    { date: 'Apr 15', value: 3500000 },
    { date: 'Apr 18', value: 3200000 },
    { date: 'Apr 21', value: 3400000 },
    { date: 'Apr 24', value: 3100000 },
    { date: 'Apr 27', value: 3300000 },
    { date: 'Apr 30', value: 3241590 },
  ];

  // Mock asset distribution data
  const assetData = [
    { name: 'ETH', value: 2100000 },
    { name: 'USDC', value: 850000 },
    { name: 'USDT', value: 150000 },
    { name: 'BAD Token', value: 141590 },
  ];

  // Colors for pie chart
  const COLORS = ['#2E5BFF', '#6E8EFA', '#F5A623', '#28C96F'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-lg">
        <div className="h-16 bg-neutral-light/50 rounded-lg"></div>
        <div className="h-64 bg-neutral-light/50 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div className="h-32 bg-neutral-light/50 rounded-lg"></div>
          <div className="h-32 bg-neutral-light/50 rounded-lg"></div>
          <div className="h-32 bg-neutral-light/50 rounded-lg"></div>
          <div className="h-32 bg-neutral-light/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-xl pb-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-h1 mb-sm">Treasury</h1>
          <p className="text-body-lg text-neutral-medium">
            Monitor and manage the DAO's financial resources
          </p>
        </div>
        
        <div className="flex gap-md">
          <button type="button" className="btn-secondary">
            <Filter size={18} className="mr-sm" />
            Filter
          </button>
          
          <button type="button" className="btn-secondary">
            <Download size={18} className="mr-sm" />
            Export
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
        <TreasuryCard
          title="Total Value"
          value="$3,241,590"
          changePercent={2.4}
          change="$78,245"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#6E8EFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#6E8EFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}
        />
        
        <TreasuryCard
          title="ETH Balance"
          value="876.24 ETH"
          changePercent={-1.3}
          change="-11.54 ETH"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9982 2L11.8564 2.54343V16.0846L11.9982 16.2281L18.2667 12.357L11.9982 2Z" fill="#6E8EFA"/>
            <path d="M11.9966 2L5.72656 12.357L11.9966 16.2281V9.66243V2Z" fill="#6E8EFA" fillOpacity="0.6"/>
            <path d="M11.9982 17.455L11.918 17.5542V22.7463L11.9982 22.9999L18.2735 13.5876L11.9982 17.455Z" fill="#6E8EFA"/>
            <path d="M11.9966 22.9999V17.455L5.72656 13.5876L11.9966 22.9999Z" fill="#6E8EFA" fillOpacity="0.6"/>
            <path d="M11.9971 16.2281L18.2656 12.357L11.9971 9.66243V16.2281Z" fill="#6E8EFA" fillOpacity="0.8"/>
            <path d="M5.72656 12.357L11.9966 16.2281V9.66243L5.72656 12.357Z" fill="#6E8EFA" fillOpacity="0.8"/>
          </svg>}
        />
        
        <TreasuryCard
          title="USDC Balance"
          value="1,245,000 USDC"
          changePercent={0}
          change="0 USDC"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#6E8EFA" fillOpacity="0.2"/>
            <path d="M12.9167 15.3583C12.9167 15.95 12.5667 16.3 11.975 16.3H10.8333V17.5H9.66667V16.3H8.75V15.1333H9.66667H11.975C12.5667 15.1333 12.9167 14.7833 12.9167 14.1917C12.9167 13.6 12.5667 13.25 11.975 13.25H10.025C9.08333 13.25 8.58333 12.5583 8.58333 11.6167C8.58333 10.675 9.08333 9.98333 10.025 9.98333H10.8333V8.75H11.9917V9.98333H12.9167V11.15H11.9917H10.025C9.43333 11.15 9.08333 11.5 9.08333 12.0917C9.08333 12.6833 9.43333 13.0333 10.025 13.0333H11.975C12.9167 13.0333 13.4167 13.725 13.4167 14.6667C13.4167 15.6083 12.9167 16.3 11.975 16.3" fill="#6E8EFA"/>
            <path d="M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5Z" stroke="#6E8EFA" strokeWidth="1.5" strokeMiterlimit="10"/>
          </svg>}
        />
        
        <TreasuryCard
          title="BAD Token Price"
          value="$1.24"
          changePercent={5.1}
          change="$0.06"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V6M12 18V21M5.63604 5.63604L7.75736 7.75736M16.2426 16.2426L18.364 18.364M3 12H6M18 12H21M5.63604 18.364L7.75736 16.2426M16.2426 7.75736L18.364 5.63604" stroke="#6E8EFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#6E8EFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}
        />
      </div>
      
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
          <h2 className="text-h2">Treasury Value Over Time</h2>
          
          <div className="flex items-center gap-md">
            <div className="flex">
              <button
                type="button"
                className={`px-3 py-1 text-body-sm rounded-l-lg border border-r-0 ${
                  timeRange === '1w' ? 'bg-primary text-white border-primary' : 'border-neutral-light'
                }`}
                onClick={() => setTimeRange('1w')}
              >
                1W
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-body-sm border border-r-0 ${
                  timeRange === '1m' ? 'bg-primary text-white border-primary' : 'border-neutral-light'
                }`}
                onClick={() => setTimeRange('1m')}
              >
                1M
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-body-sm border border-r-0 ${
                  timeRange === '3m' ? 'bg-primary text-white border-primary' : 'border-neutral-light'
                }`}
                onClick={() => setTimeRange('3m')}
              >
                3M
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-body-sm rounded-r-lg border ${
                  timeRange === '1y' ? 'bg-primary text-white border-primary' : 'border-neutral-light'
                }`}
                onClick={() => setTimeRange('1y')}
              >
                1Y
              </button>
            </div>
            
            <button
              type="button"
              className="text-neutral-medium hover:text-primary p-1 rounded-full"
              aria-label="Refresh data"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E5BFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2E5BFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6E6E6E' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E5E5' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6E6E6E' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E5E5' }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value) => [`${formatCurrency(value as number)}`, 'Treasury Value']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2E5BFF" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="md:col-span-1">
          <div className="card">
            <h2 className="text-h2 mb-lg">Asset Distribution</h2>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    layout="horizontal"
                    formatter={(value, entry, index) => {
                      const item = assetData[index];
                      return <span style={{ color: '#1E1E1E' }}>{value}: {formatCurrency(item.value)}</span>;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-h2 mb-lg">Recent Transactions</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-light">
                    <th className="px-md py-sm text-label text-neutral-medium font-semibold">Transaction</th>
                    <th className="px-md py-sm text-label text-neutral-medium font-semibold">Amount</th>
                    <th className="px-md py-sm text-label text-neutral-medium font-semibold">Date</th>
                    <th className="px-md py-sm text-label text-neutral-medium font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-light">
                    <td className="px-md py-md">
                      <div>
                        <p className="text-body font-medium">Treasury Withdrawal</p>
                        <p className="text-body-sm text-neutral-medium">0x3ab...12cd</p>
                      </div>
                    </td>
                    <td className="px-md py-md">
                      <p className="text-body">45.5 ETH</p>
                    </td>
                    <td className="px-md py-md">
                      <p className="text-body-sm">April 15, 2025</p>
                    </td>
                    <td className="px-md py-md">
                      <span className="badge badge-success">Completed</span>
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-light">
                    <td className="px-md py-md">
                      <div>
                        <p className="text-body font-medium">Token Purchase</p>
                        <p className="text-body-sm text-neutral-medium">0xabc...78ef</p>
                      </div>
                    </td>
                    <td className="px-md py-md">
                      <p className="text-body">250,000 USDC</p>
                    </td>
                    <td className="px-md py-md">
                      <p className="text-body-sm">April 12, 2025</p>
                    </td>
                    <td className="px-md py-md">
                      <span className="badge badge-success">Completed</span>
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-light">
                    <td className="px-md py-md">
                      <div>
                        <p className="text-body font-medium">Developer Grant</p>
                        <p className="text-body-sm text-neutral-medium">0xdef...45ab</p>
                      </div>
                    </td>
                    <td className="px-md py-md">
                      <p className="text-body">15.75 ETH</p>
                    </td>
                    <td className="px-md py-md">
                      <p className="text-body-sm">April 8, 2025</p>
                    </td>
                    <td className="px-md py-md">
                      <span className="badge badge-info">Pending</span>
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-light">
                    <td className="px-md py-md">
                      <div>
                        <p className="text-body font-medium">Token Sale</p>
                        <p className="text-body-sm text-neutral-medium">0xfed...98ba</p>
                      </div>
                    </td>
                    <td className="px-md py-md">
                      <p className="text-body">50,000 BAD</p>
                    </td>
                    <td className="px-md py-md">
                      <p className="text-body-sm">April 5, 2025</p>
                    </td>
                    <td className="px-md py-md">
                      <span className="badge badge-success">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-lg flex justify-center">
              <button type="button" className="btn-tertiary">
                View All Transactions
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-sm">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treasury;