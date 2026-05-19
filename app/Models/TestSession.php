<?php
// app/Models/TestSession.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestSession extends Model
{
    protected $fillable = ['user_id','test_type','status','score','answers','result_detail','personality_type','total_questions','correct_answers','duration_seconds','violation_count','disqualify_reason','started_at','completed_at'];
    protected $casts    = ['started_at'=>'datetime','completed_at'=>'datetime','answers'=>'array','result_detail'=>'array'];

    public function user()       { return $this->belongsTo(User::class); }
    public function violations() { return $this->hasMany(TestViolation::class, 'session_id'); }

    public function getStatusLabelAttribute(): string {
        return match($this->status) {
            'pending'      => 'Menunggu',
            'in_progress'  => 'Sedang Berlangsung',
            'completed'    => 'Selesai',
            'failed'       => 'Gagal',
            'disqualified' => 'Didiskualifikasi',
            default        => $this->status,
        };
    }

    public function getTestNameAttribute(): string {
        return match($this->test_type) {
            'tpa'     => 'Tes Potensi Akademik',
            'bigfive' => 'Big Five Personality',
            'disc'    => 'DISC Assessment',
            default   => $this->test_type,
        };
    }

    public function getDurationFormattedAttribute(): string {
        $s = $this->duration_seconds ?? 0;
        return sprintf('%02d:%02d', floor($s/60), $s%60);
    }
}
