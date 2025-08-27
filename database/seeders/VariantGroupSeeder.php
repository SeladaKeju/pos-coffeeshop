<?php

namespace Database\Seeders;

use App\Models\VariantGroup;
use App\Models\VariantOption;
use Illuminate\Database\Seeder;

class VariantGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Size Variant Group
        $sizeGroup = VariantGroup::create([
            'name' => 'Size',
            'type' => 'single',
            'is_required' => true,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $sizeOptions = [
            ['name' => 'Small', 'extra_price' => -5000, 'sort_order' => 1],
            ['name' => 'Regular', 'extra_price' => 0, 'sort_order' => 2],
            ['name' => 'Large', 'extra_price' => 8000, 'sort_order' => 3],
            ['name' => 'Extra Large', 'extra_price' => 15000, 'sort_order' => 4],
        ];

        foreach ($sizeOptions as $option) {
            VariantOption::create([
                'variant_group_id' => $sizeGroup->id,
                'name' => $option['name'],
                'extra_price' => $option['extra_price'],
                'sort_order' => $option['sort_order'],
                'is_active' => true,
            ]);
        }

        // Temperature Variant Group
        $temperatureGroup = VariantGroup::create([
            'name' => 'Temperature',
            'type' => 'single',
            'is_required' => true,
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $temperatureOptions = [
            ['name' => 'Hot', 'extra_price' => 0, 'sort_order' => 1],
            ['name' => 'Iced', 'extra_price' => 3000, 'sort_order' => 2],
            ['name' => 'Blended', 'extra_price' => 5000, 'sort_order' => 3],
        ];

        foreach ($temperatureOptions as $option) {
            VariantOption::create([
                'variant_group_id' => $temperatureGroup->id,
                'name' => $option['name'],
                'extra_price' => $option['extra_price'],
                'sort_order' => $option['sort_order'],
                'is_active' => true,
            ]);
        }

        // Milk Type Variant Group
        $milkGroup = VariantGroup::create([
            'name' => 'Milk Type',
            'type' => 'single',
            'is_required' => false,
            'sort_order' => 3,
            'is_active' => true,
        ]);

        $milkOptions = [
            ['name' => 'Regular Milk', 'extra_price' => 0, 'sort_order' => 1],
            ['name' => 'Oat Milk', 'extra_price' => 8000, 'sort_order' => 2],
            ['name' => 'Almond Milk', 'extra_price' => 8000, 'sort_order' => 3],
            ['name' => 'Soy Milk', 'extra_price' => 5000, 'sort_order' => 4],
            ['name' => 'Coconut Milk', 'extra_price' => 6000, 'sort_order' => 5],
        ];

        foreach ($milkOptions as $option) {
            VariantOption::create([
                'variant_group_id' => $milkGroup->id,
                'name' => $option['name'],
                'extra_price' => $option['extra_price'],
                'sort_order' => $option['sort_order'],
                'is_active' => true,
            ]);
        }

        // Sweetness Level Variant Group
        $sweetnessGroup = VariantGroup::create([
            'name' => 'Sweetness Level',
            'type' => 'single',
            'is_required' => false,
            'sort_order' => 4,
            'is_active' => true,
        ]);

        $sweetnessOptions = [
            ['name' => 'No Sugar', 'extra_price' => 0, 'sort_order' => 1],
            ['name' => 'Less Sweet', 'extra_price' => 0, 'sort_order' => 2],
            ['name' => 'Normal Sweet', 'extra_price' => 0, 'sort_order' => 3],
            ['name' => 'Extra Sweet', 'extra_price' => 2000, 'sort_order' => 4],
        ];

        foreach ($sweetnessOptions as $option) {
            VariantOption::create([
                'variant_group_id' => $sweetnessGroup->id,
                'name' => $option['name'],
                'extra_price' => $option['extra_price'],
                'sort_order' => $option['sort_order'],
                'is_active' => true,
            ]);
        }

        $this->command->info('Variant groups and options seeded successfully!');
    }
}
