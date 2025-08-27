<?php

namespace App\Console\Commands;

use App\Models\VariantGroup;
use App\Models\VariantOption;
use Illuminate\Console\Command;

class ShowVariants extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'variant:show';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Show all variant groups and their options';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== VARIANT GROUPS AND OPTIONS ===');
        $this->newLine();

        $groups = VariantGroup::with('variantOptions')->orderBy('sort_order')->get();

        foreach ($groups as $group) {
            $this->line("<fg=cyan>Group: {$group->name}</>");
            $this->line("  - Type: {$group->type}");
            $this->line("  - Required: " . ($group->is_required ? 'Yes' : 'No'));
            $this->line("  - Options:");
            
            foreach ($group->variantOptions as $option) {
                $price = $option->extra_price == 0 ? 'No extra cost' : 
                        ($option->extra_price > 0 ? '+Rp ' . number_format($option->extra_price, 0, ',', '.') : 
                         '-Rp ' . number_format(abs($option->extra_price), 0, ',', '.'));
                $this->line("    <fg=green>* {$option->name}</> ({$price})");
            }
            $this->newLine();
        }

        $this->info("Total: " . $groups->count() . " variant groups with " . VariantOption::count() . " total options");
        
        // Test relationships
        $this->newLine();
        $this->info('=== TESTING RELATIONSHIPS ===');
        $group = VariantGroup::first();
        $this->line("Group '{$group->name}' has {$group->variantOptions->count()} options");
        
        $option = VariantOption::first();
        $this->line("Option '{$option->name}' belongs to group '{$option->variantGroup->name}'");
        
        return 0;
    }
}
