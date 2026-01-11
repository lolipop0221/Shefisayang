package gui;

import scheduler.*;
import model.Process;
import javax.swing.*;
import java.awt.*;
import java.util.List;

public class GanttChartPanel extends JPanel {
    private ProcessTablePanel processTablePanel;
    private JComboBox<String> algorithmCombo;
    private JTextArea resultArea;
    private JPanel chartPanel;
    
    public GanttChartPanel() {
        setLayout(new BorderLayout());
        initComponents();
    }
    
    private void initComponents() {
        // Algorithm selection
        JPanel topPanel = new JPanel(new FlowLayout());
        topPanel.add(new JLabel("Select Algorithm:"));
        
        String[] algorithms = {"FCFS", "SJF", "Priority", "Round Robin"};
        algorithmCombo = new JComboBox<>(algorithms);
        topPanel.add(algorithmCombo);
        
        JButton runBtn = new JButton("Run Scheduling");
        runBtn.addActionListener(e -> runScheduling());
        topPanel.add(runBtn);
        
        add(topPanel, BorderLayout.NORTH);
        
        // Result display
        resultArea = new JTextArea();
        resultArea.setEditable(false);
        resultArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        add(new JScrollPane(resultArea), BorderLayout.CENTER);
        
        // Chart visualization panel
        chartPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                // Gantt chart drawing would go here
            }
        };
        chartPanel.setPreferredSize(new Dimension(800, 100));
        chartPanel.setBackground(Color.WHITE);
        
        add(chartPanel, BorderLayout.SOUTH);
    }
    
    private void runScheduling() {
        // Get processes from ProcessTablePanel (you need to pass reference)
        // For now, create sample processes
        List<Process> processes = createSampleProcesses();
        
        String selected = (String) algorithmCombo.getSelectedItem();
        Scheduler scheduler = null;
        
        switch (selected) {
            case "FCFS": scheduler = new FCFS(); break;
            case "SJF": scheduler = new SJF(); break;
            case "Priority": scheduler = new PriorityScheduler(); break;
            case "Round Robin": 
                RoundRobin rr = new RoundRobin();
                rr.setQuantum(2);
                scheduler = rr;
                break;
        }
        
        if (scheduler != null && !processes.isEmpty()) {
            String result = scheduler.schedule(processes);
            resultArea.setText(result);
            
            // Draw Gantt chart
            drawGanttChart(scheduler.getGanttChart());
        }
    }
    
    private List<Process> createSampleProcesses() {
        // Sample processes for testing
        List<Process> processes = new java.util.ArrayList<>();
        processes.add(new Process(1, "P1", 5, 0, 2));
        processes.add(new Process(2, "P2", 3, 2, 1));
        processes.add(new Process(3, "P3", 8, 4, 3));
        processes.add(new Process(4, "P4", 2, 6, 1));
        return processes;
    }
    
    private void drawGanttChart(List<String> ganttChart) {
        Graphics g = chartPanel.getGraphics();
        if (g != null) {
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, chartPanel.getWidth(), chartPanel.getHeight());
            
            g.setColor(Color.BLACK);
            g.setFont(new Font("Arial", Font.PLAIN, 10));
            
            int x = 10;
            int y = 30;
            
            for (String entry : ganttChart) {
                g.setColor(new Color(100, 150, 255));
                g.fillRect(x, y, 60, 30);
                g.setColor(Color.BLACK);
                g.drawRect(x, y, 60, 30);
                g.drawString(entry, x + 5, y + 20);
                
                x += 70;
            }
        }
    }
}