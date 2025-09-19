<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ProjectAssignedNotification extends Notification
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
            ->subject('🎯 Nouveau projet assigné - ' . $this->project->title)
            ->greeting('Bonjour ' . $notifiable->name . '!')
            ->line('Un nouveau projet vous a été assigné :')
            ->line('**Projet :** ' . $this->project->title)
            ->line('**Description :** ' . $this->project->description)
            ->line('**Statut :** ' . $this->project->status)
            ->action('Voir le projet', url('/projects'))
            ->line('Merci d\'utiliser SecureBoard !');
    }

    public function toArray($notifiable)
    {
        return [
            'project_id' => $this->project->id,
            'title' => $this->project->title,
            'message' => 'Un nouveau projet vous a été assigné : ' . $this->project->title,
            'type' => 'project_assigned'
        ];
    }
}