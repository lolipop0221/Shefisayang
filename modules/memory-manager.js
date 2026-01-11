/**
 * Memory Manager Module
 * Implements memory allocation algorithms: First Fit, Best Fit, Worst Fit
 */

const MemoryManager = (function() {
    let memory = [];
    let totalSize = 256; // in MB
    let allocations = {}; // pid -> {start, size}
    const BLOCK_SIZE = 10; // Visual block size in pixels
    
    return {
        /**
         * Initialize memory manager
         */
        init: function(size = 256) {
            totalSize = size;
            memory = new Array(totalSize).fill(0); // 0 = free, 1 = allocated
            allocations = {};
            this.renderMemory();
            this.updateFragmentationInfo();
        },
        
        /**
         * Reinitialize with new size
         */
        reinitialize: function(newSize) {
            if (newSize < totalSize) {
                // Check if new size can accommodate existing allocations
                const usedMemory = Object.values(allocations).reduce((sum, alloc) => sum + alloc.size, 0);
                if (usedMemory > newSize) {
                    alert(`Tidak bisa mengurangi ukuran memori! Memori digunakan: ${usedMemory}MB`);
                    document.getElementById('totalMemory').value = totalSize;
                    return;
                }
            }
            
            this.init(newSize);
            
            // Re-allocate existing allocations
            const tempAllocations = { ...allocations };
            allocations = {};
            
            for (const [pid, alloc] of Object.entries(tempAllocations)) {
                this.allocateMemory(pid, alloc.size, 'first'); // Use first fit for reallocation
            }
        },
        
        /**
         * Allocate memory using selected algorithm
         */
        allocateMemory: function(pid, size, method = 'first') {
            if (allocations[pid]) {
                alert(`Process ${pid} sudah dialokasikan memori!`);
                return false;
            }
            
            if (size > totalSize) {
                alert('Ukuran memori melebihi total memori!');
                return false;
            }
            
            let start = -1;
            
            switch(method) {
                case 'first':
                    start = this.firstFit(size);
                    break;
                case 'best':
                    start = this.bestFit(size);
                    break;
                case 'worst':
                    start = this.worstFit(size);
                    break;
                default:
                    start = this.firstFit(size);
            }
            
            if (start !== -1) {
                // Mark memory as allocated
                for (let i = start; i < start + size; i++) {
                    memory[i] = 1;
                }
                
                allocations[pid] = {
                    start: start,
                    size: size,
                    pid: pid
                };
                
                this.renderMemory();
                this.updateFragmentationInfo();
                return true;
            } else {
                alert('Memori tidak cukup untuk alokasi!');
                return false;
            }
        },
        
        /**
         * Deallocate memory for a process
         */
        deallocateMemory: function(pid) {
            if (!allocations[pid]) {
                alert(`Process ${pid} tidak memiliki alokasi memori!`);
                return false;
            }
            
            const alloc = allocations[pid];
            
            // Mark memory as free
            for (let i = alloc.start; i < alloc.start + alloc.size; i++) {
                memory[i] = 0;
            }
            
            delete allocations[pid];
            this.renderMemory();
            this.updateFragmentationInfo();
            return true;
        },
        
        /**
         * First Fit algorithm
         */
        firstFit: function(size) {
            let freeStart = -1;
            let freeCount = 0;
            
            for (let i = 0; i < totalSize; i++) {
                if (memory[i] === 0) {
                    if (freeStart === -1) {
                        freeStart = i;
                    }
                    freeCount++;
                    
                    if (freeCount >= size) {
                        return freeStart;
                    }
                } else {
                    freeStart = -1;
                    freeCount = 0;
                }
            }
            
            return -1;
        },
        
        /**
         * Best Fit algorithm
         */
        bestFit: function(size) {
            let bestStart = -1;
            let bestSize = Infinity;
            let currentStart = -1;
            let currentSize = 0;
            
            for (let i = 0; i <= totalSize; i++) {
                if (i < totalSize && memory[i] === 0) {
                    if (currentStart === -1) {
                        currentStart = i;
                    }
                    currentSize++;
                } else {
                    if (currentSize >= size && currentSize < bestSize) {
                        bestStart = currentStart;
                        bestSize = currentSize;
                    }
                    currentStart = -1;
                    currentSize = 0;
                }
            }
            
            return bestStart;
        },
        
        /**
         * Worst Fit algorithm
         */
        worstFit: function(size) {
            let worstStart = -1;
            let worstSize = -1;
            let currentStart = -1;
            let currentSize = 0;
            
            for (let i = 0; i <= totalSize; i++) {
                if (i < totalSize && memory[i] === 0) {
                    if (currentStart === -1) {
                        currentStart = i;
                    }
                    currentSize++;
                } else {
                    if (currentSize >= size && currentSize > worstSize) {
                        worstStart = currentStart;
                        worstSize = currentSize;
                    }
                    currentStart = -1;
                    currentSize = 0;
                }
            }
            
            return worstStart;
        },
        
        /**
         * Render memory visualization
         */
        renderMemory: function() {
            const container = document.getElementById('memoryVisualization');
            container.innerHTML = '';
            
            // Calculate blocks to display (max 100 blocks for performance)
            const displayBlocks = Math.min(totalSize, 100);
            const blockRepresents = Math.ceil(totalSize / displayBlocks);
            
            for (let i = 0; i < displayBlocks; i++) {
                const block = document.createElement('div');
                const startIdx = i * blockRepresents;
                const endIdx = Math.min((i + 1) * blockRepresents, totalSize);
                
                // Check if this block contains allocated memory
                let isAllocated = false;
                let allocatedPid = '';
                
                for (let j = startIdx; j < endIdx; j++) {
                    if (memory[j] === 1) {
                        isAllocated = true;
                        // Find which process allocated this block
                        for (const [pid, alloc] of Object.entries(allocations)) {
                            if (j >= alloc.start && j < alloc.start + alloc.size) {
                                allocatedPid = pid;
                                break;
                            }
                        }
                        break;
                    }
                }
                
                const blockSize = (endIdx - startIdx);
                const widthPercent = 100 / displayBlocks;
                
                block.className = 'memory-block';
                block.style.width = `calc(${widthPercent}% - 4px)`;
                block.style.height = `${BLOCK_SIZE}px`;
                block.style.backgroundColor = isAllocated ? '#dc3545' : '#28a745';
                block.title = `Block ${i+1}: ${startIdx}-${endIdx-1} (${blockSize}MB)\n` +
                             (isAllocated ? `Allocated to ${allocatedPid}` : 'Free');
                
                block.textContent = isAllocated ? allocatedPid : 'Free';
                container.appendChild(block);
            }
        },
        
        /**
         * Update fragmentation information
         */
        updateFragmentationInfo: function() {
            const container = document.getElementById('fragmentationInfo');
            
            // Calculate free and used memory
            const usedMemory = Object.values(allocations).reduce((sum, alloc) => sum + alloc.size, 0);
            const freeMemory = totalSize - usedMemory;
            
            // Calculate external fragmentation
            let freeBlocks = 0;
            let inFreeBlock = false;
            
            for (let i = 0; i < totalSize; i++) {
                if (memory[i] === 0) {
                    if (!inFreeBlock) {
                        freeBlocks++;
                        inFreeBlock = true;
                    }
                } else {
                    inFreeBlock = false;
                }
            }
            
            const fragmentation = freeBlocks > 1 ? 'External Fragmentation' : 
                                 freeBlocks === 1 ? 'No External Fragmentation' : 
                                 'No Free Memory';
            
            container.innerHTML = `
                <div class="progress mb-2" style="height: 20px;">
                    <div class="progress-bar bg-success" style="width: ${(freeMemory/totalSize)*100}%">
                        Free: ${freeMemory}MB
                    </div>
                    <div class="progress-bar bg-danger" style="width: ${(usedMemory/totalSize)*100}%">
                        Used: ${usedMemory}MB
                    </div>
                </div>
                <p><strong>Total Memori:</strong> ${totalSize}MB</p>
                <p><strong>Fragmentasi:</strong> ${fragmentation} (${freeBlocks} blok bebas)</p>
                <p><strong>Proses yang dialokasi:</strong> ${Object.keys(allocations).length}</p>
            `;
        },
        
        /**
         * Get memory status for reporting
         */
        getMemoryStatus: function() {
            const used = Object.values(allocations).reduce((sum, alloc) => sum + alloc.size, 0);
            const free = totalSize - used;
            
            return {
                total: totalSize,
                used: used,
                free: free,
                allocations: { ...allocations },
                fragmentation: this.calculateFragmentation()
            };
        },
        
        /**
         * Calculate fragmentation percentage
         */
        calculateFragmentation: function() {
            let largestFreeBlock = 0;
            let currentBlock = 0;
            let totalFree = 0;
            
            for (let i = 0; i < totalSize; i++) {
                if (memory[i] === 0) {
                    currentBlock++;
                    totalFree++;
                } else {
                    largestFreeBlock = Math.max(largestFreeBlock, currentBlock);
                    currentBlock = 0;
                }
            }
            largestFreeBlock = Math.max(largestFreeBlock, currentBlock);
            
            if (totalFree === 0) return 0;
            return ((totalFree - largestFreeBlock) / totalFree * 100).toFixed(2);
        }
    };
})();