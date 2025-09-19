<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ProjectCreatedNotification extends Notification
{
    use Queueable;

    protected $project;

    public function __construct($project)
    {
        $this->project = $project;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nouveau projet créé 🚀')
            ->greeting('Bonjour ' . $notifiable->name)
            ->line('Le projet "' . $this->project->title . '" a été lancé.')
            ->line('Statut : ' . $this->project->status)
            ->line('Merci d’utiliser SecureBoard !');
    }

    public function toArray($notifiable)
    {
        return [
            'project_id' => $this->project->id,
            'title'      => $this->project->title,
            'status'     => $this->project->status,
            'message'    => 'Un nouveau projet a été créé : ' . $this->project->title,
        ];
    }
}
