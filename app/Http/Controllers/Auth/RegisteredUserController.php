<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request)
    {
        // Validation des champs
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['nullable', 'string', 'in:admin,manager,user'], // optionnel mais contrôle valide
        ]);

        // Création de l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Définir le rôle
        $roleName = $request->input('role', 'user'); // 'user' par défaut
        $role = Role::firstOrCreate(['name' => $roleName]);
        $user->roles()->sync([$role->id]); // attache le rôle choisi

        // Déclenche l'événement Registered (email verification si activé)
        event(new Registered($user));

        // Création du token API
        $token = $user->createToken('api-token')->plainTextToken;

        // Retour JSON avec roles + permissions chargés
        return response()->json([
            'user' => $user->load('roles.permissions'),
            'token' => $token,
        ], 201);
    }
}

