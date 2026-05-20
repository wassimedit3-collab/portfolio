class AdminDashboard {
    constructor() {
        this.projects = [];
        this.mediaFiles = [];
        this.uploadQueue = [];
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDropZones();
        this.setupModal();
        this.loadData();
        this.updateStats();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.admin-content');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = item.dataset.section;

                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                sections.forEach(section => {
                    section.classList.add('hidden');
                    if (section.id === `${targetSection}-section`) {
                        section.classList.remove('hidden');
                    }
                });

                document.querySelector('.section-title').textContent = 
                    item.textContent.trim();
            });
        });
    }

    setupDropZones() {
        const quickDrop = document.getElementById('quick-drop');
        const quickInput = document.getElementById('quick-upload-input');
        const quickPreview = document.getElementById('quick-preview');
        const quickBtn = document.getElementById('quick-upload-btn');

        const mediaDrop = document.getElementById('media-drop');
        const mediaInput = document.getElementById('media-upload-input');

        this.setupDropZone(quickDrop, quickInput, quickPreview, quickBtn, 'quick');
        this.setupDropZone(mediaDrop, mediaInput, null, null, 'media');
    }

    setupDropZone(dropZone, input, preview, button, type) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('drag-over');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFiles(files, type, preview);
        });

        dropZone.addEventListener('click', () => {
            input.click();
        });

        input.addEventListener('change', (e) => {
            this.handleFiles(e.target.files, type, preview);
        });
    }

    handleFiles(files, type, preview) {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];

        Array.from(files).forEach(file => {
            if (validTypes.includes(file.type)) {
                this.uploadQueue.push(file);
                this.addToPreview(file, preview, type);
            } else {
                this.showToast(`Invalid file type: ${file.name}`, 'error');
            }
        });

        if (type === 'quick' && preview && preview.children.length > 0) {
            document.getElementById('quick-upload-btn').disabled = false;
        }
    }

    addToPreview(file, preview, type) {
        if (!preview) return;

        const item = document.createElement('div');
        item.className = 'preview-item';
        item.dataset.name = file.name;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                item.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <button class="remove-btn" data-name="${file.name}">×</button>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                item.innerHTML = `
                    <video src="${e.target.result}" muted></video>
                    <button class="remove-btn" data-name="${file.name}">×</button>
                `;
            };
            reader.readAsDataURL(file);
        }

        item.querySelector('.remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const name = e.target.dataset.name;
            this.uploadQueue = this.uploadQueue.filter(f => f.name !== name);
            item.remove();
            
            const previewEl = document.getElementById('quick-preview');
            if (previewEl.children.length === 0) {
                document.getElementById('quick-upload-btn').disabled = true;
            }
        });

        preview.appendChild(item);
    }

    setupModal() {
        const modal = document.getElementById('project-modal');
        const newProjectBtn = document.getElementById('new-project-btn');
        const closeBtn = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('cancel-project');
        const form = document.getElementById('project-form');
        const thumbUpload = document.getElementById('thumb-upload');
        const thumbInput = document.getElementById('thumbnail-input');

        newProjectBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        cancelBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });

        thumbUpload.addEventListener('click', () => {
            thumbInput.click();
        });

        thumbInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    thumbUpload.innerHTML = `
                        <img src="${ev.target.result}" style="max-width:100%;max-height:200px;border-radius:6px;">
                        <input type="file" id="thumbnail-input" accept="image/*" hidden>
                    `;
                    document.getElementById('thumbnail-input').addEventListener('change', arguments.callee);
                };
                reader.readAsDataURL(file);
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createProject();
        });
    }

    createProject() {
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-desc').value;
        const video = document.getElementById('project-video').value;
        const tags = document.getElementById('project-tags').value;
        const year = document.getElementById('project-year').value;

        const project = {
            id: Date.now(),
            title,
            description,
            video,
            tags: tags.split(',').map(t => t.trim()),
            year,
            thumbnail: null
        };

        this.projects.push(project);
        this.renderProjects();
        this.updateStats();

        document.getElementById('project-modal').classList.add('hidden');
        document.getElementById('project-form').reset();

        this.showToast('Project created successfully!', 'success');
    }

    renderProjects() {
        const grid = document.getElementById('projects-grid');
        grid.innerHTML = '';

        this.projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.id = project.id;

            card.innerHTML = `
                <div class="project-thumb">
                    ${project.thumbnail 
                        ? `<img src="${project.thumbnail}" alt="${project.title}">`
                        : `<div class="thumb-placeholder">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect x="4" y="4" width="24" height="24" rx="2" stroke="var(--accent)" stroke-width="1.5"/>
                                <circle cx="12" cy="12" r="3" stroke="var(--accent)" stroke-width="1.5"/>
                                <path d="M4 22l8-6 6 6 4-5 6 5" stroke="var(--accent)" stroke-width="1.5"/>
                            </svg>
                           </div>`
                    }
                </div>
                <div class="project-info">
                    <h4 class="project-title">${project.title}</h4>
                    <p class="project-meta">${project.year} • ${project.tags.join(', ')}</p>
                </div>
                <div class="project-actions">
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn delete-btn">Delete</button>
                </div>
            `;

            card.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteProject(project.id);
            });

            grid.appendChild(card);
        });
    }

    deleteProject(id) {
        this.projects = this.projects.filter(p => p.id !== id);
        this.renderProjects();
        this.updateStats();
        this.showToast('Project deleted', 'success');
    }

    loadData() {
        const savedProjects = localStorage.getItem('wv_projects');
        if (savedProjects) {
            this.projects = JSON.parse(savedProjects);
            this.renderProjects();
        }

        const savedMedia = localStorage.getItem('wv_media');
        if (savedMedia) {
            this.mediaFiles = JSON.parse(savedMedia);
            this.renderMedia();
        }
    }

    saveData() {
        localStorage.setItem('wv_projects', JSON.stringify(this.projects));
        localStorage.setItem('wv_media', JSON.stringify(this.mediaFiles));
    }

    updateStats() {
        document.getElementById('project-count').textContent = this.projects.length || '0';
        document.getElementById('media-count').textContent = this.mediaFiles.length || '0';
        
        const saved = localStorage.getItem('wv_last_update');
        if (saved) {
            const date = new Date(saved);
            document.getElementById('last-update').textContent = 
                date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    renderMedia() {
        const grid = document.getElementById('media-grid');
        grid.innerHTML = '';

        this.mediaFiles.forEach(file => {
            const item = document.createElement('div');
            item.className = 'media-item';

            if (file.type.startsWith('image/')) {
                item.innerHTML = `
                    <img src="${file.url}" alt="${file.name}">
                    <div class="media-overlay">
                        <span class="media-name">${file.name}</span>
                        <button class="media-delete" data-id="${file.id}">×</button>
                    </div>
                `;
            } else {
                item.innerHTML = `
                    <video src="${file.url}" muted></video>
                    <div class="media-overlay">
                        <span class="media-name">${file.name}</span>
                        <button class="media-delete" data-id="${file.id}">×</button>
                    </div>
                `;
            }

            item.querySelector('.media-delete').addEventListener('click', () => {
                this.deleteMedia(file.id);
            });

            grid.appendChild(item);
        });
    }

    deleteMedia(id) {
        this.mediaFiles = this.mediaFiles.filter(f => f.id !== id);
        this.renderMedia();
        this.saveData();
        this.showToast('Media deleted', 'success');
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});