<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserWelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user) {}

    public function build(): self
    {
        return $this->subject('Bienvenue sur SecureBoard!')
                    ->view('emails.user-welcome-text') // Utilisez text() au lieu de view()
                    ->with(['user' => $this->user]);
    }
}