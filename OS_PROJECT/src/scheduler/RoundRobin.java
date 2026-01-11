package scheduler;

import model.Process;
import java.util.*;

public class RoundRobin implements Scheduler {
    private List<String> ganttChart;
    private List<Integer> waitingTimes;
    private List<Integer> turnaroundTimes;
    private int quantum = 2; // Default quantum time
    
    public RoundRobin() {
        ganttChart = new ArrayList<>();
        waitingTimes = new ArrayList<>();
        turnaroundTimes = new ArrayList<>();
    }
    
    public void setQuantum(int quantum) {
        this.quantum = quantum;
    }
    
    @Override
    public String schedule(List<Process> processes) {
        Queue<Process> queue = new LinkedList<>();
        List<Process> originalList = new ArrayList<>(processes);
        Map<Integer, Integer> remainingTime = new HashMap<>();
        Map<Integer, Integer> startTime = new HashMap<>();
        Map<Integer, Integer> finishTime = new HashMap<>();
        
        // Initialize
        for (Process p : processes) {
            remainingTime.put(p.getPid(), p.getBurstTime());
            p.setStatus("READY");
        }
        
        // Sort by arrival time
        originalList.sort(Comparator.comparingInt(Process::getArrivalTime));
        
        int currentTime = 0;
        int completed = 0;
        int index = 0;
        StringBuilder result = new StringBuilder();
        result.append("=== Round Robin Scheduling (Quantum=").append(quantum).append(") ===\n");
        
        while (completed < processes.size()) {
            // Add processes that have arrived
            while (index < originalList.size() && originalList.get(index).getArrivalTime() <= currentTime) {
                queue.add(originalList.get(index));
                index++;
            }
            
            if (queue.isEmpty()) {
                currentTime++;
                continue;
            }
            
            Process current = queue.poll();
            if (startTime.get(current.getPid()) == null) {
                startTime.put(current.getPid(), currentTime);
            }
            
            current.setStatus("RUNNING");
            int execTime = Math.min(quantum, remainingTime.get(current.getPid()));
            
            // Add to Gantt chart
            ganttChart.add("P" + current.getPid() + "(" + currentTime + "-" + (currentTime + execTime) + ")");
            
            currentTime += execTime;
            remainingTime.put(current.getPid(), remainingTime.get(current.getPid()) - execTime);
            
            // Add newly arrived processes
            while (index < originalList.size() && originalList.get(index).getArrivalTime() <= currentTime) {
                queue.add(originalList.get(index));
                index++;
            }
            
            if (remainingTime.get(current.getPid()) > 0) {
                current.setStatus("READY");
                queue.add(current);
            } else {
                current.setStatus("TERMINATED");
                finishTime.put(current.getPid(), currentTime);
                completed++;
            }
        }
        
        // Calculate waiting and turnaround times
        for (Process p : processes) {
            int turnaround = finishTime.get(p.getPid()) - p.getArrivalTime();
            int waiting = turnaround - p.getBurstTime();
            
            waitingTimes.add(waiting);
            turnaroundTimes.add(turnaround);
            
            result.append(String.format("P%d: Waiting=%d, Turnaround=%d\n", 
                p.getPid(), waiting, turnaround));
        }
        
        result.append("\nGantt Chart: ").append(ganttChart);
        result.append("\nAverage Waiting Time: ").append(getAvgWaitingTime());
        result.append("\nAverage Turnaround Time: ").append(getAvgTurnaroundTime());
        
        return result.toString();
    }
    
    @Override public String getName() { return "Round Robin"; }
    @Override public List<String> getGanttChart() { return ganttChart; }
    @Override public List<Integer> getWaitingTimes() { return waitingTimes; }
    @Override public List<Integer> getTurnaroundTimes() { return turnaroundTimes; }
    
    @Override
    public double getAvgWaitingTime() {
        return waitingTimes.stream().mapToInt(Integer::intValue).average().orElse(0);
    }
    
    @Override
    public double getAvgTurnaroundTime() {
        return turnaroundTimes.stream().mapToInt(Integer::intValue).average().orElse(0);
    }
}