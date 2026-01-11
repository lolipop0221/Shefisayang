package scheduler;

import model.Process;
import java.util.List;

public interface Scheduler {
    String schedule(List<Process> processes);
    String getName();
    List<String> getGanttChart();
    List<Integer> getWaitingTimes();
    List<Integer> getTurnaroundTimes();
    double getAvgWaitingTime();
    double getAvgTurnaroundTime();
}