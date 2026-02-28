import { useState, useEffect } from 'react';
import { jobService } from '../services/apiService';
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    notes: '',
    appliedDate: new Date().toISOString().split('T')[0],
    location: '',
    jobType: 'Full-time',
    salary: '',
    jobLink: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [currentPage, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobs({ page: currentPage, limit: 10, ...filters });
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await jobService.updateJob(editingJob._id, formData);
      } else {
        await jobService.addJob(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      alert(error.response?.data?.error || 'Failed to save job');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      company: job.company,
      role: job.role,
      status: job.status,
      notes: job.notes || '',
      appliedDate: new Date(job.appliedDate).toISOString().split('T')[0],
      location: job.location || '',
      jobType: job.jobType,
      salary: job.salary || '',
      jobLink: job.jobLink || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (job) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await jobService.deleteJob(job._id);
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      status: 'Applied',
      notes: '',
      appliedDate: new Date().toISOString().split('T')[0],
      location: '',
      jobType: 'Full-time',
      salary: '',
      jobLink: '',
    });
    setEditingJob(null);
  };

  const columns = [
    { key: 'company', label: 'Company' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === 'Offer'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : value === 'Interview'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : value === 'Applied'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'jobType', label: 'Type' },
    {
      key: 'appliedDate',
      label: 'Applied Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Tracker</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="btn-primary">
          + Add Job
        </button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search company or role..."
            className="input-field"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="input-field"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
          <button onClick={() => setFilters({ status: '', search: '' })} className="btn-secondary">
            Clear Filters
          </button>
        </div>
      </Card>

      <Card>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Table columns={columns} data={jobs} onEdit={handleEdit} onDelete={handleDelete} />
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
          </>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingJob ? 'Edit Job' : 'Add Job'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
            <input type="text" required className="input-field" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
            <input type="text" required className="input-field" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
              <select className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
              <select className="input-field" value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input type="text" className="input-field" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Applied Date</label>
            <input type="date" className="input-field" value={formData.appliedDate} onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea className="input-field" rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 btn-secondary">Cancel</button>
            <button type="submit" className="flex-1 btn-primary">{editingJob ? 'Update' : 'Add'} Job</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Jobs;
