import React from 'react';
import { useProjects, useDeleteProject } from '../hooks/projects';
import { useAuth } from '../auth/AuthProvider';
import { Link } from 'react-router-dom';

export default function ProjectsList(){
  const { data: projects, isLoading, error } = useProjects();
  const deleteMut = useDeleteProject();
  const { user, hasRole } = useAuth();

  if (isLoading) return <div>Loading projects…</div>;
  if (error) return <div>Error loading projects</div>;

  const canModify = (project) => user && (user.id === project.owner_id || hasRole('admin'));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        {hasRole('manager') && <Link to="/projects/new" className="btn">New Project</Link>}
      </div>
      <ul className="space-y-3">
        {projects.map(p => (
          <li key={p.id} className="p-4 border rounded">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.description}</p>
              </div>
              <div className="flex gap-2">
                {canModify(p) && <Link to={`/projects/${p.id}/edit`} className="btn">Edit</Link>}
                {canModify(p) && (
                  <button
                    onClick={() => confirm('Delete?') && deleteMut.mutate(p.id)}
                    className="btn btn-red"
                    disabled={deleteMut.isLoading}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
