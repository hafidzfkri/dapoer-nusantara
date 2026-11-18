<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'system' => [
                'app_name'       => config('app.name'),
                'app_env'        => config('app.env'),
                'app_debug'      => (bool) config('app.debug'),
                'php_version'    => PHP_VERSION,
                'laravel_version'=> app()->version(),
                'session_driver' => config('session.driver'),
                'tax_rate'       => '10%',
                'delivery_fee'   => 12000,
            ],
        ]);
    }
}
