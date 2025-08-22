<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuVariant extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'menu_id',
        'name',
        'extra_price',
    ];

    protected $casts = [
        'extra_price' => 'decimal:2',
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    // Helper untuk menghitung harga total (harga menu + extra price)
    public function getTotalPriceAttribute()
    {
        return $this->menu->price + $this->extra_price;
    }
}
