<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run()
    {
        \DB::table('permission_role')->delete();
        \DB::table('permission_user')->delete();
        \DB::table('role_user')->delete();
        \DB::table('permissions')->delete();
        \DB::table('roles')->delete();

        // Créer les rôles
        $adminRole = Role::create(['name' => 'admin']);
        $managerRole = Role::create(['name' => 'manager']);
        $userRole = Role::create(['name' => 'user']);

        // Créer les permissions
        $manageUsers = Permission::create(['name' => 'manage-users']);
        $manageProjects = Permission::create(['name' => 'manage-projects']);

        // Attacher les permissions via relation
        $adminRole->permissions()->sync([$manageUsers->id, $manageProjects->id]);
        $managerRole->permissions()->sync([$manageProjects->id]);
        // user = pas de permission
    }
}
