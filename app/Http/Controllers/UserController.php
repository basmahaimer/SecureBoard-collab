<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Notifications\UserCreatedNotification;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin')->only(['index','store','update','destroy']);
    }

    public function show(Request $request)
    {
        return $request->user()->load('roles');
    }

    public function index()
    {
        return User::with('roles')->get();
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|confirmed|min:8',
                'role' => 'required|string|in:admin,manager,user',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // 🔔 Assigner le rôle avec Laratrust
            $user->addRole($validated['role']);

            // 🔔 Notification vers tous les admins
            $admins = User::whereHas('roles', function($query) {
                $query->where('name', 'admin');
            })->get();

            foreach ($admins as $admin) {
                $admin->notify(new UserCreatedNotification($user));
            }

            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'user' => $user->load('roles')
            ], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur création utilisateur: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|string|email|max:255|unique:users,email,'.$user->id,
                'role' => 'sometimes|string|in:admin,manager,user',
            ]);

            if (isset($validated['name']) || isset($validated['email'])) {
                $user->update($request->only(['name', 'email']));
            }

            if (isset($validated['role'])) {
                $user->syncRoles([$validated['role']]);
            }

            return response()->json([
                'message' => 'Utilisateur mis à jour avec succès',
                'user' => $user->load('roles')
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur mise à jour utilisateur: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Impossible de supprimer votre propre compte'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}