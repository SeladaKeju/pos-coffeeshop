<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $perms = [
            // Kategori/Menu/Variant/Modifier
            'category.view', 'category.create', 'category.update', 'category.delete',
            'menu.view', 'menu.create', 'menu.update', 'menu.delete',
            'variant.view', 'variant.create', 'variant.update', 'variant.delete',
            'modifier.view', 'modifier.create', 'modifier.update', 'modifier.delete',

            // User & Role Management
            'user.view', 'user.create', 'user.update', 'user.delete',
            'role.view', 'role.assign',

            // Order
            'order.view', 'order.create', 'order.update', 'order.cancel-item', 'order.send-to-kitchen',

            // Pembayaran & Bill
            'payment.view', 'payment.process', 'payment.refund',
            'bill.view', 'bill.print',

            // Shift & Laporan
            'shift.open', 'shift.close', 'shift.view-report',
        ];

        foreach ($perms as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }
    }
}
