<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('user/index', [
            'users' => User::select('id', 'username', 'email', 'role', 'created_at')->get()
        ]);
    }
}