package model;

public class Process {
    private int pid;
    private String name;
    private int burstTime;
    private int arrivalTime;
    private int priority;
    private String status; // NEW, READY, RUNNING, WAITING, TERMINATED
    private int remainingTime;
    
    public Process(int pid, String name, int burstTime, int arrivalTime, int priority) {
        this.pid = pid;
        this.name = name;
        this.burstTime = burstTime;
        this.arrivalTime = arrivalTime;
        this.priority = priority;
        this.status = "NEW";
        this.remainingTime = burstTime;
    }
    
    // Getters
    public int getPid() { return pid; }
    public String getName() { return "P" + pid; }
    public int getBurstTime() { return burstTime; }
    public int getArrivalTime() { return arrivalTime; }
    public int getPriority() { return priority; }
    public String getStatus() { return status; }
    public int getRemainingTime() { return remainingTime; }
    
    // Setters
    public void setStatus(String status) { this.status = status; }
    public void setRemainingTime(int time) { this.remainingTime = time; }
    
    @Override
    public String toString() {
        return String.format("P%d | AT: %d | BT: %d | Prio: %d | Status: %s", 
            pid, arrivalTime, burstTime, priority, status);
    }
}