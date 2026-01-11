package model;

public class MemoryBlock {
    private int startAddress;
    private int size;
    private boolean allocated;
    private Process allocatedTo;
    private String blockName;
    
    public MemoryBlock(int start, int size, String name) {
        this.startAddress = start;
        this.size = size;
        this.allocated = false;
        this.allocatedTo = null;
        this.blockName = name;
    }
    
    public boolean allocate(Process process, int requiredSize) {
        if (!allocated && size >= requiredSize) {
            this.allocated = true;
            this.allocatedTo = process;
            return true;
        }
        return false;
    }
    
    public void deallocate() {
        this.allocated = false;
        this.allocatedTo = null;
    }
    
    // Getters
    public int getStartAddress() { return startAddress; }
    public int getSize() { return size; }
    public boolean isAllocated() { return allocated; }
    public Process getAllocatedTo() { return allocatedTo; }
    public String getBlockName() { return blockName; }
    
    @Override
    public String toString() {
        String status = allocated ? "ALLOC to P" + allocatedTo.getPid() : "FREE";
        return String.format("%s [%d-%d] Size: %d | %s", 
            blockName, startAddress, startAddress + size, size, status);
    }
}