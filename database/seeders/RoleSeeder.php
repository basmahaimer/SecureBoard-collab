<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Désactiver les contraintes FK
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Vider les tables
        DB::table('permission_role')->truncate();
        DB::table('permission_user')->truncate();
        DB::table('role_user')->truncate();
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();

        // Réactiver les contraintes FK
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Créer les rôles
        $adminRole = Role::create(['name' => 'admin']);
        $managerRole = Role::create(['name' => 'manager']);
        $userRole = Role::create(['name' => 'user']);

        // Créer les permissions
        $manageUsers = Permission::create(['name' => 'manage-users']);
        $manageProjects = Permission::create(['name' => 'manage-projects']);

        // Attacher les permissions
        $adminRole->permissions()->sync([$manageUsers->id, $manageProjects->id]);
        $managerRole->permissions()->sync([$manageProjects->id]);
    }
}
