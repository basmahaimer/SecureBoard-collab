// src/pages/ProjectForm.jsx (simplified)
import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateProject, useUpdateProject } from '../hooks/projects';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function ProjectForm({ initial = null }) {
  const { register, handleSubmit } = useForm({ defaultValues: initial ?? {} });
  const create = useCreateProject();
  const update = useUpdateProject();
  const nav = useNavigate();
  const onSubmit = async (data) => {
    if (initial) {
      await update.mutateAsync({ id: initial.id, payload: data });
    } else {
      await create.mutateAsync(data);
    }
    nav('/projects');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <label className="block mb-2">Title
        <input {...register('title', { required: true })} className="input" />
      </label>
      <label className="block mb-2">Description
        <textarea {...register('description')} className="input" />
      </label>
      <button type="submit" className="btn mt-4">Save</button>
    </form>
  );
}
