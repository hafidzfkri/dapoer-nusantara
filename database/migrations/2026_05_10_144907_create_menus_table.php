<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->integer('price');
            $table->string('image')->nullable();
            $table->string('subcategory')->nullable();
            $table->integer('cook_time')->default(20);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('menus');
    }
};
