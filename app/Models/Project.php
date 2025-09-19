<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'user_id',
        'assigned_user_id'
    ];

    protected $casts = [
        'status' => 'string'
    ];

    const STATUSES = [
        'pending' => 'En attente',
        'in_progress' => 'En cours',
        'completed' => 'Terminé'
    ];

    protected $with = ['user', 'assignedUser'];
    
    protected $appends = ['assigned_user_name', 'creator_name', 'assigned_user_data'];

    /**
     * Relation avec l'utilisateur (créateur du projet)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec l'utilisateur assigné
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id')->withDefault([
            'name' => 'Non assigné',
            'email' => null
        ]);
    }

    /**
     * Accesseur pour le nom de l'utilisateur assigné
     */
    public function getAssignedUserNameAttribute()
    {
        return $this->assignedUser->name;
    }

    /**
     * Accesseur pour le nom du créateur
     */
    public function getCreatorNameAttribute()
    {
        return $this->user->name;
    }

    /**
     * Accesseur pour les données de l'utilisateur assigné
     */
    public function getAssignedUserDataAttribute()
    {
        return [
            'id' => $this->assignedUser->id ?? null,
            'name' => $this->assignedUser->name ?? 'Non assigné',
            'email' => $this->assignedUser->email ?? null
        ];
    }

    /**
     * Vérifie si l'utilisateur peut modifier le projet
     */
    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    /**
     * Vérifie si l'utilisateur est assigné au projet
     */
    public function isAssignedTo(User $user): bool
    {
        return $this->assigned_user_id === $user->id;
    }
}