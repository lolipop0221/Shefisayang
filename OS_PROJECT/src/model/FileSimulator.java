package model;

import java.util.*;

public class FileSimulator {
    private Map<String, String> files; // filename -> content
    private Map<String, List<String>> directories; // dirname -> list of files
    
    public FileSimulator() {
        files = new HashMap<>();
        directories = new HashMap<>();
        directories.put("root", new ArrayList<>());
    }
    
    public boolean createFile(String filename, String content) {
        if (!files.containsKey(filename)) {
            files.put(filename, content);
            directories.get("root").add(filename);
            System.out.println("File created: " + filename);
            return true;
        }
        return false;
    }
    
    public String readFile(String filename) {
        return files.getOrDefault(filename, "File not found!");
    }
    
    public boolean writeFile(String filename, String content) {
        if (files.containsKey(filename)) {
            files.put(filename, content);
            System.out.println("File updated: " + filename);
            return true;
        }
        return false;
    }
    
    public boolean deleteFile(String filename) {
        if (files.containsKey(filename)) {
            files.remove(filename);
            directories.get("root").remove(filename);
            System.out.println("File deleted: " + filename);
            return true;
        }
        return false;
    }
    
    public void listFiles() {
        System.out.println("\n=== FILE SYSTEM ===");
        for (String file : files.keySet()) {
            System.out.println("📄 " + file + " | Size: " + files.get(file).length() + " chars");
        }
    }
    
    public void createDirectory(String dirname) {
        if (!directories.containsKey(dirname)) {
            directories.put(dirname, new ArrayList<>());
            System.out.println("Directory created: " + dirname);
        }
    }
}