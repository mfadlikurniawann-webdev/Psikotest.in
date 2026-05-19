<?php
namespace App\Http\Controllers;

use App\Models\TestSession;
use Illuminate\Support\Facades\Auth;

class CandidateController extends Controller
{
    public function dashboard()
    {
        return view('candidate.dashboard');
    }
}
