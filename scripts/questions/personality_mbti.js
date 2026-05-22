// MBTI - 30 soal, mapping ke 4 dimensi: E/I, S/N, T/F, J/P
// Options: [{text, dim}] — dim indicates which pole this choice maps to
module.exports = [
  // E vs I (8 soal)
  { q: "Saya merasa lebih berenergi setelah:", o: [{"text":"Berkumpul dan berinteraksi dengan banyak orang","dim":"E"},{"text":"Menghabiskan waktu sendirian atau dengan 1-2 orang terdekat","dim":"I"}], a: -1 },
  { q: "Dalam situasi sosial baru, saya cenderung:", o: [{"text":"Mudah memulai percakapan dengan orang asing","dim":"E"},{"text":"Menunggu orang lain mendekati saya terlebih dahulu","dim":"I"}], a: -1 },
  { q: "Saat istirahat kerja, saya lebih memilih:", o: [{"text":"Makan siang bersama rekan kerja dan mengobrol","dim":"E"},{"text":"Makan sendirian sambil membaca atau mendengarkan musik","dim":"I"}], a: -1 },
  { q: "Saya lebih suka bekerja di:", o: [{"text":"Ruang terbuka bersama banyak orang","dim":"E"},{"text":"Ruang pribadi yang tenang","dim":"I"}], a: -1 },
  { q: "Ketika memiliki masalah, saya cenderung:", o: [{"text":"Membicarakannya dengan orang lain untuk mendapat perspektif","dim":"E"},{"text":"Merenungkannya sendiri sebelum membicarakannya","dim":"I"}], a: -1 },
  { q: "Di akhir pekan, saya lebih senang:", o: [{"text":"Menghadiri acara sosial atau pergi bersama teman","dim":"E"},{"text":"Bersantai di rumah dengan hobi pribadi","dim":"I"}], a: -1 },
  { q: "Saya lebih mudah berpikir jernih ketika:", o: [{"text":"Berdiskusi dengan orang lain","dim":"E"},{"text":"Memikirkannya dalam keheningan","dim":"I"}], a: -1 },
  { q: "Dalam rapat tim, saya biasanya:", o: [{"text":"Aktif menyampaikan ide dan pendapat","dim":"E"},{"text":"Mendengarkan dulu lalu berbicara jika perlu","dim":"I"}], a: -1 },
  // S vs N (7 soal)
  { q: "Saat mengerjakan proyek, saya lebih fokus pada:", o: [{"text":"Detail dan fakta konkret yang ada di depan mata","dim":"S"},{"text":"Gambaran besar dan kemungkinan-kemungkinan di masa depan","dim":"N"}], a: -1 },
  { q: "Saya lebih percaya pada:", o: [{"text":"Pengalaman langsung dan data yang terukur","dim":"S"},{"text":"Intuisi dan firasat saya","dim":"N"}], a: -1 },
  { q: "Saat membaca instruksi, saya cenderung:", o: [{"text":"Membaca setiap langkah secara berurutan","dim":"S"},{"text":"Membaca sekilas lalu langsung mencoba","dim":"N"}], a: -1 },
  { q: "Saya lebih tertarik membahas:", o: [{"text":"Hal-hal yang sedang terjadi saat ini","dim":"S"},{"text":"Teori dan kemungkinan di masa depan","dim":"N"}], a: -1 },
  { q: "Dalam menyelesaikan masalah, saya lebih mengandalkan:", o: [{"text":"Metode yang sudah terbukti berhasil","dim":"S"},{"text":"Pendekatan baru yang inovatif","dim":"N"}], a: -1 },
  { q: "Saya lebih suka penjelasan yang:", o: [{"text":"Langsung ke poin dan praktis","dim":"S"},{"text":"Mendalam dan penuh makna tersembunyi","dim":"N"}], a: -1 },
  { q: "Saat belajar sesuatu yang baru, saya lebih suka:", o: [{"text":"Praktik langsung dan contoh nyata","dim":"S"},{"text":"Memahami konsep dan teori dasarnya dulu","dim":"N"}], a: -1 },
  // T vs F (8 soal)
  { q: "Saat membuat keputusan penting, saya lebih mengutamakan:", o: [{"text":"Logika dan analisis objektif","dim":"T"},{"text":"Perasaan dan dampak terhadap orang lain","dim":"F"}], a: -1 },
  { q: "Jika teman melakukan kesalahan di tempat kerja, saya akan:", o: [{"text":"Memberitahu langsung agar bisa diperbaiki","dim":"T"},{"text":"Mencari cara yang halus agar tidak menyakiti perasaannya","dim":"F"}], a: -1 },
  { q: "Saya lebih menghargai:", o: [{"text":"Kejujuran meskipun menyakitkan","dim":"T"},{"text":"Kebijaksanaan dalam menyampaikan kebenaran","dim":"F"}], a: -1 },
  { q: "Dalam konflik, saya cenderung:", o: [{"text":"Mencari solusi yang paling logis dan adil","dim":"T"},{"text":"Mencari solusi yang menjaga harmoni hubungan","dim":"F"}], a: -1 },
  { q: "Kritik membangun menurut saya:", o: [{"text":"Penting dan harus disampaikan apa adanya","dim":"T"},{"text":"Perlu disampaikan dengan mempertimbangkan perasaan orang","dim":"F"}], a: -1 },
  { q: "Saya lebih suka atasan yang:", o: [{"text":"Tegas dan konsisten dalam aturan","dim":"T"},{"text":"Pengertian dan memahami kondisi bawahan","dim":"F"}], a: -1 },
  { q: "Saya merasa puas ketika:", o: [{"text":"Menyelesaikan tugas dengan efisien dan benar","dim":"T"},{"text":"Membuat orang lain merasa dihargai dan bahagia","dim":"F"}], a: -1 },
  { q: "Saat menilai situasi, saya cenderung menggunakan:", o: [{"text":"Kepala (pikiran rasional)","dim":"T"},{"text":"Hati (empati dan nilai pribadi)","dim":"F"}], a: -1 },
  // J vs P (7 soal)
  { q: "Saya lebih suka:", o: [{"text":"Membuat jadwal dan mengikutinya dengan disiplin","dim":"J"},{"text":"Fleksibel dan menyesuaikan situasi yang ada","dim":"P"}], a: -1 },
  { q: "Deadline menurut saya:", o: [{"text":"Harus dipenuhi tepat waktu atau lebih awal","dim":"J"},{"text":"Adalah panduan yang bisa disesuaikan","dim":"P"}], a: -1 },
  { q: "Saat liburan, saya lebih suka:", o: [{"text":"Merencanakan itinerary secara detail","dim":"J"},{"text":"Pergi tanpa rencana khusus dan menikmati spontanitas","dim":"P"}], a: -1 },
  { q: "Meja kerja saya biasanya:", o: [{"text":"Rapi dan terorganisir","dim":"J"},{"text":"Agak berantakan tapi saya tahu di mana semuanya","dim":"P"}], a: -1 },
  { q: "Saya merasa lebih nyaman ketika:", o: [{"text":"Keputusan sudah dibuat dan final","dim":"J"},{"text":"Pilihan masih terbuka","dim":"P"}], a: -1 },
  { q: "Dalam mengerjakan tugas, saya cenderung:", o: [{"text":"Menyelesaikannya jauh sebelum deadline","dim":"J"},{"text":"Mengerjakannya menjelang deadline karena lebih termotivasi","dim":"P"}], a: -1 },
  { q: "Saya lebih menikmati:", o: [{"text":"Rutinitas yang terstruktur dan dapat diprediksi","dim":"J"},{"text":"Variasi dan kejutan dalam keseharian","dim":"P"}], a: -1 },
];
