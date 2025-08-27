<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@coffeshop.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Create Cashier User
        $cashier = User::create([
            'name' => 'Cashier User',
            'email' => 'cashier@coffeshop.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $cashier->assignRole('cashier');

        // Create Regular User
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@coffeshop.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        // No role assigned to regular user
    }
}
