package gui;

import memory.MemoryManager;
import memory.MemoryVisualizer;
import model.Process;
import javax.swing.*;
import java.awt.*;
import java.util.Random;

public class MemoryPanel extends JPanel {
    private MemoryManager memoryManager;
    private MemoryVisualizer visualizer;
    private JComboBox<String> algorithmCombo;
    private JTextArea infoArea;
    private int processCounter = 1;
    
    public MemoryPanel() {
        memoryManager = new MemoryManager(1024); // 1MB total memory
        initComponents();
    }
    
    private void initComponents() {
        setLayout(new BorderLayout());
        
        // Control panel
        JPanel controlPanel = new JPanel(new FlowLayout());
        
        controlPanel.add(new JLabel("Algorithm:"));
        String[] algorithms = {"FirstFit", "BestFit", "WorstFit"};
        algorithmCombo = new JComboBox<>(algorithms);
        algorithmCombo.addActionListener(e -> updateAlgorithm());
        controlPanel.add(algorithmCombo);
        
        JButton allocBtn = new JButton("Allocate Random Process");
        allocBtn.addActionListener(e -> allocateRandomProcess());
        controlPanel.add(allocBtn);
        
        JButton deallocBtn = new JButton("Deallocate Random");
        deallocBtn.addActionListener(e -> deallocateRandomProcess());
        controlPanel.add(deallocBtn);
        
        JButton displayBtn = new JButton("Display Memory");
        displayBtn.addActionListener(e -> displayMemory());
        controlPanel.add(displayBtn);
        
        add(controlPanel, BorderLayout.NORTH);
        
        // Memory visualization
        visualizer = new MemoryVisualizer(memoryManager.getMemoryBlocks(), 1024);
        add(visualizer, BorderLayout.CENTER);
        
        // Information area
        infoArea = new JTextArea(5, 50);
        infoArea.setEditable(false);
        infoArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        add(new JScrollPane(infoArea), BorderLayout.SOUTH);
        
        // Initial display
        displayMemory();
    }
    
    private void updateAlgorithm() {
        String algo = (String) algorithmCombo.getSelectedItem();
        memoryManager.setAlgorithm(algo);
        infoArea.append("Algorithm changed to: " + algo + "\n");
    }
    
    private void allocateRandomProcess() {
        Random rand = new Random();
        int size = rand.nextInt(200) + 50; // 50-250KB
        Process p = new Process(processCounter++, "P" + processCounter, 0, 0, 0);
        
        if (memoryManager.allocateMemory(p, size)) {
            infoArea.append("✓ Allocated " + size + "KB to P" + p.getPid() + "\n");
        } else {
            infoArea.append("✗ Failed to allocate " + size + "KB\n");
        }
        
        refreshVisualization();
    }
    
    private void deallocateRandomProcess() {
        // In real implementation, track allocated processes
        // For demo, just display
        infoArea.append("Deallocate function would remove a process\n");
        refreshVisualization();
    }
    
    private void displayMemory() {
        infoArea.setText("");
        memoryManager.displayMemory();
        refreshVisualization();
    }
    
    private void refreshVisualization() {
        remove(visualizer);
        visualizer = new MemoryVisualizer(memoryManager.getMemoryBlocks(), 1024);
        add(visualizer, BorderLayout.CENTER);
        revalidate();
        repaint();
    }
}