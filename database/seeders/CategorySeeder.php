<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Coffee',
                'sort' => 1,
            ],
            [
                'name' => 'Non-Coffee',
                'sort' => 2,
            ],
            [
                'name' => 'Pastry',
                'sort' => 3,
            ],
            [
                'name' => 'Food',
                'sort' => 4,
            ],
            [
                'name' => 'Dessert',
                'sort' => 5,
            ],
            [
                'name' => 'Cold Drinks',
                'sort' => 6,
            ],
            [
                'name' => 'Hot Drinks',
                'sort' => 7,
            ],
            [
                'name' => 'Snacks',
                'sort' => 8,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
