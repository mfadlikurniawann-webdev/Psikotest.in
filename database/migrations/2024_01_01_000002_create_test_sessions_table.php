<?php
// database/migrations/2024_01_01_000002_create_test_sessions_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('test_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('test_type'); // tpa, mbti, disc, bigfive, pauli
            $table->enum('status', ['pending', 'in_progress', 'completed', 'failed', 'disqualified'])->default('pending');
            $table->integer('score')->nullable();
            $table->json('answers')->nullable();
            $table->json('result_detail')->nullable(); // Dimensi hasil tes
            $table->string('personality_type')->nullable(); // INTJ, DISC-D, dll
            $table->integer('total_questions')->default(0);
            $table->integer('correct_answers')->default(0);
            $table->integer('duration_seconds')->nullable(); // Waktu pengerjaan
            $table->integer('violation_count')->default(0);
            $table->string('disqualify_reason')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('test_violations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('test_sessions')->onDelete('cascade');
            $table->enum('type', ['TAB_SWITCH', 'FULLSCREEN_EXIT', 'WINDOW_BLUR', 'FORBIDDEN_KEY', 'COPY_PASTE', 'MULTIPLE_FACES', 'NO_FACE', 'FACE_AWAY'])->default('TAB_SWITCH');
            $table->string('detail')->nullable();
            $table->string('snapshot_path')->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('test_violations');
        Schema::dropIfExists('test_sessions');
    }
};
