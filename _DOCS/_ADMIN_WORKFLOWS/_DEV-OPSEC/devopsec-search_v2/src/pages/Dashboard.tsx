import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, Globe, ShieldAlert, Users, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import PlatformCategoryCard from '../components/PlatformCategoryCard';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  // Sample data for charts and stats
  const pieData = [
    { name: 'Confirmed', value: 78, color: '#00ff9d' },
    { name: 'Not Found', value: 45, color: '#00e5ff' },
    { name: 'Manual Check', value: 22, color: '#ffcb00' },
    { name: 'Error', value: 5, color: '#ff3d5e' },
  ];

  const barData = [
    { name: 'Social', confirmed: 32, notFound: 18, manual: 8 },
    { name: 'Dev', confirmed: 25, notFound: 12, manual: 5 },
    { name: 'Web', confirmed: 12, notFound: 8, manual: 4 },
    { name: 'Email', confirmed: 9, notFound: 7, manual: 5 },
  ];

  const recentScans = [
    { id: 1, date: '2025-04-01', emails: 35, platforms: 22, results: 150, status: 'Completed' },
    { id: 2, date: '2025-03-28', emails: 12, platforms: 15, results: 84, status: 'Completed' },
    { id: 3, date: '2025-03-25', emails: 28, platforms: 10, results: 102, status: 'Completed' },
  ];

  const categories = [
    { name: 'Social Media', icon: Users, count: 58, priority: 'High' },
    { name: 'Development', icon: Globe, count: 42, priority: 'Critical' },
    { name: 'Web Infrastructure', icon: Globe, count: 24, priority: 'Critical' },
    { name: 'Email & Communication', icon: Globe, count: 21, priority: 'High' },
    { name: 'Web3 Platforms', icon: Globe, count: 16, priority: 'Medium' },
    { name: 'Business Services', icon: Globe, count: 18, priority: 'Medium' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Accounts" 
          value="150" 
          change="+12%" 
          icon={<Users size={20} />} 
          positive={true} 
        />
        <StatCard 
          title="Platforms Scanned" 
          value="22" 
          change="+3" 
          icon={<Globe size={20} />} 
          positive={true} 
        />
        <StatCard 
          title="Critical Issues" 
          value="7" 
          change="-2" 
          icon={<ShieldAlert size={20} />} 
          positive={true} 
        />
        <StatCard 
          title="Latest Scan" 
          value="1h ago" 
          change="35 emails" 
          icon={<Zap size={20} />} 
          positive={false}
          hideArrow={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="bg-bg-secondary rounded-lg p-4 lg:col-span-2 border border-neon-green/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-display">Results by Platform Category</h2>
            <button className="text-sm text-neon-green flex items-center">
              View All <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#528f72' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#528f72' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a2530', borderColor: '#00ff9d', borderRadius: '4px' }} 
                  labelStyle={{ color: '#00ff9d' }}
                />
                <Legend />
                <Bar dataKey="confirmed" stackId="a" fill="#00ff9d" name="Confirmed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="notFound" stackId="a" fill="#00e5ff" name="Not Found" radius={[4, 4, 0, 0]} />
                <Bar dataKey="manual" stackId="a" fill="#ffcb00" name="Manual Check" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          className="bg-bg-secondary rounded-lg p-4 border border-neon-green/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-display">Overall Status</h2>
            <button className="text-sm text-neon-green flex items-center">
              Details <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a2530', borderColor: '#00ff9d', borderRadius: '4px' }} 
                  labelStyle={{ color: '#00ff9d' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="bg-bg-secondary rounded-lg p-4 border border-neon-green/10 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-display">Recent Scans</h2>
            <button className="text-sm text-neon-green flex items-center">
              View All <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-neon-green/10">
                  <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Date</th>
                  <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Emails</th>
                  <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Platforms</th>
                  <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Results</th>
                  <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Status</th>
                  <th className="py-3 text-left text-xs font-medium text-text-muted tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan) => (
                  <tr key={scan.id} className="border-b border-neon-green/5 hover:bg-bg-tertiary transition-colors">
                    <td className="py-3 text-sm whitespace-nowrap">{scan.date}</td>
                    <td className="py-3 text-sm whitespace-nowrap">{scan.emails}</td>
                    <td className="py-3 text-sm whitespace-nowrap">{scan.platforms}</td>
                    <td className="py-3 text-sm whitespace-nowrap">{scan.results}</td>
                    <td className="py-3 text-sm whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-neon-green/10 text-neon-green">
                        {scan.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap">
                      <button className="text-neon-blue hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div 
          className="bg-bg-secondary rounded-lg p-4 border border-neon-green/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-display">Platform Categories</h2>
            <button className="text-sm text-neon-green flex items-center">
              Add New <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <PlatformCategoryCard 
                key={index}
                name={category.name}
                count={category.count}
                priority={category.priority as any}
                icon={category.icon}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;