package memory;

import model.MemoryBlock;
import model.Process;
import java.util.*;

public class MemoryManager {
    private List<MemoryBlock> memory;
    private int totalMemory;
    private String algorithm; // "FirstFit", "BestFit", "WorstFit"
    
    public MemoryManager(int totalMemory) {
        this.totalMemory = totalMemory;
        this.memory = new ArrayList<>();
        this.algorithm = "FirstFit";
        
        // Initialize memory as one free block
        memory.add(new MemoryBlock(0, totalMemory, "Free Block"));
    }
    
    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }
    
    public boolean allocateMemory(Process process, int size) {
        switch (algorithm) {
            case "FirstFit": return firstFit(process, size);
            case "BestFit": return bestFit(process, size);
            case "WorstFit": return worstFit(process, size);
            default: return firstFit(process, size);
        }
    }
    
    private boolean firstFit(Process process, int size) {
        for (int i = 0; i < memory.size(); i++) {
            MemoryBlock block = memory.get(i);
            if (!block.isAllocated() && block.getSize() >= size) {
                return splitBlock(i, process, size);
            }
        }
        System.out.println("Memory allocation failed for P" + process.getPid());
        return false;
    }
    
    private boolean bestFit(Process process, int size) {
        int bestIndex = -1;
        int bestSize = Integer.MAX_VALUE;
        
        for (int i = 0; i < memory.size(); i++) {
            MemoryBlock block = memory.get(i);
            if (!block.isAllocated() && block.getSize() >= size) {
                if (block.getSize() < bestSize) {
                    bestSize = block.getSize();
                    bestIndex = i;
                }
            }
        }
        
        if (bestIndex != -1) {
            return splitBlock(bestIndex, process, size);
        }
        return false;
    }
    
    private boolean worstFit(Process process, int size) {
        int worstIndex = -1;
        int worstSize = -1;
        
        for (int i = 0; i < memory.size(); i++) {
            MemoryBlock block = memory.get(i);
            if (!block.isAllocated() && block.getSize() >= size) {
                if (block.getSize() > worstSize) {
                    worstSize = block.getSize();
                    worstIndex = i;
                }
            }
        }
        
        if (worstIndex != -1) {
            return splitBlock(worstIndex, process, size);
        }
        return false;
    }
    
    private boolean splitBlock(int index, Process process, int size) {
        MemoryBlock original = memory.get(index);
        int remaining = original.getSize() - size;
        
        if (remaining > 0) {
            // Split the block
            MemoryBlock allocated = new MemoryBlock(
                original.getStartAddress(), 
                size, 
                "P" + process.getPid()
            );
            allocated.allocate(process, size);
            
            MemoryBlock free = new MemoryBlock(
                original.getStartAddress() + size,
                remaining,
                "Free Block"
            );
            
            memory.remove(index);
            memory.add(index, allocated);
            memory.add(index + 1, free);
        } else {
            // Use entire block
            original.allocate(process, size);
            original.blockName = "P" + process.getPid();
        }
        
        System.out.println("Allocated " + size + "KB to P" + process.getPid());
        return true;
    }
    
    public void deallocateMemory(int pid) {
        for (MemoryBlock block : memory) {
            if (block.isAllocated() && block.getAllocatedTo().getPid() == pid) {
                block.deallocate();
                block.blockName = "Free Block";
                System.out.println("Deallocated memory from P" + pid);
                
                // Merge adjacent free blocks
                mergeFreeBlocks();
                return;
            }
        }
    }
    
    private void mergeFreeBlocks() {
        for (int i = 0; i < memory.size() - 1; i++) {
            MemoryBlock current = memory.get(i);
            MemoryBlock next = memory.get(i + 1);
            
            if (!current.isAllocated() && !next.isAllocated()) {
                current.size += next.getSize();
                memory.remove(i + 1);
                i--; // Check again
            }
        }
    }
    
    public void displayMemory() {
        System.out.println("\n=== MEMORY LAYOUT (" + algorithm + ") ===");
        System.out.println("Total Memory: " + totalMemory + "KB");
        
        int used = 0;
        for (MemoryBlock block : memory) {
            System.out.println(block);
            if (block.isAllocated()) {
                used += block.getSize();
            }
        }
        
        int free = totalMemory - used;
        System.out.println("\nUsed: " + used + "KB | Free: " + free + "KB");
        System.out.println("Fragmentation: " + (countFragments() > 1 ? "External" : "None/Internal"));
    }
    
    private int countFragments() {
        int fragments = 0;
        for (MemoryBlock block : memory) {
            if (!block.isAllocated()) {
                fragments++;
            }
        }
        return fragments;
    }
    
    public List<MemoryBlock> getMemoryBlocks() {
        return memory;
    }
}