package gui;

import model.Process;
import model.PCB;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class ProcessTablePanel extends JPanel {
    private DefaultTableModel tableModel;
    private JTable processTable;
    private List<Process> processes;
    private List<PCB> pcbs;
    private int nextPid = 1;
    
    public ProcessTablePanel() {
        processes = new ArrayList<>();
        pcbs = new ArrayList<>();
        
        setLayout(new BorderLayout());
        initTable();
        initControls();
        
        // Add sample data
        addSampleProcesses();
    }
    
    private void initTable() {
        String[] columns = {"PID", "Name", "Arrival Time", "Burst Time", "Priority", "Status"};
        tableModel = new DefaultTableModel(columns, 0);
        processTable = new JTable(tableModel);
        
        JScrollPane scrollPane = new JScrollPane(processTable);
        add(scrollPane, BorderLayout.CENTER);
    }
    
    private void initControls() {
        JPanel controlPanel = new JPanel(new FlowLayout());
        
        JButton addBtn = new JButton("Add Process");
        JButton removeBtn = new JButton("Remove Selected");
        JButton showPCB = new JButton("Show PCB");
        JButton clearBtn = new JButton("Clear All");
        
        addBtn.addActionListener(e -> showAddProcessDialog());
        removeBtn.addActionListener(e -> removeSelectedProcess());
        showPCB.addActionListener(e -> showSelectedPCB());
        clearBtn.addActionListener(e -> clearAllProcesses());
        
        controlPanel.add(addBtn);
        controlPanel.add(removeBtn);
        controlPanel.add(showPCB);
        controlPanel.add(clearBtn);
        
        add(controlPanel, BorderLayout.SOUTH);
    }
    
    private void showAddProcessDialog() {
        JDialog dialog = new JDialog((Frame)SwingUtilities.getWindowAncestor(this), "Add New Process", true);
        dialog.setLayout(new GridLayout(6, 2, 5, 5));
        
        dialog.add(new JLabel("Burst Time:"));
        JTextField burstField = new JTextField("5");
        dialog.add(burstField);
        
        dialog.add(new JLabel("Arrival Time:"));
        JTextField arrivalField = new JTextField("0");
        dialog.add(arrivalField);
        
        dialog.add(new JLabel("Priority:"));
        JTextField priorityField = new JTextField("1");
        dialog.add(priorityField);
        
        JButton addBtn = new JButton("Add");
        JButton cancelBtn = new JButton("Cancel");
        
        addBtn.addActionListener(e -> {
            try {
                int burst = Integer.parseInt(burstField.getText());
                int arrival = Integer.parseInt(arrivalField.getText());
                int priority = Integer.parseInt(priorityField.getText());
                
                Process p = new Process(nextPid++, "P" + nextPid, burst, arrival, priority);
                PCB pcb = new PCB(p);
                
                processes.add(p);
                pcbs.add(pcb);
                updateTable();
                
                dialog.dispose();
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(dialog, "Please enter valid numbers!");
            }
        });
        
        cancelBtn.addActionListener(e -> dialog.dispose());
        
        dialog.add(addBtn);
        dialog.add(cancelBtn);
        
        dialog.setSize(300, 200);
        dialog.setLocationRelativeTo(this);
        dialog.setVisible(true);
    }
    
    private void addSampleProcesses() {
        processes.add(new Process(1, "P1", 5, 0, 2));
        processes.add(new Process(2, "P2", 3, 2, 1));
        processes.add(new Process(3, "P3", 8, 4, 3));
        processes.add(new Process(4, "P4", 2, 6, 1));
        
        for (Process p : processes) {
            pcbs.add(new PCB(p));
        }
        
        updateTable();
    }
    
    private void updateTable() {
        tableModel.setRowCount(0);
        for (Process p : processes) {
            tableModel.addRow(new Object[]{
                p.getPid(),
                p.getName(),
                p.getArrivalTime(),
                p.getBurstTime(),
                p.getPriority(),
                p.getStatus()
            });
        }
    }
    
    private void removeSelectedProcess() {
        int row = processTable.getSelectedRow();
        if (row >= 0) {
            processes.remove(row);
            pcbs.remove(row);
            updateTable();
        }
    }
    
    private void showSelectedPCB() {
        int row = processTable.getSelectedRow();
        if (row >= 0) {
            PCB pcb = pcbs.get(row);
            JTextArea textArea = new JTextArea();
            textArea.setEditable(false);
            textArea.append("=== PCB Details ===\n");
            textArea.append("Process ID: " + pcb.getProcess().getPid() + "\n");
            textArea.append("Status: " + pcb.getProcess().getStatus() + "\n");
            textArea.append("Program Counter: " + pcb.getProgramCounter() + "\n");
            
            JOptionPane.showMessageDialog(this, textArea, "PCB Information", JOptionPane.INFORMATION_MESSAGE);
        }
    }
    
    private void clearAllProcesses() {
        processes.clear();
        pcbs.clear();
        nextPid = 1;
        updateTable();
    }
    
    public List<Process> getProcesses() {
        return processes;
    }
}