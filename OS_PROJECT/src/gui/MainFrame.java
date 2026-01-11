package gui;

import javax.swing.*;
import java.awt.*;

public class MainFrame extends JFrame {
    private JTabbedPane tabbedPane;
    
    public MainFrame() {
        setTitle("OS Simulator - ICA24/ICB24/ICC24/ICE24/ICF24/ICG24");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1000, 700);
        setLocationRelativeTo(null);
        
        initComponents();
    }
    
    private void initComponents() {
        tabbedPane = new JTabbedPane();
        
        // Create panels for each module
        ProcessTablePanel processPanel = new ProcessTablePanel();
        GanttChartPanel ganttPanel = new GanttChartPanel();
        MemoryPanel memoryPanel = new MemoryPanel();
        
        tabbedPane.addTab("📋 Process Management", processPanel);
        tabbedPane.addTab("⏰ CPU Scheduling", ganttPanel);
        tabbedPane.addTab("💾 Memory Management", memoryPanel);
        
        add(tabbedPane, BorderLayout.CENTER);
        
        // Add status bar
        JPanel statusBar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        statusBar.add(new JLabel("Status: Ready"));
        add(statusBar, BorderLayout.SOUTH);
    }
}