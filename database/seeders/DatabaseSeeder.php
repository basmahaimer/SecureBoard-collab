<?php

// database/seeders/DatabaseSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Désactiver FK pour vider les tables
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('permission_role')->truncate();
        DB::table('permission_user')->truncate();
        DB::table('role_user')->truncate();
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Créer les rôles
        $adminRole = Role::create(['name' => 'admin']);
        $managerRole = Role::create(['name' => 'manager']);
        $userRole = Role::create(['name' => 'user']);

        // Créer les permissions
        $manageUsers = Permission::create(['name' => 'manage-users']);
        $manageProjects = Permission::create(['name' => 'manage-projects']);

        // Attacher les permissions aux rôles
        $adminRole->permissions()->sync([$manageUsers->id, $manageProjects->id]);
        $managerRole->permissions()->sync([$manageProjects->id]);

        // Créer les utilisateurs
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('Password123!'),
        ]);
        $admin->roles()->attach($adminRole->id);

        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => bcrypt('Password123!'),
        ]);
        $manager->roles()->attach($managerRole->id);

        $user = User::create([
            'name' => 'Normal User',
            'email' => 'user@example.com',
            'password' => bcrypt('Password123!'),
        ]);
        $user->roles()->attach($userRole->id);
    }
}
