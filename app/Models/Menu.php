<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
