<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\VerifyEmailController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes API pour l'auth et l'accès sécurisé.
| Breeze gère inscription, login, logout, reset password, verify email.
|
*/

// Routes publiques
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);
Route::get('/verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

// Routes nécessitant auth
Route::middleware(['auth:sanctum'])->group(function () {

    // Déconnexion
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // Notification email
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Récupérer user connecté avec roles et permissions
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('roles.permissions'); // charge roles + permissions
        return response()->json($user);
    });

    // Liste de tous les utilisateurs (admin only)
    Route::get('/users', function () {
        return \App\Models\User::with('roles.permissions')->get();
    })->middleware('role:admin'); // accessible uniquement aux admins
});
