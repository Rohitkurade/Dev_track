import { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../services/apiService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [dsaAnalytics, setDsaAnalytics] = useState(null);
  const [jobAnalytics, setJobAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dsaResponse, jobResponse] = await Promise.all([
        analyticsService.getDSAAnalytics(),
        analyticsService.getJobAnalytics(),
      ]);
      setDsaAnalytics(dsaResponse.data.analytics);
      setJobAnalytics(jobResponse.data.funnel);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const difficultyData = dsaAnalytics?.difficultyBreakdown
    ? Object.entries(dsaAnalytics.difficultyBreakdown).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];

  const topicData = dsaAnalytics?.topicDistribution
    ? dsaAnalytics.topicDistribution.map((item) => ({
        name: item._id,
        count: item.count,
      }))
    : [];

  const weeklyData = dsaAnalytics?.weeklyTrend
    ? dsaAnalytics.weeklyTrend.reverse().map((item) => ({
        week: `Week ${item._id.week}`,
        solved: item.count,
      }))
    : [];

  const jobStatusData = jobAnalytics
    ? Object.entries(jobAnalytics).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's your progress overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Total Problems Solved</p>
            <p className="text-4xl font-bold mt-2">{dsaAnalytics?.totalSolved || 0}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Easy Problems</p>
            <p className="text-4xl font-bold mt-2">
              {dsaAnalytics?.difficultyBreakdown?.Easy || 0}
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Medium Problems</p>
            <p className="text-4xl font-bold mt-2">
              {dsaAnalytics?.difficultyBreakdown?.Medium || 0}
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Hard Problems</p>
            <p className="text-4xl font-bold mt-2">
              {dsaAnalytics?.difficultyBreakdown?.Hard || 0}
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <Card title="Difficulty Distribution">
          {difficultyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              No data available
            </p>
          )}
        </Card>

        {/* Job Application Funnel */}
        <Card title="Job Application Status">
          {jobStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              No data available
            </p>
          )}
        </Card>

        {/* Weekly Trend */}
        <Card title="Weekly Solving Trend" className="lg:col-span-2">
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="solved" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              No data available
            </p>
          )}
        </Card>

        {/* Top Topics */}
        <Card title="Top Topics" className="lg:col-span-2">
          {topicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              No data available
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
