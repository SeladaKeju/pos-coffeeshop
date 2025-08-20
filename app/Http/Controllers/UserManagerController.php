<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;

use Illuminate\Http\Request;

class UserManagerController extends Controller
{
    public function edit($id)
    {
        $user = User::with('roles')->findOrFail($id);

        return Inertia::render('admin/users/form.user-manager', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }
}
