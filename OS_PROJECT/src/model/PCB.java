package model;

public class PCB {
    private Process process;
    private int programCounter;
    private int[] cpuRegisters;
    private int memoryStart;
    private int memoryLimit;
    
    public PCB(Process process) {
        this.process = process;
        this.programCounter = 0;
        this.cpuRegisters = new int[4]; // AX, BX, CX, DX
        this.memoryStart = -1;
        this.memoryLimit = 0;
    }
    
    public void displayInfo() {
        System.out.println("\n=== PCB for Process " + process.getPid() + " ===");
        System.out.println("Status: " + process.getStatus());
        System.out.println("Program Counter: " + programCounter);
        System.out.println("Memory: [" + memoryStart + " - " + (memoryStart + memoryLimit) + "]");
    }
    
    // Getters & Setters
    public Process getProcess() { return process; }
    public int getProgramCounter() { return programCounter; }
    public void setProgramCounter(int pc) { this.programCounter = pc; }
    public int[] getCpuRegisters() { return cpuRegisters; }
    public int getMemoryStart() { return memoryStart; }
    public void setMemoryStart(int start) { this.memoryStart = start; }
    public int getMemoryLimit() { return memoryLimit; }
    public void setMemoryLimit(int limit) { this.memoryLimit = limit; }
}