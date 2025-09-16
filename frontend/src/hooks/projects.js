import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

// fetch all
export function useProjects() {
  return useQuery(['projects'], async () => {
    const { data } = await api.get('/projects');
    return data.data ?? data;
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation(payload => api.post('/projects', payload).then(r => r.data), {
    onSuccess: () => qc.invalidateQueries(['projects'])
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation(({ id, payload }) => api.patch(`/projects/${id}`, payload).then(r => r.data), {
    onSuccess: () => qc.invalidateQueries(['projects'])
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation(id => api.delete(`/projects/${id}`).then(r => r.data), {
    onMutate: async (id) => {
      await qc.cancelQueries(['projects']);
      const previous = qc.getQueryData(['projects']);
      qc.setQueryData(['projects'], old => old?.filter(p => p.id !== id) ?? []);
      return { previous };
    },
    onError: (err, vars, ctx) => qc.setQueryData(['projects'], ctx.previous),
    onSettled: () => qc.invalidateQueries(['projects'])
  });
}
