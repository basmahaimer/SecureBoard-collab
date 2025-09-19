<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        return response()->json($request->user()->notifications->sortByDesc('created_at'));
    }

    public function unread(Request $request)
    {
        return response()->json($request->user()->unreadNotifications->sortByDesc('created_at'));
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications->find($id);
        if ($notification) $notification->markAsRead();
        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->each->markAsRead();
        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues']);
    }
}
