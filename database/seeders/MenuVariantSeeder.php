<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\VariantGroup;
use Illuminate\Database\Seeder;

class MenuVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan ada menu dan variant group yang sudah dibuat
        $menus = Menu::all();
        $variantGroups = VariantGroup::all();

        if ($menus->isEmpty() || $variantGroups->isEmpty()) {
            $this->command->warn('No menus or variant groups found. Please run MenuSeeder and VariantGroupSeeder first.');
            return;
        }

        // Ambil variant groups berdasarkan nama
        $sizeGroup = VariantGroup::where('name', 'Size')->first();
        $temperatureGroup = VariantGroup::where('name', 'Temperature')->first();
        $milkGroup = VariantGroup::where('name', 'Milk Type')->first();
        $sweetnessGroup = VariantGroup::where('name', 'Sweetness Level')->first();

        // Loop melalui semua menu dan attach variant groups yang sesuai
        foreach ($menus as $menu) {
            $attachGroups = [];

            // Untuk semua menu, tambahkan size dan temperature (required)
            if ($sizeGroup) {
                $attachGroups[] = $sizeGroup->id;
            }
            if ($temperatureGroup) {
                $attachGroups[] = $temperatureGroup->id;
            }

            // Untuk minuman yang menggunakan susu, tambahkan milk type
            if (in_array($menu->category->name, ['Coffee', 'Latte', 'Cappuccino', 'Tea Latte']) && $milkGroup) {
                $attachGroups[] = $milkGroup->id;
            }

            // Untuk minuman manis, tambahkan sweetness level
            if (in_array($menu->category->name, ['Coffee', 'Tea', 'Smoothie']) && $sweetnessGroup) {
                $attachGroups[] = $sweetnessGroup->id;
            }

            // Attach variant groups ke menu
            if (!empty($attachGroups)) {
                $menu->variantGroups()->attach($attachGroups);
            }
        }

        $this->command->info('Menu variant relationships seeded successfully!');
    }
}
