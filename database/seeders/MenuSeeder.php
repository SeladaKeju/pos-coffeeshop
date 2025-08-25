<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get categories
        $coffeeCategory = Category::where('name', 'Coffee')->first();
        $nonCoffeeCategory = Category::where('name', 'Non-Coffee')->first();
        $pastryCategory = Category::where('name', 'Pastry')->first();
        $foodCategory = Category::where('name', 'Food')->first();
        $dessertCategory = Category::where('name', 'Dessert')->first();
        $coldDrinksCategory = Category::where('name', 'Cold Drinks')->first();
        $hotDrinksCategory = Category::where('name', 'Hot Drinks')->first();
        $snacksCategory = Category::where('name', 'Snacks')->first();

        // Coffee Menu Items
        if ($coffeeCategory) {
            $coffeeMenus = [
                ['name' => 'Espresso', 'sku' => 'CF-ESP-001', 'price' => 18000, 'station' => 'bar'],
                ['name' => 'Americano', 'sku' => 'CF-AME-002', 'price' => 22000, 'station' => 'bar'],
                ['name' => 'Cappuccino', 'sku' => 'CF-CAP-003', 'price' => 28000, 'station' => 'bar'],
                ['name' => 'Latte', 'sku' => 'CF-LAT-004', 'price' => 30000, 'station' => 'bar'],
                ['name' => 'Macchiato', 'sku' => 'CF-MAC-005', 'price' => 32000, 'station' => 'bar'],
                ['name' => 'Mocha', 'sku' => 'CF-MOC-006', 'price' => 35000, 'station' => 'bar'],
                ['name' => 'Caramel Latte', 'sku' => 'CF-CAL-007', 'price' => 38000, 'station' => 'bar'],
                ['name' => 'Vanilla Latte', 'sku' => 'CF-VL-008', 'price' => 38000, 'station' => 'bar'],
            ];

            foreach ($coffeeMenus as $menu) {
                Menu::create([
                    'category_id' => $coffeeCategory->id,
                    'name' => $menu['name'],
                    'sku' => $menu['sku'],
                    'price' => $menu['price'],
                    'is_active' => true,
                    'station' => $menu['station'],
                ]);
            }
        }

        // Non-Coffee Menu Items
        if ($nonCoffeeCategory) {
            $nonCoffeeMenus = [
                ['name' => 'Green Tea Latte', 'sku' => 'NC-GTL-001', 'price' => 25000, 'station' => 'barista'],
                ['name' => 'Chai Latte', 'sku' => 'NC-CHL-002', 'price' => 28000, 'station' => 'barista'],
                ['name' => 'Hot Chocolate', 'sku' => 'NC-HC-003', 'price' => 30000, 'station' => 'barista'],
                ['name' => 'Matcha Latte', 'sku' => 'NC-ML-004', 'price' => 35000, 'station' => 'barista'],
            ];

            foreach ($nonCoffeeMenus as $menu) {
                Menu::create([
                    'category_id' => $nonCoffeeCategory->id,
                    'name' => $menu['name'],
                    'sku' => $menu['sku'],
                    'price' => $menu['price'],
                    'is_active' => true,
                    'station' => $menu['station'],
                ]);
            }
        }

        // Cold Drinks
        if ($coldDrinksCategory) {
            $coldDrinks = [
                ['name' => 'Iced Coffee', 'sku' => 'CD-IC-001', 'price' => 25000, 'station' => 'barista'],
                ['name' => 'Iced Tea', 'sku' => 'CD-IT-002', 'price' => 18000, 'station' => 'barista'],
                ['name' => 'Lemon Squash', 'sku' => 'CD-LS-003', 'price' => 22000, 'station' => 'barista'],
                ['name' => 'Fresh Orange Juice', 'sku' => 'CD-FOJ-004', 'price' => 28000, 'station' => 'barista'],
                ['name' => 'Smoothie Berry', 'sku' => 'CD-SB-005', 'price' => 32000, 'station' => 'barista'],
            ];

            foreach ($coldDrinks as $menu) {
                Menu::create([
                    'category_id' => $coldDrinksCategory->id,
                    'name' => $menu['name'],
                    'sku' => $menu['sku'],
                    'price' => $menu['price'],
                    'is_active' => true,
                    'station' => $menu['station'],
                ]);
            }
        }

        // Pastry
        if ($pastryCategory) {
            $pastries = [
                ['name' => 'Croissant', 'sku' => 'PT-CR-001', 'price' => 15000, 'station' => 'kitchen'],
                ['name' => 'Danish Pastry', 'sku' => 'PT-DP-002', 'price' => 18000, 'station' => 'kitchen'],
                ['name' => 'Blueberry Muffin', 'sku' => 'PT-BM-003', 'price' => 20000, 'station' => 'kitchen'],
                ['name' => 'Chocolate Croissant', 'sku' => 'PT-CC-004', 'price' => 22000, 'station' => 'kitchen'],
            ];

            foreach ($pastries as $menu) {
                Menu::create([
                    'category_id' => $pastryCategory->id,
                    'name' => $menu['name'],
                    'sku' => $menu['sku'],
                    'price' => $menu['price'],
                    'is_active' => true,
                    'station' => $menu['station'],
                ]);
            }
        }

        // Food
        if ($foodCategory) {
            $foods = [
                ['name' => 'Sandwich Club', 'sku' => 'FD-SC-001', 'price' => 35000, 'station' => 'kitchen'],
                ['name' => 'Caesar Salad', 'sku' => 'FD-CS-002', 'price' => 32000, 'station' => 'kitchen'],
                ['name' => 'Pasta Carbonara', 'sku' => 'FD-PC-003', 'price' => 45000, 'station' => 'kitchen'],
                ['name' => 'Grilled Chicken', 'sku' => 'FD-GC-004', 'price' => 55000, 'station' => 'kitchen'],
            ];

            foreach ($foods as $menu) {
                Menu::create([
                    'category_id' => $foodCategory->id,
                    'name' => $menu['name'],
                    'sku' => $menu['sku'],
                    'price' => $menu['price'],
                    'is_active' => true,
                    'station' => $menu['station'],
                ]);
            }
        }

        // Dessert
        if ($dessertCategory) {
            $desserts = [
                ['name' => 'Cheesecake', 'sku' => 'DS-CC-001', 'price' => 28000, 'station' => 'kitchen'],
                ['name' => 'Tiramisu', 'sku' => 'DS-TR-002', 'price' => 32000, 'station' => 'kitchen'],
                ['name' => 'Chocolate Brownie', 'sku' => 'DS-CB-003', 'price' => 25000, 'station' => 'kitchen'],
                ['name' => 'Ice Cream Scoop', 'sku' => 'DS-ICS-004', 'price' => 15000, 'station' => 'kitchen'],
            ];

            foreach ($desserts as $menu) {
                Menu::create([
                    'category_id' => $dessertCategory->id,
                    'name' => $menu['name'],
                    'sku' => $menu['sku'],
                    'price' => $menu['price'],
                    'is_active' => true,
                    'station' => $menu['station'],
                ]);
            }
        }

        // Snacks
        if ($snacksCategory) {
            $snacks = [
                ['name' => 'French Fries', 'sku' => 'SN-FF-001', 'price' => 18000, 'station' => 'kitchen'],
                ['name' => 'Onion Rings', 'sku' => 'SN-OR-002', 'price' => 20000, 'station' => 'kitchen'],
                ['name' => 'Chicken Wings', 'sku' => 'SN-CW-003', 'price' => 25000, 'station' => 'kitchen'],
                ['name' => 'Nachos', 'sku' => 'SN-NC-004', 'price' => 22000, 'station' => 'kitchen'],
            ];

            foreach ($snacks as $menu) {
                Menu::create([
                    'category_id' => $snacksCategory->id,
                    'name' => $menu['name'],
                    'sku' => $menu['sku'],
                    'price' => $menu['price'],
                    'is_active' => true,
                    'station' => $menu['station'],
                ]);
            }
        }

        $this->command->info('Menu items seeded successfully!');
    }
}
