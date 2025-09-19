<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class UserCreatedNotification extends Notification
{
    use Queueable;

    protected $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Bienvenue sur SecureBoard 🎉')
            ->greeting('Bonjour ' . $this->user->name)
            ->line('Votre compte a été créé avec succès.')
            ->line('Email : ' . $this->user->email)
            ->line('Merci d’utiliser SecureBoard !');
    }

    public function toArray($notifiable)
    {
        return [
            'user_id' => $this->user->id,
            'name'    => $this->user->name,
            'email'   => $this->user->email,
            'message' => 'Un nouvel utilisateur a été créé : ' . $this->user->name,
        ];
    }
}
