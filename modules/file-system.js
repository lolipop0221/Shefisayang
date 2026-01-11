/**
 * File System Module (Optional)
 * Simulates basic file operations
 */

const FileSystem = (function() {
    let fileSystem = {
        root: {
            name: '/',
            type: 'directory',
            children: [],
            size: 0
        }
    };
    
    let currentDirectory = fileSystem.root;
    
    class File {
        constructor(name, content = '', size = 0) {
            this.name = name;
            this.type = 'file';
            this.content = content;
            this.size = size || content.length;
            this.created = new Date();
            this.modified = new Date();
        }
        
        write(content) {
            this.content = content;
            this.size = content.length;
            this.modified = new Date();
        }
        
        read() {
            return this.content;
        }
    }
    
    class Directory {
        constructor(name) {
            this.name = name;
            this.type = 'directory';
            this.children = [];
            this.size = 0;
            this.created = new Date();
        }
        
        addChild(child) {
            this.children.push(child);
            this.updateSize();
        }
        
        removeChild(name) {
            this.children = this.children.filter(child => child.name !== name);
            this.updateSize();
        }
        
        updateSize() {
            this.size = this.children.reduce((sum, child) => sum + child.size, 0);
        }
        
        getChild(name) {
            return this.children.find(child => child.name === name);
        }
    }
    
    return {
        /**
         * Initialize file system
         */
        init: function() {
            fileSystem = {
                root: new Directory('/')
            };
            currentDirectory = fileSystem.root;
            
            // Add some sample files and directories
            this.createFile('readme.txt', 'Welcome to OS File System Simulator');
            this.createDirectory('documents');
            this.createDirectory('pictures');
            
            console.log('File system initialized');
        },
        
        /**
         * Create a file
         */
        createFile: function(name, content = '') {
            if (this.findItem(name)) {
                console.log(`File ${name} already exists`);
                return null;
            }
            
            const file = new File(name, content);
            currentDirectory.addChild(file);
            return file;
        },
        
        /**
         * Create a directory
         */
        createDirectory: function(name) {
            if (this.findItem(name)) {
                console.log(`Directory ${name} already exists`);
                return null;
            }
            
            const dir = new Directory(name);
            currentDirectory.addChild(dir);
            return dir;
        },
        
        /**
         * Read file content
         */
        readFile: function(name) {
            const file = this.findItem(name);
            if (!file || file.type !== 'file') {
                console.log(`File ${name} not found`);
                return null;
            }
            
            return file.read();
        },
        
        /**
         * Write to file
         */
        writeFile: function(name, content) {
            const file = this.findItem(name);
            if (!file || file.type !== 'file') {
                console.log(`File ${name} not found`);
                return false;
            }
            
            file.write(content);
            return true;
        },
        
        /**
         * Delete file or directory
         */
        deleteItem: function(name) {
            const item = this.findItem(name);
            if (!item) {
                console.log(`${name} not found`);
                return false;
            }
            
            currentDirectory.removeChild(name);
            return true;
        },
        
        /**
         * Find item in current directory
         */
        findItem: function(name) {
            return currentDirectory.getChild(name);
        },
        
        /**
         * Change directory
         */
        changeDirectory: function(name) {
            if (name === '..') {
                // Go to parent (simplified - always go to root in this simple implementation)
                currentDirectory = fileSystem.root;
                return true;
            }
            
            const dir = this.findItem(name);
            if (!dir || dir.type !== 'directory') {
                console.log(`Directory ${name} not found`);
                return false;
            }
            
            currentDirectory = dir;
            return true;
        },
        
        /**
         * List directory contents
         */
        listDirectory: function() {
            return currentDirectory.children.map(child => ({
                name: child.name,
                type: child.type,
                size: child.size,
                modified: child.modified || child.created
            }));
        },
        
        /**
         * Get current path
         */
        getCurrentPath: function() {
            let path = currentDirectory.name;
            // Simplified path tracking
            return path === '/' ? '/' : `/${currentDirectory.name}`;
        },
        
        /**
         * Get file system tree for display
         */
        getFileSystemTree: function() {
            return this.buildTree(fileSystem.root, 0);
        },
        
        /**
         * Recursively build tree structure
         */
        buildTree: function(node, depth) {
            const indent = '  '.repeat(depth);
            let result = `${indent}${node.name} (${node.type}, ${node.size} bytes)\n`;
            
            if (node.type === 'directory' && node.children) {
                node.children.forEach(child => {
                    result += this.buildTree(child, depth + 1);
                });
            }
            
            return result;
        },
        
        /**
         * Render file system UI
         */
        renderFileSystem: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const items = this.listDirectory();
            const path = this.getCurrentPath();
            
            let html = `
                <div class="card">
                    <div class="card-header">
                        <i class="bi bi-folder"></i> File System - Current: ${path}
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <button class="btn btn-sm btn-primary" onclick="FileSystem.createSampleFiles()">
                                <i class="bi bi-plus"></i> Create Sample
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="FileSystem.init()">
                                <i class="bi bi-arrow-clockwise"></i> Reset
                            </button>
                        </div>
                        
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Size</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
            `;
            
            items.forEach(item => {
                html += `
                    <tr>
                        <td>
                            <i class="bi ${item.type === 'file' ? 'bi-file-text' : 'bi-folder'}"></i>
                            ${item.name}
                        </td>
                        <td><span class="badge ${item.type === 'file' ? 'bg-info' : 'bg-warning'}">${item.type}</span></td>
                        <td>${item.size} bytes</td>
                        <td>
                            ${item.type === 'file' ? 
                                `<button class="btn btn-sm btn-outline-success" onclick="FileSystem.readFile('${item.name}')">
                                    <i class="bi bi-eye"></i> Read
                                </button>` : 
                                `<button class="btn btn-sm btn-outline-primary" onclick="FileSystem.changeDirectory('${item.name}')">
                                    <i class="bi bi-folder2-open"></i> Open
                                </button>`
                            }
                            <button class="btn btn-sm btn-outline-danger" onclick="FileSystem.deleteItem('${item.name}')">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            html += `
                                </tbody>
                            </table>
                        </div>
                        
                        <hr>
                        
                        <h6>Create New:</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="input-group mb-2">
                                    <input type="text" class="form-control" id="newFileName" placeholder="Filename">
                                    <button class="btn btn-success" onclick="FileSystem.createFileUI()">
                                        <i class="bi bi-file-plus"></i> Create File
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="input-group mb-2">
                                    <input type="text" class="form-control" id="newDirName" placeholder="Directory name">
                                    <button class="btn btn-warning" onclick="FileSystem.createDirectoryUI()">
                                        <i class="bi bi-folder-plus"></i> Create Directory
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
        },
        
        /**
         * UI wrapper for create file
         */
        createFileUI: function() {
            const name = document.getElementById('newFileName').value;
            if (!name) {
                alert('Enter file name');
                return;
            }
            
            const content = prompt('Enter file content:', 'Sample content');
            if (content !== null) {
                this.createFile(name, content);
                this.renderFileSystem('fileSystemContainer');
            }
        },
        
        /**
         * UI wrapper for create directory
         */
        createDirectoryUI: function() {
            const name = document.getElementById('newDirName').value;
            if (!name) {
                alert('Enter directory name');
                return;
            }
            
            this.createDirectory(name);
            this.renderFileSystem('fileSystemContainer');
        },
        
        /**
         * UI wrapper for read file
         */
        readFileUI: function(name) {
            const content = this.readFile(name);
            if (content !== null) {
                alert(`Content of ${name}:\n\n${content}`);
            }
        },
        
        /**
         * Create sample files for demonstration
         */
        createSampleFiles: function() {
            this.createFile('document.txt', 'This is a sample text document.');
            this.createFile('data.csv', 'id,name,value\n1,ProcessA,10\n2,ProcessB,20');
            this.createDirectory('system');
            this.createDirectory('users');
            
            // Change to system directory and add files
            const oldDir = currentDirectory;
            this.changeDirectory('system');
            this.createFile('config.ini', '[OS]\nversion=1.0\nsimulator=true');
            currentDirectory = oldDir; // Return to original
            
            this.renderFileSystem('fileSystemContainer');
            console.log('Sample files created');
        }
    };
})();