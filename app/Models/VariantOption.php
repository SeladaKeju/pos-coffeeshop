<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariantOption extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'variant_group_id',
        'name',
        'extra_price',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'extra_price' => 'decimal:2',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function variantGroup(): BelongsTo
    {
        return $this->belongsTo(VariantGroup::class);
    }

    // Scope untuk option yang aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope untuk urutkan berdasarkan sort_order
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // Helper untuk format harga
    public function getFormattedExtraPriceAttribute()
    {
        if ($this->extra_price == 0) {
            return 'No extra cost';
        } elseif ($this->extra_price > 0) {
            return '+' . number_format($this->extra_price, 0, ',', '.');
        } else {
            return '-' . number_format(abs($this->extra_price), 0, ',', '.');
        }
    }
}
