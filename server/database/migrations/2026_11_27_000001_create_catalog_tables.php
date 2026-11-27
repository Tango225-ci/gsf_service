<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Zones et catalogue des services (docs/SCHEMA-BDD.md § 1 et § 3).
     * Montants en FCFA entiers.
     */
    public function up(): void
    {
        Schema::create('zones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parent_id')->nullable();
            $table->string('name');
            $table->string('region')->nullable();
            $table->timestamps();
        });

        // Clé vers la zone parente, ajoutée une fois la clé primaire créée
        Schema::table('zones', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('zones')->nullOnDelete();
        });

        Schema::create('service_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_category_id')->constrained()->restrictOnDelete();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('included')->nullable();
            $table->string('pricing_mode');
            $table->string('unit')->nullable();
            $table->unsignedBigInteger('display_price')->nullable();
            $table->unsignedTinyInteger('deposit_percent')->nullable();
            $table->unsignedBigInteger('fixed_service_fee')->nullable();
            $table->boolean('requires_asset')->default(false);
            $table->boolean('requires_mandate')->default(false);
            $table->boolean('published')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('service_fields', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_id')->constrained()->cascadeOnDelete();
            $table->string('key');
            $table->string('label');
            $table->string('help_text')->nullable();
            $table->string('type');
            $table->boolean('required')->default(false);
            $table->json('options')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->unique(['service_id', 'key']);
        });

        Schema::create('service_steps', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->unsignedSmallInteger('target_days')->nullable();
            $table->boolean('visible_to_client')->default(true);
            $table->timestamps();
        });

        Schema::create('price_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('zone_id')->nullable()->constrained()->nullOnDelete();
            $table->string('label');
            $table->string('capacity')->nullable();
            $table->unsignedBigInteger('client_price');
            $table->unsignedBigInteger('internal_cost')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('service_options', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->string('kind');
            $table->unsignedBigInteger('amount')->nullable();
            $table->timestamps();
        });

        Schema::create('official_fees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->unsignedBigInteger('amount');
            $table->timestamps();
        });

        Schema::create('season_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('service_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date');
            $table->smallInteger('adjustment_percent');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('season_rules');
        Schema::dropIfExists('official_fees');
        Schema::dropIfExists('service_options');
        Schema::dropIfExists('price_rules');
        Schema::dropIfExists('service_steps');
        Schema::dropIfExists('service_fields');
        Schema::dropIfExists('services');
        Schema::dropIfExists('service_categories');
        Schema::dropIfExists('zones');
    }
};
