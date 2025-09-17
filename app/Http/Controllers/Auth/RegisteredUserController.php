<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Events\UserRegistered; // ⭐ ASSUREZ-VOUS QUE CET IMPORT EXISTE
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // ⭐ AJOUTEZ CET IMPORT
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): JsonResponse // ⭐ TYPEHINT JsonResponse
    {
        // Validation des champs
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['nullable', 'string', 'in:admin,manager,user'],
        ]);

        // Création de l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Définir le rôle
        $roleName = $request->input('role', 'user');
        $role = Role::firstOrCreate(['name' => $roleName]);
        $user->roles()->sync([$role->id]);

        // ⭐ DÉCLENCHEZ VOTRE EVENT PERSONNALISÉ (TRÈS IMPORTANT!)
        event(new UserRegistered($user));

        // Déclenche l'événement Registered (email verification Laravel)
        event(new Registered($user));

        // Création du token API
        $token = $user->createToken('api-token')->plainTextToken;

        // ⭐ RETOURNEZ DU JSON EXPLICITE (NE LAISSEZ PAS DE REDIRECTION)
        return response()->json([
            'user' => $user->load('roles.permissions'),
            'token' => $token,
        ], 201);
    }
}