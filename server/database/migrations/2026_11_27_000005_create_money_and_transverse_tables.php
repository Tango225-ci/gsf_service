<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Argent et tables transverses (docs/SCHEMA-BDD.md § 4 « Payout », § 6 et § 8).
     * La table payments est créée, mais l'encaissement (lot 5) est mis de côté.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_request_id')->constrained()->restrictOnDelete();
            $table->foreignUuid('collected_by_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignUuid('receipt_id')->nullable()->constrained('attachments')->nullOnDelete();
            $table->string('type');
            $table->unsignedBigInteger('amount');
            $table->unsignedBigInteger('fee_included')->default(0);
            $table->string('method');
            $table->string('channel');
            $table->string('provider')->nullable();
            $table->string('provider_ref')->nullable();
            $table->string('status')->default('pending');
            $table->decimal('exchange_rate_eur', 12, 4)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        Schema::create('payouts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('partner_id')->constrained()->restrictOnDelete();
            $table->unsignedBigInteger('amount');
            $table->date('period_start');
            $table->date('period_end');
            $table->string('status')->default('pending');
            $table->string('reference')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        Schema::create('payout_service_request_item', function (Blueprint $table) {
            $table->foreignUuid('payout_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('service_request_item_id')->constrained()->restrictOnDelete();
            $table->primary(['payout_id', 'service_request_item_id']);
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_request_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignUuid('client_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('agent_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        // Notifications dans l'app : table standard de Laravel (canal « database »).
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->uuidMorphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action');
            $table->nullableUuidMorphs('auditable');
            $table->json('before')->nullable();
            $table->json('after')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->json('value');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('payout_service_request_item');
        Schema::dropIfExists('payouts');
        Schema::dropIfExists('payments');
    }
};
