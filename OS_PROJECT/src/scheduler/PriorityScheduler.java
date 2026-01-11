package scheduler;

import model.Process;
import java.util.*;

public class PriorityScheduler implements Scheduler {
    private List<String> ganttChart;
    private List<Integer> waitingTimes;
    private List<Integer> turnaroundTimes;
    
    public PriorityScheduler() {
        ganttChart = new ArrayList<>();
        waitingTimes = new ArrayList<>();
        turnaroundTimes = new ArrayList<>();
    }
    
    @Override
    public String schedule(List<Process> processes) {
        List<Process> sorted = new ArrayList<>(processes);
        // Lower priority number = higher priority
        sorted.sort(Comparator.comparingInt(Process::getPriority)
                   .thenComparingInt(Process::getArrivalTime));
        
        int currentTime = 0;
        StringBuilder result = new StringBuilder();
        result.append("=== Priority Scheduling ===\n");
        
        for (Process p : sorted) {
            if (currentTime < p.getArrivalTime()) {
                currentTime = p.getArrivalTime();
            }
            
            p.setStatus("RUNNING");
            ganttChart.add("P" + p.getPid() + "(" + currentTime + "-" + (currentTime + p.getBurstTime()) + ")");
            
            int waiting = currentTime - p.getArrivalTime();
            int turnaround = waiting + p.getBurstTime();
            
            waitingTimes.add(waiting);
            turnaroundTimes.add(turnaround);
            
            result.append(String.format("P%d (Prio:%d): Waiting=%d, Turnaround=%d\n", 
                p.getPid(), p.getPriority(), waiting, turnaround));
            
            currentTime += p.getBurstTime();
            p.setStatus("TERMINATED");
        }
        
        result.append("\nGantt Chart: ").append(ganttChart);
        result.append("\nAverage Waiting Time: ").append(getAvgWaitingTime());
        result.append("\nAverage Turnaround Time: ").append(getAvgTurnaroundTime());
        
        return result.toString();
    }
    
    @Override public String getName() { return "Priority Scheduling"; }
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