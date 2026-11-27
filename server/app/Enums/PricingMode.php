<?php

namespace App\Enums;

/**
 * Les quatre modes de tarification d'un service (docs/CADRAGE.md § 5).
 */
enum PricingMode: string
{
    case Fixed = 'fixed';
    case PerUnit = 'per_unit';
    case From = 'from';
    case Quote = 'quote';

    public function label(): string
    {
        return match ($this) {
            self::Fixed => 'Prix fixe',
            self::PerUnit => "Prix à l'unité",
            self::From => 'À partir de',
            self::Quote => 'Sur devis',
        };
    }

    /**
     * « À partir de » et « Sur devis » passent par une proposition de l'agent.
     * Le prix fixe et le prix à l'unité sont connus dès le formulaire (docs/CADRAGE.md § 5).
     */
    public function needsProposal(): bool
    {
        return in_array($this, [self::From, self::Quote], true);
    }

    /**
     * Seul le prix fixe est payé en totalité à la commande. Les autres modes, y compris le prix
     * à l'unité (décision du 27/11/2026), passent par un acompte puis le solde.
     */
    public function isPaidInFullAtOrder(): bool
    {
        return $this === self::Fixed;
    }
}
