<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController; // ⭐ AJOUTEZ CET IMPORT

// Auth
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);
Route::get('/verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->middleware(['signed','throttle:6,1'])
    ->name('verification.verify');

// Routes protégées
Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Profil utilisateur connecté
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'updateProfile']);

    // ⭐ ROUTES PROJETS - ENLEVEZ LE SOUS-GROUP MIDDLEWARE
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

    // CRUD Admin uniquement
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

    // Statistiques (admin/managers)
    Route::get('/stats/projects', function () {
        return response()->json([
            'total' => \App\Models\Project::count(),
            'pending' => \App\Models\Project::where('status', 'pending')->count(),
            'in_progress' => \App\Models\Project::where('status', 'in_progress')->count(),
            'completed' => \App\Models\Project::where('status', 'completed')->count(),
        ]);
    })->middleware('role:admin,manager');
});