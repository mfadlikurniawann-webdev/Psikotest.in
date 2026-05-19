<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\HRController;
use App\Http\Controllers\ProctorController;

// Public routes
Route::get('/', fn() => redirect()->route('login'));

// Auth routes
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login',   [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register',[AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Candidate routes
Route::middleware(['auth', 'role:candidate'])->prefix('candidate')->name('candidate.')->group(function () {
    Route::get('/dashboard',        [CandidateController::class, 'dashboard'])->name('dashboard');
    Route::get('/test/{type}',      [TestController::class, 'start'])->name('test.start');
    Route::get('/test/{type}/exam', [TestController::class, 'exam'])->name('test.exam');
    Route::post('/test/{type}/submit', [TestController::class, 'submit'])->name('test.submit');
    Route::get('/result/{session}', [TestController::class, 'result'])->name('test.result');
});

// HR routes
Route::middleware(['auth', 'role:hr'])->prefix('hr')->name('hr.')->group(function () {
    Route::get('/dashboard',             [HRController::class, 'dashboard'])->name('dashboard');
    Route::get('/candidates',            [HRController::class, 'candidates'])->name('candidates');
    Route::get('/candidate/{id}',        [HRController::class, 'candidateDetail'])->name('candidate.detail');
    Route::get('/result/{session}/pdf',  [HRController::class, 'exportPdf'])->name('result.pdf');
    Route::post('/invite',               [HRController::class, 'invite'])->name('invite');
    Route::delete('/candidate/{id}',     [HRController::class, 'deleteCandidate'])->name('candidate.delete');
});

// Proctor API (AJAX endpoints for anti-cheat)
Route::middleware('auth')->prefix('proctor')->name('proctor.')->group(function () {
    Route::post('/snapshot',   [ProctorController::class, 'saveSnapshot'])->name('snapshot');
    Route::post('/violation',  [ProctorController::class, 'logViolation'])->name('violation');
    Route::post('/heartbeat',  [ProctorController::class, 'heartbeat'])->name('heartbeat');
});
