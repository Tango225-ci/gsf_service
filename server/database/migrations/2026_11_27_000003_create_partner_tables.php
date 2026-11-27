<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Partenaires : propriétaires de résidences et loueurs de véhicules uniquement
     * (docs/SCHEMA-BDD.md § 4). Les prix partenaires ne sont jamais envoyés à l'app client.
     */
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('payout_details')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('partner_properties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('partner_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('zone_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('address')->nullable();
            $table->unsignedTinyInteger('bedrooms')->nullable();
            $table->unsignedTinyInteger('capacity')->nullable();
            $table->json('amenities')->nullable();
            $table->unsignedBigInteger('partner_price_per_night');
            $table->unsignedBigInteger('client_price_per_night');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('partner_vehicles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('partner_id')->constrained()->cascadeOnDelete();
            $table->string('model');
            $table->string('category')->nullable();
            $table->string('plate')->nullable();
            $table->unsignedTinyInteger('seats')->nullable();
            $table->boolean('driver_available')->default(false);
            $table->unsignedBigInteger('partner_price_per_day');
            $table->unsignedBigInteger('client_price_per_day');
            $table->unsignedBigInteger('driver_price_per_day')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_vehicles');
        Schema::dropIfExists('partner_properties');
        Schema::dropIfExists('partners');
    }
};
