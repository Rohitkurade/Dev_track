import { useState, useEffect } from 'react';
import { problemService } from '../services/apiService';
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    difficulty: '',
    topic: '',
    status: '',
    search: '',
  });
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Array',
    status: 'Pending',
    notes: '',
    problemLink: '',
    solutionLink: '',
  });

  useEffect(() => {
    fetchProblems();
  }, [currentPage, filters]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await problemService.getProblems({
        page: currentPage,
        limit: 10,
        ...filters,
      });
      setProblems(response.data.problems);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProblem) {
        await problemService.updateProblem(editingProblem._id, formData);
      } else {
        await problemService.addProblem(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchProblems();
    } catch (error) {
      console.error('Error saving problem:', error);
      alert(error.response?.data?.error || 'Failed to save problem');
    }
  };

  const handleEdit = (problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      platform: problem.platform,
      difficulty: problem.difficulty,
      topic: problem.topic,
      status: problem.status,
      notes: problem.notes || '',
      problemLink: problem.problemLink || '',
      solutionLink: problem.solutionLink || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (problem) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await problemService.deleteProblem(problem._id);
        fetchProblems();
      } catch (error) {
        console.error('Error deleting problem:', error);
        alert('Failed to delete problem');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      platform: 'LeetCode',
      difficulty: 'Easy',
      topic: 'Array',
      status: 'Pending',
      notes: '',
      problemLink: '',
      solutionLink: '',
    });
    setEditingProblem(null);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'platform', label: 'Platform' },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === 'Easy'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : value === 'Medium'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'topic', label: 'Topic' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === 'Solved'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : value === 'Revision'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DSA Problems</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          + Add Problem
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="input-field"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="input-field"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            className="input-field"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Solved">Solved</option>
            <option value="Revision">Revision</option>
            <option value="Pending">Pending</option>
          </select>
          <button
            onClick={() => setFilters({ difficulty: '', topic: '', status: '', search: '' })}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Table
              columns={columns}
              data={problems}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingProblem ? 'Edit Problem' : 'Add Problem'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Platform *
            </label>
            <select
              className="input-field"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            >
              <option value="LeetCode">LeetCode</option>
              <option value="HackerRank">HackerRank</option>
              <option value="CodeForces">CodeForces</option>
              <option value="GeeksforGeeks">GeeksforGeeks</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty *
              </label>
              <select
                className="input-field"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status *
              </label>
              <select
                className="input-field"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Solved">Solved</option>
                <option value="Revision">Revision</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Topic *
            </label>
            <select
              className="input-field"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            >
              <option value="Array">Array</option>
              <option value="String">String</option>
              <option value="LinkedList">LinkedList</option>
              <option value="Tree">Tree</option>
              <option value="Graph">Graph</option>
              <option value="DynamicProgramming">Dynamic Programming</option>
              <option value="Recursion">Recursion</option>
              <option value="Backtracking">Backtracking</option>
              <option value="Greedy">Greedy</option>
              <option value="Sorting">Sorting</option>
              <option value="Searching">Searching</option>
              <option value="Stack">Stack</option>
              <option value="Queue">Queue</option>
              <option value="Heap">Heap</option>
              <option value="Hashing">Hashing</option>
              <option value="Math">Math</option>
              <option value="BitManipulation">Bit Manipulation</option>
              <option value="TwoPointers">Two Pointers</option>
              <option value="SlidingWindow">Sliding Window</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {editingProblem ? 'Update' : 'Add'} Problem
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Problems;
