/**
 * CPU Scheduler Module
 * Implements scheduling algorithms: FCFS, SJF, Priority, Round Robin
 */

const CPUScheduler = (function() {
    let ganttChart = null;
    
    return {
        /**
         * Run scheduling algorithm
         */
        runScheduling: function(processes, algorithm, quantum = 2) {
            // Convert to array of objects with necessary properties
            const processList = processes.map(p => ({
                ...p,
                remainingTime: p.burstTime,
                finishTime: 0,
                startTime: -1
            }));
            
            let results;
            
            switch(algorithm) {
                case 'fcfs':
                    results = this.fcfs([...processList]);
                    break;
                case 'sjf':
                    results = this.sjf([...processList]);
                    break;
                case 'priority':
                    results = this.priority([...processList]);
                    break;
                case 'rr':
                    results = this.roundRobin([...processList], quantum);
                    break;
                default:
                    results = this.fcfs([...processList]);
            }
            
            return results;
        },
        
        /**
         * First Come First Serve
         */
        fcfs: function(processes) {
            // Sort by arrival time
            processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
            
            let currentTime = 0;
            let ganttData = [];
            
            processes.forEach(process => {
                // Process starts when it arrives and CPU is free
                const startTime = Math.max(currentTime, process.arrivalTime);
                const finishTime = startTime + process.burstTime;
                
                process.startTime = startTime;
                process.finishTime = finishTime;
                process.waitingTime = startTime - process.arrivalTime;
                process.turnaroundTime = finishTime - process.arrivalTime;
                process.responseTime = startTime - process.arrivalTime;
                
                ganttData.push({
                    pid: process.pid,
                    start: startTime,
                    end: finishTime
                });
                
                currentTime = finishTime;
            });
            
            return {
                processes: processes,
                ganttData: ganttData
            };
        },
        
        /**
         * Shortest Job First (Non-preemptive)
         */
        sjf: function(processes) {
            // Sort by arrival time first
            processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
            
            let currentTime = 0;
            let ganttData = [];
            let completed = 0;
            const n = processes.length;
            let isCompleted = new Array(n).fill(false);
            
            while (completed < n) {
                let idx = -1;
                let minBurst = Infinity;
                
                // Find process with minimum burst time among arrived processes
                for (let i = 0; i < n; i++) {
                    if (!isCompleted[i] && 
                        processes[i].arrivalTime <= currentTime && 
                        processes[i].burstTime < minBurst) {
                        minBurst = processes[i].burstTime;
                        idx = i;
                    }
                }
                
                if (idx !== -1) {
                    const process = processes[idx];
                    const startTime = currentTime;
                    const finishTime = startTime + process.burstTime;
                    
                    process.startTime = startTime;
                    process.finishTime = finishTime;
                    process.waitingTime = startTime - process.arrivalTime;
                    process.turnaroundTime = finishTime - process.arrivalTime;
                    process.responseTime = startTime - process.arrivalTime;
                    
                    ganttData.push({
                        pid: process.pid,
                        start: startTime,
                        end: finishTime
                    });
                    
                    isCompleted[idx] = true;
                    completed++;
                    currentTime = finishTime;
                } else {
                    currentTime++;
                }
            }
            
            return {
                processes: processes,
                ganttData: ganttData
            };
        },
        
        /**
         * Priority Scheduling (Non-preemptive)
         */
        priority: function(processes) {
            // Lower priority number = higher priority
            processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
            
            let currentTime = 0;
            let ganttData = [];
            let completed = 0;
            const n = processes.length;
            let isCompleted = new Array(n).fill(false);
            
            while (completed < n) {
                let idx = -1;
                let highestPriority = Infinity;
                
                // Find process with highest priority among arrived processes
                for (let i = 0; i < n; i++) {
                    if (!isCompleted[i] && 
                        processes[i].arrivalTime <= currentTime && 
                        processes[i].priority < highestPriority) {
                        highestPriority = processes[i].priority;
                        idx = i;
                    }
                }
                
                if (idx !== -1) {
                    const process = processes[idx];
                    const startTime = currentTime;
                    const finishTime = startTime + process.burstTime;
                    
                    process.startTime = startTime;
                    process.finishTime = finishTime;
                    process.waitingTime = startTime - process.arrivalTime;
                    process.turnaroundTime = finishTime - process.arrivalTime;
                    process.responseTime = startTime - process.arrivalTime;
                    
                    ganttData.push({
                        pid: process.pid,
                        start: startTime,
                        end: finishTime
                    });
                    
                    isCompleted[idx] = true;
                    completed++;
                    currentTime = finishTime;
                } else {
                    currentTime++;
                }
            }
            
            return {
                processes: processes,
                ganttData: ganttData
            };
        },
        
        /**
         * Round Robin
         */
        roundRobin: function(processes, quantum) {
            let currentTime = 0;
            let ganttData = [];
            let queue = [];
            let remainingTimes = processes.map(p => p.burstTime);
            let arrivalTimes = processes.map(p => p.arrivalTime);
            let startTimes = new Array(processes.length).fill(-1);
            let finishTimes = new Array(processes.length).fill(0);
            let visited = new Array(processes.length).fill(false);
            
            // Initialize queue with processes that have arrived at time 0
            for (let i = 0; i < processes.length; i++) {
                if (arrivalTimes[i] <= currentTime) {
                    queue.push(i);
                    visited[i] = true;
                }
            }
            
            while (true) {
                if (queue.length === 0) {
                    // Check if all processes are done
                    if (remainingTimes.every(rt => rt === 0)) break;
                    
                    // Find next arriving process
                    let nextArrival = Math.min(...arrivalTimes.filter((at, idx) => remainingTimes[idx] > 0));
                    currentTime = nextArrival;
                    
                    // Add arriving processes to queue
                    for (let i = 0; i < processes.length; i++) {
                        if (!visited[i] && arrivalTimes[i] <= currentTime && remainingTimes[i] > 0) {
                            queue.push(i);
                            visited[i] = true;
                        }
                    }
                    continue;
                }
                
                const idx = queue.shift();
                const process = processes[idx];
                
                // Record start time if first execution
                if (startTimes[idx] === -1) {
                    startTimes[idx] = currentTime;
                }
                
                // Execute for quantum or remaining time
                const execTime = Math.min(quantum, remainingTimes[idx]);
                ganttData.push({
                    pid: process.pid,
                    start: currentTime,
                    end: currentTime + execTime
                });
                
                remainingTimes[idx] -= execTime;
                currentTime += execTime;
                
                // Add newly arrived processes to queue
                for (let i = 0; i < processes.length; i++) {
                    if (!visited[i] && arrivalTimes[i] <= currentTime && remainingTimes[i] > 0) {
                        queue.push(i);
                        visited[i] = true;
                    }
                }
                
                // If process not finished, add back to queue
                if (remainingTimes[idx] > 0) {
                    queue.push(idx);
                } else {
                    finishTimes[idx] = currentTime;
                }
            }
            
            // Calculate metrics
            processes.forEach((process, idx) => {
                process.startTime = startTimes[idx];
                process.finishTime = finishTimes[idx];
                process.waitingTime = finishTimes[idx] - process.arrivalTime - process.burstTime;
                process.turnaroundTime = finishTimes[idx] - process.arrivalTime;
                process.responseTime = startTimes[idx] - process.arrivalTime;
            });
            
            return {
                processes: processes,
                ganttData: ganttData
            };
        },
        
        /**
         * Display scheduling results
         */
        displayResults: function(results) {
            this.displayGanttChart(results.ganttData);
            this.displayMetrics(results.processes);
        },
        
        /**
         * Display Gantt Chart using Chart.js
         */
        displayGanttChart: function(ganttData) {
            const ctx = document.getElementById('ganttChart').getContext('2d');
            
            // Destroy existing chart if any
            if (ganttChart) {
                ganttChart.destroy();
            }
            
            // Prepare data
            const labels = ganttData.map((_, i) => i + 1);
            const datasets = [];
            
            // Create a dataset for each unique PID
            const uniquePids = [...new Set(ganttData.map(item => item.pid))];
            const colors = [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                '#9966FF', '#FF9F40', '#8AC926', '#1982C4'
            ];
            
            uniquePids.forEach((pid, idx) => {
                const data = ganttData.map((item, i) => {
                    if (item.pid === pid) {
                        return item.end - item.start; // Duration
                    }
                    return null;
                });
                
                datasets.push({
                    label: pid,
                    backgroundColor: colors[idx % colors.length],
                    data: data,
                    borderWidth: 1
                });
            });
            
            ganttChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels.map(l => `T${l}`),
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Time Slots'
                            }
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Duration'
                            },
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const data = ganttData[context.dataIndex];
                                    return `${context.dataset.label}: ${data.end - data.start} units (${data.start}-${data.end})`;
                                }
                            }
                        }
                    }
                }
            });
        },
        
        /**
         * Display metrics table
         */
        displayMetrics: function(processes) {
            const tbody = document.getElementById('resultTableBody');
            tbody.innerHTML = '';
            
            let totalWT = 0;
            let totalTT = 0;
            let totalRT = 0;
            
            processes.forEach(process => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${process.pid}</td>
                    <td>${process.waitingTime}</td>
                    <td>${process.turnaroundTime}</td>
                    <td>${process.responseTime}</td>
                `;
                tbody.appendChild(row);
                
                totalWT += process.waitingTime;
                totalTT += process.turnaroundTime;
                totalRT += process.responseTime;
            });
            
            const avgWT = (totalWT / processes.length).toFixed(2);
            const avgTT = (totalTT / processes.length).toFixed(2);
            const avgRT = (totalRT / processes.length).toFixed(2);
            
            document.getElementById('averageResults').innerHTML = `
                Rata-rata Waiting Time: <strong>${avgWT}</strong> | 
                Rata-rata Turnaround Time: <strong>${avgTT}</strong> | 
                Rata-rata Response Time: <strong>${avgRT}</strong>
            `;
        },
        
        /**
         * Reset display
         */
        resetDisplay: function() {
            const ctx = document.getElementById('ganttChart').getContext('2d');
            if (ganttChart) {
                ganttChart.destroy();
                ganttChart = null;
            }
            
            // Clear canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            // Clear tables
            document.getElementById('resultTableBody').innerHTML = '';
            document.getElementById('averageResults').innerHTML = '';
        }
    };
})();