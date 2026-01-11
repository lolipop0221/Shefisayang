/**
 * Main Controller Script for OS Simulator
 * Mengintegrasikan semua modul
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const algorithmSelect = document.getElementById('algorithmSelect');
    const quantumGroup = document.getElementById('quantumGroup');
    
    // Show/hide quantum time for Round Robin
    algorithmSelect.addEventListener('change', function() {
        if (this.value === 'rr') {
            quantumGroup.style.display = 'block';
        } else {
            quantumGroup.style.display = 'none';
        }
    });
    
    // Initialize Process Manager
    ProcessManager.init();
    
    // Initialize Memory Manager
    MemoryManager.init(256); // Default 256MB
    
    // Event Listeners
    document.getElementById('processForm').addEventListener('submit', function(e) {
        e.preventDefault();
        ProcessManager.addProcessFromForm();
    });
    
    document.getElementById('clearProcesses').addEventListener('click', function() {
        ProcessManager.clearAllProcesses();
    });
    
    document.getElementById('runScheduling').addEventListener('click', function() {
        const processes = ProcessManager.getAllProcesses();
        const algorithm = algorithmSelect.value;
        const quantum = document.getElementById('quantumTime').value;
        
        if (processes.length === 0) {
            alert('Tambahkan proses terlebih dahulu!');
            return;
        }
        
        const results = CPUScheduler.runScheduling(processes, algorithm, parseInt(quantum));
        CPUScheduler.displayResults(results);
    });
    
    document.getElementById('resetScheduling').addEventListener('click', function() {
        CPUScheduler.resetDisplay();
    });
    
    document.getElementById('allocateMemory').addEventListener('click', function() {
        const pid = document.getElementById('memoryPid').value;
        const size = parseInt(document.getElementById('processMemory').value);
        const method = document.getElementById('memoryMethod').value;
        
        if (!pid || !size) {
            alert('Masukkan PID dan ukuran memori!');
            return;
        }
        
        MemoryManager.allocateMemory(pid, size, method);
    });
    
    document.getElementById('deallocateMemory').addEventListener('click', function() {
        const pid = document.getElementById('memoryPid').value;
        
        if (!pid) {
            alert('Masukkan PID untuk dealokasi!');
            return;
        }
        
        MemoryManager.deallocateMemory(pid);
    });
    
    document.getElementById('totalMemory').addEventListener('change', function() {
        const newSize = parseInt(this.value);
        MemoryManager.reinitialize(newSize);
    });
    
    // Initialize with sample data (optional)
    // initializeSampleData();
});

/**
 * Initialize sample data for testing
 */
function initializeSampleData() {
    // Add sample processes
    const sampleProcesses = [
        { pid: 'P1', burstTime: 8, arrivalTime: 0, priority: 3 },
        { pid: 'P2', burstTime: 4, arrivalTime: 1, priority: 2 },
        { pid: 'P3', burstTime: 9, arrivalTime: 2, priority: 1 },
        { pid: 'P4', burstTime: 5, arrivalTime: 3, priority: 4 }
    ];
    
    sampleProcesses.forEach(p => {
        ProcessManager.addProcess(p.pid, p.burstTime, p.arrivalTime, p.priority);
    });
    
    console.log('Sample data loaded');
}