<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = ['name','email','password','role','phone','position_applied','birth_date','education','is_active'];
    protected $hidden   = ['password','remember_token'];
    protected $casts    = ['email_verified_at'=>'datetime','birth_date'=>'date','is_active'=>'boolean'];

    public function testSessions() { return $this->hasMany(TestSession::class); }
    public function isHR()        { return $this->role === 'hr'; }
    public function isCandidate() { return $this->role === 'candidate'; }
}
