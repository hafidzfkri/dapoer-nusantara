<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['menu_id']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('menu_id')->references('id')->on('menus')->restrictOnDelete();
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->string('booking_code', 20)->nullable()->unique()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropUnique(['booking_code']);
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn('booking_code');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['menu_id']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('menu_id')->references('id')->on('menus')->cascadeOnDelete();
        });
    }
};
