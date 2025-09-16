<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Profil connecté
    public function show(Request $request)
    {
        return $request->user()->load('roles.permissions');
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $user->update($request->only(['name','email']));
        return $user->load('roles.permissions');
    }

    // CRUD Admin
    public function index()
    {
        return User::with('roles.permissions')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required','string','max:255'],
            'email' => ['required','string','email','max:255','unique:users,email'],
            'password' => ['required','confirmed','min:8'],
            'role' => ['required','string','in:admin,manager,user'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $role = Role::firstOrCreate(['name' => $request->role]);
        $user->roles()->sync([$role->id]);

        return $user->load('roles.permissions');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => ['sometimes','string','max:255'],
            'email' => ['sometimes','string','email','max:255','unique:users,email,'.$user->id],
            'role' => ['sometimes','string','in:admin,manager,user'],
        ]);

        $user->update($request->only(['name','email']));

        if ($request->has('role')) {
            $role = Role::firstOrCreate(['name' => $request->role]);
            $user->roles()->sync([$role->id]);
        }

        return $user->load('roles.permissions');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message'=>'Utilisateur supprimé']);
    }
}
