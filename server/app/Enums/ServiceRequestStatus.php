<?php

namespace App\Enums;

/**
 * Statuts communs d'une demande (docs/SCHEMA-BDD.md § 7).
 * « En attente du client » n'est pas un statut : c'est le drapeau on_hold.
 */
enum ServiceRequestStatus: string
{
    case Submitted = 'submitted';
    case Assigned = 'assigned';
    case Searching = 'searching';
    case ProposalsSent = 'proposals_sent';
    case ProposalAccepted = 'proposal_accepted';
    case DepositPaid = 'deposit_paid';
    case Paid = 'paid';
    case Preparing = 'preparing';
    case BalancePaid = 'balance_paid';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Closed = 'closed';
    case Cancelled = 'cancelled';
    case Refunded = 'refunded';
    case Disputed = 'disputed';

    public function label(): string
    {
        return match ($this) {
            self::Submitted => 'Soumise',
            self::Assigned => 'Prise en charge',
            self::Searching => 'Recherche',
            self::ProposalsSent => 'Propositions envoyées',
            self::ProposalAccepted => 'Proposition acceptée',
            self::DepositPaid => 'Acompte payé',
            self::Paid => 'Payée en totalité',
            self::Preparing => 'Préparation',
            self::BalancePaid => 'Solde payé',
            self::InProgress => 'En cours',
            self::Completed => 'Terminée',
            self::Closed => 'Clôturée',
            self::Cancelled => 'Annulée',
            self::Refunded => 'Remboursée',
            self::Disputed => 'Litige',
        };
    }
}
