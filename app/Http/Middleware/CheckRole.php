<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): mixed
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        if (Auth::user()->role !== $role && Auth::user()->role !== 'admin') {
            abort(403, 'Akses tidak diizinkan.');
        }

        return $next($request);
    }
}
