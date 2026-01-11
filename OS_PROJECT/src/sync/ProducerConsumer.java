package sync;

import java.util.concurrent.Semaphore;

public class ProducerConsumer {
    private static final int BUFFER_SIZE = 5;
    private int[] buffer = new int[BUFFER_SIZE];
    private int in = 0, out = 0;
    
    private Semaphore mutex = new Semaphore(1);      // Mutual exclusion
    private Semaphore empty = new Semaphore(BUFFER_SIZE); // Count empty slots
    private Semaphore full = new Semaphore(0);       // Count full slots
    
    public ProducerConsumer() {
        System.out.println("=== Producer-Consumer Simulation ===");
        System.out.println("Buffer size: " + BUFFER_SIZE);
    }
    
    public void produce(int item) throws InterruptedException {
        empty.acquire();  // Wait if buffer is full
        mutex.acquire();  // Enter critical section
        
        buffer[in] = item;
        System.out.println("Producer produced: " + item + " at position " + in);
        in = (in + 1) % BUFFER_SIZE;
        
        mutex.release();  // Leave critical section
        full.release();   // Increment count of full slots
    }
    
    public int consume() throws InterruptedException {
        full.acquire();   // Wait if buffer is empty
        mutex.acquire();  // Enter critical section
        
        int item = buffer[out];
        System.out.println("Consumer consumed: " + item + " from position " + out);
        out = (out + 1) % BUFFER_SIZE;
        
        mutex.release();  // Leave critical section
        empty.release();  // Increment count of empty slots
        
        return item;
    }
    
    public void simulate() {
        // Create producer thread
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    produce(i);
                    Thread.sleep(500); // Simulate production time
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        // Create consumer thread
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    consume();
                    Thread.sleep(700); // Simulate consumption time
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        // Start threads
        producer.start();
        consumer.start();
        
        try {
            producer.join();
            consumer.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        System.out.println("Simulation completed!");
    }
}