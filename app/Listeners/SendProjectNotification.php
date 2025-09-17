<?php

namespace App\Listeners;

use App\Events\ProjectCreated;
use App\Mail\ProjectCreatedEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendProjectNotification implements ShouldQueue
{
    public function handle(ProjectCreated $event): void
    {
        Mail::to($event->project->user->email)
            ->send(new ProjectCreatedEmail($event->project));
    }
}