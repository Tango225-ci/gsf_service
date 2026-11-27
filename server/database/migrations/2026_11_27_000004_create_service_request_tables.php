<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Demandes et leur traitement (docs/SCHEMA-BDD.md § 5).
     * « Request » est nommée service_requests, pour ne pas se confondre avec la requête HTTP de Laravel.
     */
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('number')->unique();
            $table->foreignUuid('client_profile_id')->constrained()->restrictOnDelete();
            $table->foreignUuid('beneficiary_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('assigned_agent_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('title');
            $table->string('status')->default('submitted')->index();
            $table->boolean('on_hold')->default(false);
            $table->string('hold_reason')->nullable();
            $table->timestamp('due_at')->nullable();
            $table->unsignedBigInteger('subtotal')->default(0);
            $table->unsignedBigInteger('fee_amount')->default(0);
            $table->unsignedBigInteger('total')->default(0);
            $table->unsignedBigInteger('deposit_amount')->default(0);
            $table->unsignedBigInteger('balance_amount')->default(0);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_request_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('agent_id')->constrained('employees')->restrictOnDelete();
            $table->foreignUuid('assigned_by_id')->constrained('employees')->restrictOnDelete();
            $table->text('note')->nullable();
            $table->timestamp('assigned_at');
            $table->timestamp('ended_at')->nullable();
            $table->string('end_reason')->nullable();
            $table->timestamps();
        });

        Schema::create('service_request_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_request_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('service_id')->constrained()->restrictOnDelete();
            $table->foreignUuid('client_asset_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('price_rule_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('current_step_id')->nullable()->constrained('service_steps')->nullOnDelete();
            $table->json('answers')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedBigInteger('amount')->default(0);
            $table->unsignedBigInteger('official_fees')->default(0);
            $table->timestamps();
        });

        Schema::create('service_option_service_request_item', function (Blueprint $table) {
            $table->foreignUuid('service_request_item_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('service_option_id')->constrained()->cascadeOnDelete();
            $table->primary(['service_request_item_id', 'service_option_id']);
        });

        Schema::create('proposals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_request_item_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('created_by_id')->constrained('employees')->restrictOnDelete();
            $table->foreignUuid('partner_property_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('partner_vehicle_id')->nullable()->constrained()->nullOnDelete();
            $table->string('label');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('unit_price')->default(0);
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedBigInteger('total')->default(0);
            $table->unsignedBigInteger('partner_cost')->nullable();
            $table->unsignedBigInteger('service_fee')->default(0);
            $table->unsignedTinyInteger('deposit_percent')->default(30);
            $table->timestamp('valid_until')->nullable();
            $table->string('status')->default('sent');
            $table->timestamps();
        });

        Schema::table('service_request_items', function (Blueprint $table) {
            $table->foreignUuid('accepted_proposal_id')->nullable()->after('current_step_id')->constrained('proposals')->nullOnDelete();
        });

        Schema::create('proposal_lines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('proposal_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->string('kind');
            $table->unsignedBigInteger('amount');
            $table->timestamps();
        });

        Schema::create('timeline_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_request_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('service_request_item_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignUuid('service_step_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type');
            $table->text('comment')->nullable();
            $table->boolean('visible_to_client')->default(true);
            $table->timestamp('occurred_at');
            $table->timestamps();
        });

        Schema::create('inspections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_request_item_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('agent_id')->constrained('employees')->restrictOnDelete();
            $table->foreignUuid('client_signature_id')->nullable()->constrained('attachments')->nullOnDelete();
            $table->foreignUuid('report_pdf_id')->nullable()->constrained('attachments')->nullOnDelete();
            $table->string('type');
            $table->decimal('gps_lat', 10, 7)->nullable();
            $table->decimal('gps_lng', 10, 7)->nullable();
            $table->unsignedSmallInteger('gps_accuracy_m')->nullable();
            $table->json('checklist')->nullable();
            $table->json('answers')->nullable();
            $table->unsignedInteger('mileage_km')->nullable();
            $table->unsignedTinyInteger('fuel_level')->nullable();
            $table->text('observations')->nullable();
            $table->timestamps();
        });

        Schema::create('mandates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_request_item_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('client_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('signature_id')->nullable()->constrained('attachments')->nullOnDelete();
            $table->foreignUuid('document_id')->nullable()->constrained('attachments')->nullOnDelete();
            $table->timestamp('signed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_request_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('sender_id')->constrained('users')->restrictOnDelete();
            $table->text('text')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('internal_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_request_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('author_id')->constrained('users')->restrictOnDelete();
            $table->text('text');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internal_notes');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('mandates');
        Schema::dropIfExists('inspections');
        Schema::dropIfExists('timeline_events');
        Schema::dropIfExists('proposal_lines');
        Schema::table('service_request_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('accepted_proposal_id');
        });
        Schema::dropIfExists('proposals');
        Schema::dropIfExists('service_option_service_request_item');
        Schema::dropIfExists('service_request_items');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('service_requests');
    }
};
