<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    /**
     * Détermine si l'utilisateur peut voir tous les projets
     */
    public function viewAny(User $user): bool
    {
        // ✅ Tous les utilisateurs authentifiés peuvent voir la liste des projets
        return true;
    }

    /**
     * Détermine si l'utilisateur peut voir le projet
     */
    public function view(User $user, Project $project): bool
    {
        // ✅ User peut voir le projet s'il en est le créateur, assigné, ou admin/manager
        return $user->hasRole('admin') 
            || $user->hasRole('manager')
            || $project->user_id === $user->id
            || $project->assigned_user_id === $user->id;
    }

    /**
     * Détermine si l'utilisateur peut créer des projets
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('manager');
    }

    /**
     * Détermine si l'utilisateur peut modifier le projet
     */
    public function update(User $user, Project $project): bool
    {
        return $user->hasRole('admin') || $project->user_id === $user->id;
    }

    /**
     * Détermine si l'utilisateur peut supprimer le projet
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->hasRole('admin') || $project->user_id === $user->id;
    }
}