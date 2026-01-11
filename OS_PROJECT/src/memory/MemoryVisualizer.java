package memory;

import model.MemoryBlock;
import javax.swing.*;
import java.awt.*;
import java.util.List;

public class MemoryVisualizer extends JPanel {
    private List<MemoryBlock> memoryBlocks;
    private int totalMemory;
    
    public MemoryVisualizer(List<MemoryBlock> blocks, int totalMemory) {
        this.memoryBlocks = blocks;
        this.totalMemory = totalMemory;
        setPreferredSize(new Dimension(600, 300));
        setBackground(Color.WHITE);
    }
    
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        
        int panelHeight = getHeight() - 40;
        int y = 20;
        int width = getWidth() - 40;
        
        // Draw memory title
        g.setColor(Color.BLACK);
        g.setFont(new Font("Arial", Font.BOLD, 14));
        g.drawString("Memory Visualization (" + totalMemory + " KB)", 20, 15);
        
        // Draw scale
        g.setFont(new Font("Arial", Font.PLAIN, 10));
        for (int i = 0; i <= 10; i++) {
            int xPos = 20 + (i * width / 10);
            int memValue = i * totalMemory / 10;
            g.drawLine(xPos, y + panelHeight, xPos, y + panelHeight + 5);
            g.drawString(memValue + "KB", xPos - 10, y + panelHeight + 15);
        }
        
        // Draw memory blocks
        for (MemoryBlock block : memoryBlocks) {
            int blockWidth = (int)((block.getSize() / (double)totalMemory) * width);
            int x = 20 + (int)((block.getStartAddress() / (double)totalMemory) * width);
            
            // Choose color based on allocation
            Color blockColor;
            if (block.isAllocated()) {
                blockColor = new Color(255, 100, 100); // Red for allocated
            } else {
                blockColor = new Color(100, 255, 100); // Green for free
            }
            
            // Draw block
            g.setColor(blockColor);
            g.fillRect(x, y, blockWidth, panelHeight);
            g.setColor(Color.BLACK);
            g.drawRect(x, y, blockWidth, panelHeight);
            
            // Draw block info
            g.setFont(new Font("Arial", Font.PLAIN, 10));
            String text = block.getBlockName() + " (" + block.getSize() + "KB)";
            if (text.length() > 15) text = text.substring(0, 15) + "...";
            
            // Rotate text if block is wide enough
            if (blockWidth > 30) {
                g.drawString(text, x + 5, y + panelHeight/2);
            }
        }
        
        // Draw legend
        drawLegend(g, y + panelHeight + 40);
    }
    
    private void drawLegend(Graphics g, int y) {
        g.setFont(new Font("Arial", Font.PLAIN, 12));
        
        g.setColor(new Color(255, 100, 100));
        g.fillRect(20, y, 15, 15);
        g.setColor(Color.BLACK);
        g.drawRect(20, y, 15, 15);
        g.drawString("Allocated Memory", 40, y + 12);
        
        g.setColor(new Color(100, 255, 100));
        g.fillRect(180, y, 15, 15);
        g.setColor(Color.BLACK);
        g.drawRect(180, y, 15, 15);
        g.drawString("Free Memory", 200, y + 12);
    }
}