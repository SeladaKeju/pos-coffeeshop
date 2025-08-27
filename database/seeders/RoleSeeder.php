<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat role
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $cashierRole = Role::firstOrCreate(['name' => 'cashier']);

        // Permission untuk Admin (semua permission)
        $adminPermissions = [
            // Kategori/Menu/Variant/Modifier
            'category.view', 'category.create', 'category.update', 'category.delete',
            'menu.view', 'menu.create', 'menu.update', 'menu.delete',
            'variant.view', 'variant.create', 'variant.update', 'variant.delete',
            'modifier.view', 'modifier.create', 'modifier.update', 'modifier.delete',

            // User & Role Management
            'user.view', 'user.create', 'user.update', 'user.delete',
            'role.view', 'role.assign',

            // Pembayaran & Bill
            'payment.view', 'payment.process', 'payment.refund',
            'bill.view', 'bill.print',

            // Shift & Laporan
            'shift.open', 'shift.close', 'shift.view-report',
        ];

        // Permission untuk Cashier (permission terbatas)
        $cashierPermissions = [
            // Kategori/Menu/Variant/Modifier (hanya view)
            'category.view',
            'menu.view',
            'variant.view',
            'modifier.view',

            // Order (semua kecuali cancel item)
            'order.view', 'order.create', 'order.update',

            // Pembayaran & Bill (semua)
            'payment.view', 'payment.process', 'payment.refund',
            'bill.view', 'bill.print',

            // Shift (open, close, view report)
            'shift.open', 'shift.close', 'shift.view-report',
        ];

        // Assign permissions ke role
        $adminRole->syncPermissions($adminPermissions);
        $cashierRole->syncPermissions($cashierPermissions);
    }
}
