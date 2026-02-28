import { useState, useEffect } from 'react';
import { adminService } from '../services/apiService';
import Card from '../components/Card';
import Table from '../components/Table';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, statsResponse] = await Promise.all([
        adminService.getAllUsers({ search }),
        adminService.getPlatformStats(),
      ]);
      setUsers(usersResponse.data.users);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name}? This will delete all their data.`)) {
      try {
        await adminService.deleteUser(user._id);
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Change ${user.name}'s role to ${newRole}?`)) {
      try {
        await adminService.updateUserRole(user._id, newRole);
        fetchData();
      } catch (error) {
        console.error('Error updating role:', error);
        alert('Failed to update role');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value, row) => (
        <button
          onClick={() => handleRoleChange(row)}
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === 'admin'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {value}
        </button>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Total Users</p>
            <p className="text-4xl font-bold mt-2">{stats?.totalUsers || 0}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Total Problems</p>
            <p className="text-4xl font-bold mt-2">{stats?.totalProblems || 0}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Total Jobs</p>
            <p className="text-4xl font-bold mt-2">{stats?.totalJobs || 0}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Total Projects</p>
            <p className="text-4xl font-bold mt-2">{stats?.totalProjects || 0}</p>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card title="Users Management">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="input-field max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchData()}
          />
        </div>
        <Table columns={columns} data={users} onDelete={handleDeleteUser} />
      </Card>

      {/* Recent Users */}
      {stats?.recentUsers && stats.recentUsers.length > 0 && (
        <Card title="Recent Users">
          <div className="space-y-3">
            {stats.recentUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminPanel;
