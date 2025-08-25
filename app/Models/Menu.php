<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'sku',
        'price',
        'is_active',
        'station',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(MenuVariant::class);
    }

    public function variantGroups(): BelongsToMany
    {
        return $this->belongsToMany(VariantGroup::class, 'menu_variant_groups');
    }

    public function activeVariantGroups(): BelongsToMany
    {
        return $this->belongsToMany(VariantGroup::class, 'menu_variant_groups')
                    ->where('variant_groups.is_active', true)
                    ->orderBy('variant_groups.sort_order');
    }

    // Scope untuk filter by station
    public function scopeByStation($query, $station)
    {
        return $query->where('station', $station);
    }

    // Scope untuk menu aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
