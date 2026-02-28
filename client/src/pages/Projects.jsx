import { useState, useEffect } from 'react';
import { projectService } from '../services/apiService';
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveLink: '',
    status: 'In Progress',
  });

  useEffect(() => {
    fetchProjects();
  }, [currentPage, filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects({ page: currentPage, limit: 10, ...filters });
      setProjects(response.data.projects);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        techStack: formData.techStack.split(',').map((tech) => tech.trim()).filter(Boolean),
      };
      if (editingProject) {
        await projectService.updateProject(editingProject._id, dataToSubmit);
      } else {
        await projectService.addProject(dataToSubmit);
      }
      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error.response?.data?.error || 'Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      status: project.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (project) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(project._id);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techStack: '',
      githubLink: '',
      liveLink: '',
      status: 'In Progress',
    });
    setEditingProject(null);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'techStack', 
      label: 'Tech Stack',
      render: (value) => value.slice(0, 3).join(', ') + (value.length > 3 ? '...' : '')
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === 'Completed'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : value === 'In Progress'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : value === 'Planning'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'githubLink',
      label: 'Links',
      render: (value, row) => (
        <div className="flex gap-2">
          {row.githubLink && (
            <a href={row.githubLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
              GitHub
            </a>
          )}
          {row.liveLink && (
            <a href={row.liveLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
              Live
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="btn-primary">
          + Add Project
        </button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search projects..."
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
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
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
            <Table columns={columns} data={projects} onEdit={handleEdit} onDelete={handleDelete} />
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
          </>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingProject ? 'Edit Project' : 'Add Project'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
            <input type="text" required className="input-field" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
            <textarea required className="input-field" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tech Stack * (comma-separated)</label>
            <input type="text" required className="input-field" placeholder="React, Node.js, MongoDB" value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Link</label>
            <input type="url" className="input-field" value={formData.githubLink} onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Link</label>
            <input type="url" className="input-field" value={formData.liveLink} onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 btn-secondary">Cancel</button>
            <button type="submit" className="flex-1 btn-primary">{editingProject ? 'Update' : 'Add'} Project</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
