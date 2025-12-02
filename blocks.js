// Block Programming Logic
let commandSequence = [];
let isExecuting = false;
let isPaused = false;
let currentBlockIndex = 0;

// Block metadata
const blockTypes = {
    'F': { name: 'Tiến', icon: '⬆️', class: 'block-forward', defaultDuration: 1000 },
    'B': { name: 'Lùi', icon: '⬇️', class: 'block-backward', defaultDuration: 1000 },
    'L': { name: 'Trái', icon: '⬅️', class: 'block-left', defaultDuration: 500 },
    'R': { name: 'Phải', icon: '➡️', class: 'block-right', defaultDuration: 500 },
    'S': { name: 'Dừng', icon: '⏹️', class: 'block-stop', defaultDuration: 500 },
    'W': { name: 'Chờ', icon: '⏱️', class: 'block-wait', defaultDuration: 1000 }
};

// Initialize block programming
function initializeBlockProgramming() {
    // Palette block clicks - add to sequence
    document.querySelectorAll('.palette-block').forEach(block => {
        block.addEventListener('click', () => {
            const type = block.dataset.type;
            addBlockToSequence(type);
        });
    });

    // Clear button
    document.getElementById('clearBtn').addEventListener('click', clearSequence);

    // Execution controls
    document.getElementById('playBtn').addEventListener('click', executeSequence);
    document.getElementById('pauseBtn').addEventListener('click', pauseExecution);
    document.getElementById('stopBtn').addEventListener('click', stopExecution);
}

// Add block to sequence
function addBlockToSequence(type) {
    const blockData = blockTypes[type];
    if (!blockData) return;

    const block = {
        id: Date.now(),
        type: type,
        duration: blockData.defaultDuration
    };

    commandSequence.push(block);
    renderSequence();
    updateProgress();
}

// Render sequence in workspace
function renderSequence() {
    const container = document.getElementById('sequenceContainer');

    if (commandSequence.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
                <p>Nhấn vào khối lệnh để thêm</p>
            </div>
        `;
        document.getElementById('playBtn').disabled = true;
        document.getElementById('stopBtn').disabled = true;
        return;
    }

    const blocksHTML = commandSequence.map((block, index) => {
        const meta = blockTypes[block.type];
        return `
            <div class="sequence-block ${meta.class}" data-id="${block.id}">
                <div class="block-number">${index + 1}</div>
                <div class="block-content">
                    <div class="block-icon">${meta.icon}</div>
                    <div class="block-name">${meta.name}</div>
                </div>
                <div class="block-duration">
                    <input type="number" 
                           class="duration-input" 
                           value="${block.duration}" 
                           min="100" 
                           step="100"
                           data-id="${block.id}">
                    <span class="duration-label">ms</span>
                </div>
                <button class="btn-delete" data-id="${block.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `;
    }).join('');

    container.innerHTML = `<div class="sequence-blocks">${blocksHTML}</div>`;

    // Attach event listeners
    container.querySelectorAll('.duration-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const block = commandSequence.find(b => b.id === id);
            if (block) {
                block.duration = parseInt(e.target.value);
            }
        });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            removeBlock(id);
        });
    });

    // Only enable play button if connected to BLE
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.disabled = !(window.isConnected === true);
    }
}

// Remove block
function removeBlock(id) {
    commandSequence = commandSequence.filter(b => b.id !== id);
    renderSequence();
    updateProgress();
}

// Clear all blocks
function clearSequence() {
    if (isExecuting) {
        stopExecution();
    }
    commandSequence = [];
    renderSequence();
    updateProgress();
}

// Update progress display
function updateProgress() {
    const text = isExecuting
        ? `${currentBlockIndex}/${commandSequence.length} khối`
        : `${commandSequence.length} khối`;
    document.getElementById('progressText').textContent = text;
}

// Execute sequence
async function executeSequence() {
    if (commandSequence.length === 0 || isExecuting) return;

    // Check if connected to BLE
    if (!window.isConnected) {
        alert('Vui lòng kết nối BLE trước khi chạy chương trình!');
        return;
    }

    isExecuting = true;
    isPaused = false;
    currentBlockIndex = 0;

    try {
        // Update UI
        document.getElementById('playBtn').classList.add('hidden');
        document.getElementById('pauseBtn').classList.remove('hidden');
        document.getElementById('stopBtn').disabled = false;

        // Execute each block
        for (let i = 0; i < commandSequence.length; i++) {
            if (!isExecuting) break;

            // Wait if paused
            while (isPaused && isExecuting) {
                await sleep(100);
            }

            if (!isExecuting) break;

            currentBlockIndex = i + 1;
            updateProgress();

            const block = commandSequence[i];
            await executeBlock(block, i);
        }
    } catch (error) {
        console.error('Error executing sequence:', error);
        alert('Lỗi khi thực thi chuỗi lệnh: ' + error.message);
    } finally {
        // Finish
        stopExecution();
    }
}

// Execute single block
async function executeBlock(block, index) {
    try {
        // Highlight current block
        const blocks = document.querySelectorAll('.sequence-block');
        blocks.forEach(b => b.classList.remove('executing'));
        if (blocks[index]) {
            blocks[index].classList.add('executing');
        }

        // Send command (unless it's a wait block)
        if (block.type !== 'W') {
            await sendCommand(block.type);
        }

        // Wait for duration
        await sleep(block.duration);

        // Send stop after move commands (except Stop and Wait)
        if (block.type !== 'S' && block.type !== 'W') {
            await sendCommand('S');
        }

        // Remove highlight
        if (blocks[index]) {
            blocks[index].classList.remove('executing');
        }
    } catch (error) {
        console.error('Error executing block:', error);
        throw error; // Re-throw to be caught by executeSequence
    }
}

// Pause execution
function pauseExecution() {
    if (!isExecuting) return;
    isPaused = !isPaused;

    const pauseBtn = document.getElementById('pauseBtn');
    if (isPaused) {
        pauseBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
            Tiếp tục
        `;
    } else {
        pauseBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
            Tạm dừng
        `;
    }
}

// Stop execution
async function stopExecution() {
    isExecuting = false;
    isPaused = false;
    currentBlockIndex = 0;

    // Remove all highlights
    document.querySelectorAll('.sequence-block').forEach(b => {
        b.classList.remove('executing');
    });

    // Update UI
    document.getElementById('playBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').classList.add('hidden');
    document.getElementById('pauseBtn').innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
        </svg>
        Tạm dừng
    `;
    document.getElementById('stopBtn').disabled = true;

    // Send stop command to car
    if (window.isConnected) {
        await sendCommand('S');
    }

    updateProgress();
}

// Sleep helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
