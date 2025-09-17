<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Mail\UserWelcomeEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendUserNotification implements ShouldQueue
{
    public function handle(UserRegistered $event): void
    {
        Mail::to($event->user->email)
            ->send(new UserWelcomeEmail($event->user));
    }
}