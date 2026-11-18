<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $activity = (string) $request->query('activity', '');

        $query = ActivityLog::with('user:id,name,email')->latest('id');

        if ($activity !== '') {
            $query->where('activity', 'like', "%{$activity}%");
        }

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs'    => $query->limit(100)->get(),
            'filters' => ['activity' => $activity],
        ]);
    }
}
