<?php
// app/Models/TestViolation.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestViolation extends Model
{
    protected $fillable = ['session_id','type','detail','snapshot_path','occurred_at'];
    protected $casts    = ['occurred_at' => 'datetime'];

    public function session() { return $this->belongsTo(TestSession::class); }

    public function getTypeLabelAttribute(): string {
        return match($this->type) {
            'TAB_SWITCH'      => 'Berpindah Tab',
            'FULLSCREEN_EXIT' => 'Keluar Fullscreen',
            'WINDOW_BLUR'     => 'Pindah Aplikasi',
            'FORBIDDEN_KEY'   => 'Tombol Terlarang',
            'COPY_PASTE'      => 'Copy/Paste',
            'MULTIPLE_FACES'  => 'Wajah Ganda Terdeteksi',
            'NO_FACE'         => 'Wajah Tidak Terdeteksi',
            'FACE_AWAY'       => 'Wajah Menoleh',
            default           => $this->type,
        };
    }
}
