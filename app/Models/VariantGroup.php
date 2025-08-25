<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantGroup extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'is_required',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function variantOptions(): HasMany
    {
        return $this->hasMany(VariantOption::class)->orderBy('sort_order');
    }

    public function activeVariantOptions(): HasMany
    {
        return $this->hasMany(VariantOption::class)->where('is_active', true)->orderBy('sort_order');
    }

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'menu_variant_groups');
    }

    // Scope untuk variant group yang aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope untuk urutkan berdasarkan sort_order
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
