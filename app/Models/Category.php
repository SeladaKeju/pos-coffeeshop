<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'sort',
    ];

    protected $casts = [
        'sort' => 'integer',
    ];

    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class);
    }
}
