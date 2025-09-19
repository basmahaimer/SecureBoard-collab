<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectCreatedNotification;
use App\Notifications\ProjectAssignedNotification;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Project::class, 'project');
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $query = Project::with(['user:id,name,email', 'assignedUser:id,name,email']);
        
        if ($request->user()->hasRole('user')) {
            $query->where(function($q) use ($request) {
                $q->where('assigned_user_id', $request->user()->id)
                  ->orWhere('user_id', $request->user()->id);
            });
        }
        
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'status' => 'sometimes|in:pending,in_progress,completed',
                'assigned_user_id' => 'sometimes|nullable|exists:users,id'
            ]);

            $projectData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'status' => $validated['status'] ?? 'pending',
                'user_id' => $request->user()->id
            ];

            // Gérer l'assignation (chaîne vide ou null)
            if (isset($validated['assigned_user_id']) && $validated['assigned_user_id'] !== '') {
                $projectData['assigned_user_id'] = $validated['assigned_user_id'];
            } else {
                $projectData['assigned_user_id'] = null;
            }

            $project = Project::create($projectData);

            // 🔔 Charger les relations avec seulement les champs nécessaires
            $project->load(['user:id,name', 'assignedUser:id,name']);

            // 🔔 Notification aux admins et managers
            $adminsAndManagers = User::whereHas('roles', function($query) {
                $query->whereIn('name', ['admin', 'manager']);
            })->get();

            foreach ($adminsAndManagers as $user) {
                $user->notify(new ProjectCreatedNotification($project));
            }

            // 🔔 Notification à l'utilisateur assigné
            if ($project->assigned_user_id) {
                $assignedUser = User::find($project->assigned_user_id);
                if ($assignedUser) {
                    $assignedUser->notify(new ProjectAssignedNotification($project));
                }
            }

            return response()->json($project, 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur création projet: ' . $e->getMessage());
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Project $project)
    {
        $project->load(['user:id,name,email', 'assignedUser:id,name,email']);
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'status' => 'sometimes|in:pending,in_progress,completed',
                'assigned_user_id' => 'sometimes|nullable|exists:users,id'
            ]);

            $oldAssignedUserId = $project->assigned_user_id;
            
            // Mettre à jour les champs
            if (isset($validated['title'])) $project->title = $validated['title'];
            if (isset($validated['description'])) $project->description = $validated['description'];
            if (isset($validated['status'])) $project->status = $validated['status'];
            
            // Gérer l'assignation
            if (array_key_exists('assigned_user_id', $validated)) {
                $project->assigned_user_id = $validated['assigned_user_id'] ?: null;
            }
            
            $project->save();
            $project->load(['user:id,name', 'assignedUser:id,name']);

            // 🔔 Notification si l'assignation change
            if ($project->assigned_user_id != $oldAssignedUserId) {
                if ($project->assigned_user_id) {
                    $assignedUser = User::find($project->assigned_user_id);
                    if ($assignedUser) {
                        $assignedUser->notify(new ProjectAssignedNotification($project));
                    }
                }
            }

            return response()->json($project);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur modification projet: ' . $e->getMessage());
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['message' => 'Projet supprimé avec succès']);
    }
}