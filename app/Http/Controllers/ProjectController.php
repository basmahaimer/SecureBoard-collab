<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Events\ProjectCreated;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function __construct()
    {
        // Autorisation via Policy
        $this->authorizeResource(Project::class, 'project');
        $this->middleware('auth:sanctum'); // Assure que toutes les routes sont protégées
    }

    public function index(Request $request): JsonResponse
    {
        $query = Project::with('user');

        if ($request->user()->hasRole('user')) {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'sometimes|in:pending,in_progress,completed'
        ]);

        $project = Project::create([
            ...$validated,
            'user_id' => $request->user()->id
        ]);

        event(new ProjectCreated($project));

        return response()->json($project->load('user'), 201);
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json($project->load('user'));
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status' => 'sometimes|in:pending,in_progress,completed'
        ]);

        $project->update($validated);

        return response()->json($project->load('user'));
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json(['message' => 'Projet supprimé avec succès']);
    }
}
