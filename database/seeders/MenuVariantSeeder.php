<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\MenuVariant;
use Illuminate\Database\Seeder;

class MenuVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, let's get some menus to create variants for
        $menus = Menu::all();

        if ($menus->isEmpty()) {
            $this->command->info('No menus found. Please run MenuSeeder first.');
            return;
        }

        // Define common variants for different types of menus
        $sizeVariants = [
            ['name' => 'Small', 'extra_price' => -5000],
            ['name' => 'Regular', 'extra_price' => 0],
            ['name' => 'Large', 'extra_price' => 8000],
            ['name' => 'Extra Large', 'extra_price' => 15000],
        ];

        $temperatureVariants = [
            ['name' => 'Hot', 'extra_price' => 0],
            ['name' => 'Iced', 'extra_price' => 3000],
            ['name' => 'Blended', 'extra_price' => 5000],
        ];

        $sweetLevelVariants = [
            ['name' => 'No Sugar', 'extra_price' => 0],
            ['name' => 'Less Sweet', 'extra_price' => 0],
            ['name' => 'Normal Sweet', 'extra_price' => 0],
            ['name' => 'Extra Sweet', 'extra_price' => 2000],
        ];

        $milkVariants = [
            ['name' => 'Regular Milk', 'extra_price' => 0],
            ['name' => 'Oat Milk', 'extra_price' => 8000],
            ['name' => 'Almond Milk', 'extra_price' => 8000],
            ['name' => 'Soy Milk', 'extra_price' => 5000],
            ['name' => 'Coconut Milk', 'extra_price' => 6000],
        ];

        foreach ($menus as $menu) {
            $menuName = strtolower($menu->name);
            
            // For coffee drinks, add size, temperature, and milk variants
            if (str_contains($menuName, 'coffee') || str_contains($menuName, 'latte') || 
                str_contains($menuName, 'cappuccino') || str_contains($menuName, 'americano') ||
                str_contains($menuName, 'espresso') || str_contains($menuName, 'macchiato')) {
                
                // Add size variants
                foreach ($sizeVariants as $variant) {
                    MenuVariant::create([
                        'menu_id' => $menu->id,
                        'name' => $variant['name'],
                        'extra_price' => $variant['extra_price'],
                    ]);
                }

                // Add temperature variants
                foreach ($temperatureVariants as $variant) {
                    MenuVariant::create([
                        'menu_id' => $menu->id,
                        'name' => $variant['name'],
                        'extra_price' => $variant['extra_price'],
                    ]);
                }

                // Add milk variants
                foreach ($milkVariants as $variant) {
                    MenuVariant::create([
                        'menu_id' => $menu->id,
                        'name' => $variant['name'],
                        'extra_price' => $variant['extra_price'],
                    ]);
                }
            }
            // For tea and other drinks, add size and temperature variants
            elseif (str_contains($menuName, 'tea') || str_contains($menuName, 'juice') || 
                    str_contains($menuName, 'smoothie') || str_contains($menuName, 'chocolate')) {
                
                // Add size variants
                foreach ($sizeVariants as $variant) {
                    MenuVariant::create([
                        'menu_id' => $menu->id,
                        'name' => $variant['name'],
                        'extra_price' => $variant['extra_price'],
                    ]);
                }

                // Add temperature variants (for tea and chocolate)
                if (str_contains($menuName, 'tea') || str_contains($menuName, 'chocolate')) {
                    foreach ($temperatureVariants as $variant) {
                        MenuVariant::create([
                            'menu_id' => $menu->id,
                            'name' => $variant['name'],
                            'extra_price' => $variant['extra_price'],
                        ]);
                    }
                }

                // Add sweet level variants
                foreach ($sweetLevelVariants as $variant) {
                    MenuVariant::create([
                        'menu_id' => $menu->id,
                        'name' => $variant['name'],
                        'extra_price' => $variant['extra_price'],
                    ]);
                }
            }
            // For food items, add portion variants
            else {
                $portionVariants = [
                    ['name' => 'Regular Portion', 'extra_price' => 0],
                    ['name' => 'Large Portion', 'extra_price' => 10000],
                    ['name' => 'Extra Large', 'extra_price' => 18000],
                ];

                foreach ($portionVariants as $variant) {
                    MenuVariant::create([
                        'menu_id' => $menu->id,
                        'name' => $variant['name'],
                        'extra_price' => $variant['extra_price'],
                    ]);
                }
            }
        }

        $this->command->info('Menu variants seeded successfully!');
    }
}
