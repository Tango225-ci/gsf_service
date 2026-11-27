<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Clients, proches, employés, appareils, biens du client et fichiers
     * (docs/SCHEMA-BDD.md § 1, § 2 et § 5 « Attachment »).
     */
    public function up(): void
    {
        Schema::create('client_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('country_of_residence')->nullable();
            $table->string('city')->nullable();
            $table->string('display_currency', 3)->default('EUR');
            $table->string('whatsapp')->nullable();
            $table->timestamps();
        });

        Schema::create('beneficiaries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_profile_id')->constrained()->cascadeOnDelete();
            $table->string('full_name');
            $table->string('phone')->nullable();
            $table->string('relation')->nullable();
            $table->string('city')->nullable();
            $table->timestamps();
        });

        Schema::create('employees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('job_title')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('employee_service_category', function (Blueprint $table) {
            $table->foreignUuid('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('service_category_id')->constrained()->cascadeOnDelete();
            $table->primary(['employee_id', 'service_category_id']);
        });

        Schema::create('employee_zone', function (Blueprint $table) {
            $table->foreignUuid('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('zone_id')->constrained()->cascadeOnDelete();
            $table->primary(['employee_id', 'zone_id']);
        });

        Schema::create('devices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('push_token')->unique();
            $table->string('platform', 20);
            $table->timestamps();
        });

        Schema::create('client_assets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('zone_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type');
            $table->string('label');
            $table->string('locality')->nullable();
            $table->string('lot_number')->nullable();
            $table->string('block_number')->nullable();
            $table->unsignedInteger('area_m2')->nullable();
            $table->decimal('gps_lat', 10, 7)->nullable();
            $table->decimal('gps_lng', 10, 7)->nullable();
            $table->string('title_type')->default('none');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->nullableUuidMorphs('owner');
            $table->foreignUuid('uploaded_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('kind');
            $table->string('storage_key');
            $table->string('mime_type');
            $table->unsignedBigInteger('size_bytes');
            $table->boolean('encrypted')->default(false);
            $table->timestamp('taken_at')->nullable();
            $table->decimal('gps_lat', 10, 7)->nullable();
            $table->decimal('gps_lng', 10, 7)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachments');
        Schema::dropIfExists('client_assets');
        Schema::dropIfExists('devices');
        Schema::dropIfExists('employee_zone');
        Schema::dropIfExists('employee_service_category');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('beneficiaries');
        Schema::dropIfExists('client_profiles');
    }
};
