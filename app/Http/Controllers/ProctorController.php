<?php
namespace App\Http\Controllers;

use App\Models\TestSession;
use App\Models\TestViolation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProctorController extends Controller
{
    private int $maxViolations;

    public function __construct()
    {
        $this->maxViolations = (int) env('PROCTOR_MAX_VIOLATIONS', 3);
    }

    public function saveSnapshot(Request $request)
    {
        $sessionId  = session('current_session_id');
        $session    = TestSession::find($sessionId);

        if (!$session || $session->status !== 'in_progress') {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $imageData = $request->input('image');
        if (!$imageData) return response()->json(['ok' => false]);

        // Decode base64 image
        $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $imageData);
        $image     = base64_decode($imageData);

        $path = "snapshots/{$sessionId}/" . time() . '.jpg';
        Storage::disk('local')->put($path, $image);

        return response()->json(['ok' => true, 'path' => $path]);
    }

    public function logViolation(Request $request)
    {
        $sessionId = session('current_session_id');
        $session   = TestSession::find($sessionId);

        if (!$session || $session->status !== 'in_progress') {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $type   = $request->input('type', 'TAB_SWITCH');
        $detail = $request->input('detail', '');

        TestViolation::create([
            'session_id'  => $session->id,
            'type'        => $type,
            'detail'      => $detail,
            'occurred_at' => now(),
        ]);

        $session->increment('violation_count');
        $session->refresh();

        $disqualified = false;
        if ($session->violation_count >= $this->maxViolations) {
            $session->update([
                'status'            => 'disqualified',
                'disqualify_reason' => "Melebihi batas pelanggaran ({$this->maxViolations}x): {$type}",
                'completed_at'      => now(),
            ]);
            $disqualified = true;
        }

        return response()->json([
            'ok'             => true,
            'violations'     => $session->violation_count,
            'max_violations' => $this->maxViolations,
            'disqualified'   => $disqualified,
        ]);
    }

    public function heartbeat(Request $request)
    {
        $sessionId = session('current_session_id');
        $session   = TestSession::find($sessionId);

        return response()->json([
            'status'     => $session?->status ?? 'unknown',
            'violations' => $session?->violation_count ?? 0,
        ]);
    }
}
