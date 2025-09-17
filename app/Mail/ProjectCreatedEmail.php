<?php

namespace App\Mail;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProjectCreatedEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Project $project) {}

    public function build(): self
    {
        return $this->subject('Votre projet a été créé!')
                    ->text('emails.project-created-text') // Utilisez text() au lieu de view()
                    ->with(['project' => $this->project]);
    }
}