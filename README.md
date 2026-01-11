# Simulator Sistem Operasi - Web Based

## 📋 Deskripsi
Simulator Sistem Operasi berbasis web yang dibuat untuk memenuhi tugas Ujian Akhir Semester (UAS) mata kuliah Sistem Operasi + Praktikum.

## 👥 Anggota Kelompok
- [Nama Anggota 1] - [NIM]
- [Nama Anggota 2] - [NIM]
- [Nama Anggota 3] - [NIM]

## 🏫 Institusi
Universitas Bahaudin Mudhary Madura (UNIBA MADURA)
Jurusan Informatika - Kelas ICA24/ICB24/ICC24/ICE24/ICF24/ICG24

## 🎯 Fitur yang Diimplementasikan

### 1. Manajemen Proses
- Pembuatan proses dengan PID, Burst Time, Arrival Time, Priority
- Simulasi Process Control Block (PCB)
- Status proses: New, Ready, Running, Waiting, Terminated
- Tabel proses interaktif

### 2. Penjadwalan CPU (4 Algoritma)
- **FCFS** (First Come First Serve)
- **SJF** (Shortest Job First) - Non-preemptive
- **Priority Scheduling** - Non-preemptive
- **Round Robin** - Dengan quantum time yang dapat diatur
- **Output**: Gantt Chart, Waiting Time, Turnaround Time, Response Time

### 3. Manajemen Memori (3 Algoritma)
- **First Fit**
- **Best Fit**
- **Worst Fit**
- **Output**: Visualisasi memori, fragmentasi eksternal/internal

### 4. Sinkronisasi Proses (Opsional)
- Simulasi Producer-Consumer Problem
- Menggunakan semaphore (opsional untuk nilai tambahan)

### 5. Sistem Berkas (Opsional)
- Operasi file: Create, Read, Write, Delete
- Struktur direktori sederhana (opsional untuk nilai tambahan)

## 🛠️ Teknologi yang Digunakan
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3
- **Charting**: Chart.js untuk Gantt Chart
- **Icons**: Bootstrap Icons
- **Version Control**: Git & GitHub

## 📁 Struktur Project
OS-Simulator-Web/
├── index.html # Halaman utama
├── style.css # Custom styles
├── script.js # Main controller
├── modules/
│ ├── process-manager.js # Manajemen proses
│ ├── cpu-scheduler.js # Algoritma penjadwalan
│ ├── memory-manager.js # Alokasi memori
│ └── file-system.js # Sistem berkas (opsional)
├── assets/ # Gambar dan resource
├── README.md # Dokumentasi
└── laporan.pdf # Laporan project


## 🚀 Cara Menjalankan
1. Clone repository:

   git clone [repository-url]

   cd OS-Simulator-Web