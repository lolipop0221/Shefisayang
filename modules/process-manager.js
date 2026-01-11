/**
 * Process Manager Module
 * Handles process creation, PCB, and status management
 */

const ProcessManager = (function() {
    let processes = [];
    let pidCounter = 1;
    
    class Process {
        constructor(pid, burstTime, arrivalTime = 0, priority = 1) {
            this.pid = pid;
            this.burstTime = parseInt(burstTime);
            this.arrivalTime = parseInt(arrivalTime);
            this.priority = parseInt(priority);
            this.status = 'New';
            this.remainingTime = this.burstTime;
            this.waitingTime = 0;
            this.turnaroundTime = 0;
            this.responseTime = -1; // -1 means not responded yet
        }
        
        updateStatus(newStatus) {
            this.status = newStatus;
        }
        
        execute(time = 1) {
            this.remainingTime -= time;
            if (this.remainingTime <= 0) {
                this.status = 'Terminated';
            }
        }
    }
    
    return {
        /**
         * Initialize Process Manager
         */
        init: function() {
            processes = [];
            pidCounter = 1;
            this.renderTable();
        },
        
        /**
         * Add a new process
         */
        addProcess: function(pid, burstTime, arrivalTime = 0, priority = 1) {
            // Auto-generate PID if not provided
            if (!pid) {
                pid = `P${pidCounter++}`;
            }
            
            const newProcess = new Process(pid, burstTime, arrivalTime, priority);
            processes.push(newProcess);
            this.renderTable();
            return newProcess;
        },
        
        /**
         * Add process from form input
         */
        addProcessFromForm: function() {
            const pid = document.getElementById('pid').value;
            const burstTime = document.getElementById('burstTime').value;
            const arrivalTime = document.getElementById('arrivalTime').value || 0;
            const priority = document.getElementById('priority').value || 1;
            
            this.addProcess(pid, burstTime, arrivalTime, priority);
            
            // Clear form
            document.getElementById('pid').value = `P${pidCounter}`;
            document.getElementById('burstTime').value = '';
        },
        
        /**
         * Get all processes
         */
        getAllProcesses: function() {
            return processes.map(p => ({
                pid: p.pid,
                burstTime: p.burstTime,
                arrivalTime: p.arrivalTime,
                priority: p.priority,
                status: p.status,
                remainingTime: p.remainingTime
            }));
        },
        
        /**
         * Get process by PID
         */
        getProcess: function(pid) {
            return processes.find(p => p.pid === pid);
        },
        
        /**
         * Update process status
         */
        updateProcessStatus: function(pid, status) {
            const process = this.getProcess(pid);
            if (process) {
                process.updateStatus(status);
                this.renderTable();
            }
        },
        
        /**
         * Clear all processes
         */
        clearAllProcesses: function() {
            if (confirm('Apakah Anda yakin ingin menghapus semua proses?')) {
                processes = [];
                pidCounter = 1;
                this.renderTable();
            }
        },
        
        /**
         * Remove a process
         */
        removeProcess: function(pid) {
            processes = processes.filter(p => p.pid !== pid);
            this.renderTable();
        },
        
        /**
         * Render process table
         */
        renderTable: function() {
            const tbody = document.getElementById('processTableBody');
            tbody.innerHTML = '';
            
            processes.forEach(process => {
                const row = document.createElement('tr');
                
                // Determine status badge color
                let badgeClass = 'bg-secondary';
                switch(process.status) {
                    case 'Ready': badgeClass = 'bg-warning'; break;
                    case 'Running': badgeClass = 'bg-success'; break;
                    case 'Waiting': badgeClass = 'bg-danger'; break;
                    case 'Terminated': badgeClass = 'bg-dark'; break;
                }
                
                row.innerHTML = `
                    <td>${process.pid}</td>
                    <td>${process.burstTime}</td>
                    <td>${process.arrivalTime}</td>
                    <td>${process.priority}</td>
                    <td><span class="badge ${badgeClass}">${process.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="ProcessManager.updateProcessStatus('${process.pid}', 'Ready')">
                            Ready
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="ProcessManager.updateProcessStatus('${process.pid}', 'Running')">
                            Run
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="ProcessManager.removeProcess('${process.pid}')">
                            Hapus
                        </button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            // Update process count display
            const processCount = document.createElement('div');
            processCount.className = 'text-muted mt-2';
            processCount.textContent = `Total Proses: ${processes.length}`;
            
            // Remove existing count if any
            const existingCount = document.querySelector('.process-count');
            if (existingCount) {
                existingCount.remove();
            }
            
            processCount.classList.add('process-count');
            tbody.parentElement.parentElement.appendChild(processCount);
        },
        
        /**
         * Reset all processes to New status
         */
        resetProcesses: function() {
            processes.forEach(p => p.status = 'New');
            this.renderTable();
        }
    };
})();