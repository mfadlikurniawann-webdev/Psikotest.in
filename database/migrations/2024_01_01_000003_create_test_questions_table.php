<?php
// database/migrations/2024_01_01_000003_create_test_questions_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('test_questions', function (Blueprint $table) {
            $table->id();
            $table->string('test_type'); // tpa, bigfive, disc
            $table->string('category');  // numerik, verbal, openness, dll
            $table->text('question');
            $table->json('options');
            $table->integer('correct_answer')->default(-1); // -1 = tidak ada jawaban benar (psikotest)
            $table->integer('order')->default(0);
            $table->integer('time_limit')->default(0); // detik, 0 = unlimited
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('test_questions'); }
};
