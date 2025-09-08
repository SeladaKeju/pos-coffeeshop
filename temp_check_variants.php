<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\VariantGroup;
use App\Models\VariantOption;

echo "=== VARIANT GROUPS AND OPTIONS ===\n\n";

$groups = VariantGroup::with('variantOptions')->orderBy('sort_order')->get();

foreach ($groups as $group) {
    echo "Group: {$group->name}\n";
    echo "  - Type: {$group->type}\n";
    echo "  - Required: " . ($group->is_required ? 'Yes' : 'No') . "\n";
    echo "  - Options:\n";
    
    foreach ($group->variantOptions as $option) {
        $price = $option->extra_price == 0 ? 'No extra cost' : 
                ($option->extra_price > 0 ? '+Rp ' . number_format($option->extra_price, 0, ',', '.') : 
                 '-Rp ' . number_format(abs($option->extra_price), 0, ',', '.'));
        echo "    * {$option->name} ({$price})\n";
    }
    echo "\n";
}

echo "Total: " . $groups->count() . " variant groups with " . VariantOption::count() . " total options\n";
