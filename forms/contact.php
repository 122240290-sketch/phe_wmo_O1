<?php
// Handler form kontak. Butuh hosting PHP. Ganti $tujuan dengan email resmi.
$tujuan = "info@phewmo.example";

if ($_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(405); exit("Metode tidak diizinkan."); }
if (!empty($_POST["website"])) { exit; } // honeypot anti-spam

function bersih($v){ return trim(strip_tags($v ?? "")); }
$nama    = bersih($_POST["nama"] ?? "");
$email   = filter_var($_POST["email"] ?? "", FILTER_VALIDATE_EMAIL);
$perihal = bersih($_POST["perihal"] ?? "Pertanyaan umum");
$pesan   = bersih($_POST["pesan"] ?? "");

if (!$nama || !$email || !$pesan) { http_response_code(400); exit("Data belum lengkap. Kembali dan isi semua kolom."); }

$subjek = "[Website PHE WMO] " . $perihal;
$isi    = "Nama: $nama\nEmail: $email\nPerihal: $perihal\n\n$pesan";
$header = "From: no-reply@phewmo.example\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

if (mail($tujuan, $subjek, $isi, $header)) { header("Location: terima-kasih.html"); }
else { http_response_code(500); echo "Pesan gagal terkirim. Coba lagi nanti."; }
