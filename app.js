// BLE Configuration
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

// Global variables
let bleDevice = null;
let bleCharacteristic = null;
let isConnected = false;
let currentSpeed = 200;

// Expose isConnected to window for cross-file access
window.isConnected = false;

// DOM Elements
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const increaseSpeed = document.getElementById('increaseSpeed');
const decreaseSpeed = document.getElementById('decreaseSpeed');

// Control buttons
const btnForward = document.getElementById('btnForward');
const btnBackward = document.getElementById('btnBackward');
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const btnStop = document.getElementById('btnStop');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateSpeedDisplay();
});

// Event Listeners
function initializeEventListeners() {
    // Connection buttons
    connectBtn.addEventListener('click', connectBLE);
    disconnectBtn.addEventListener('click', disconnectBLE);

    // Speed controls
    speedSlider.addEventListener('input', (e) => {
        const newSpeed = parseInt(e.target.value);
        const diff = newSpeed - currentSpeed;
        currentSpeed = newSpeed;
        updateSpeedDisplay();

        // Send speed change command to ESP32
        if (diff > 0) {
            const steps = Math.floor(diff / 25);
            for (let i = 0; i < steps; i++) {
                sendCommand('+');
            }
        } else if (diff < 0) {
            const steps = Math.floor(Math.abs(diff) / 25);
            for (let i = 0; i < steps; i++) {
                sendCommand('-');
            }
        }
    });

    increaseSpeed.addEventListener('click', () => {
        currentSpeed = Math.min(255, currentSpeed + 25);
        speedSlider.value = currentSpeed;
        updateSpeedDisplay();
        sendCommand('+');
    });

    decreaseSpeed.addEventListener('click', () => {
        currentSpeed = Math.max(0, currentSpeed - 25);
        speedSlider.value = currentSpeed;
        updateSpeedDisplay();
        sendCommand('-');
    });

    // Control buttons
    btnForward.addEventListener('touchstart', (e) => {
        e.preventDefault();
        sendCommand('F');
    });
    btnForward.addEventListener('mousedown', () => sendCommand('F'));
    btnForward.addEventListener('touchend', (e) => {
        e.preventDefault();
        sendCommand('S');
    });
    btnForward.addEventListener('mouseup', () => sendCommand('S'));

    btnBackward.addEventListener('touchstart', (e) => {
        e.preventDefault();
        sendCommand('B');
    });
    btnBackward.addEventListener('mousedown', () => sendCommand('B'));
    btnBackward.addEventListener('touchend', (e) => {
        e.preventDefault();
        sendCommand('S');
    });
    btnBackward.addEventListener('mouseup', () => sendCommand('S'));

    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        sendCommand('L');
    });
    btnLeft.addEventListener('mousedown', () => sendCommand('L'));
    btnLeft.addEventListener('touchend', (e) => {
        e.preventDefault();
        sendCommand('S');
    });
    btnLeft.addEventListener('mouseup', () => sendCommand('S'));

    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        sendCommand('R');
    });
    btnRight.addEventListener('mousedown', () => sendCommand('R'));
    btnRight.addEventListener('touchend', (e) => {
        e.preventDefault();
        sendCommand('S');
    });
    btnRight.addEventListener('mouseup', () => sendCommand('S'));

    btnStop.addEventListener('click', () => sendCommand('S'));
}

// BLE Functions
async function connectBLE() {
    try {
        // Check if Web Bluetooth is supported
        if (!navigator.bluetooth) {
            alert('Web Bluetooth không được hỗ trợ trên trình duyệt này.\n\nVui lòng sử dụng:\n- Chrome/Edge (Android)\n- Safari (iOS 16.4+)');
            return;
        }

        updateStatus('Đang tìm kiếm...', false);

        // Request BLE device
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'ESP32_CAR' }],
            optionalServices: [SERVICE_UUID]
        });

        updateStatus('Đang kết nối...', false);

        // Connect to GATT server
        const server = await bleDevice.gatt.connect();

        // Get service and characteristic
        const service = await server.getPrimaryService(SERVICE_UUID);
        bleCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        // Handle disconnection
        bleDevice.addEventListener('gattserverdisconnected', onDisconnected);

        isConnected = true;
        window.isConnected = true;
        updateStatus('Đã kết nối', true);
        updateUIState(true);

        console.log('Connected to ESP32_CAR');

    } catch (error) {
        console.error('Connection error:', error);
        updateStatus('Kết nối thất bại', false);

        if (error.name === 'NotFoundError') {
            alert('Không tìm thấy ESP32_CAR.\nVui lòng kiểm tra:\n- Xe đã bật chưa?\n- Bluetooth đã bật chưa?');
        } else {
            alert('Lỗi kết nối: ' + error.message);
        }
    }
}

function disconnectBLE() {
    if (bleDevice && bleDevice.gatt.connected) {
        bleDevice.gatt.disconnect();
        console.log('Disconnected from ESP32_CAR');
    }
}

function onDisconnected() {
    isConnected = false;
    window.isConnected = false;
    // Try to send stop command, but don't wait since we're disconnecting
    if (bleCharacteristic) {
        sendCommand('S').catch(() => { });
    }
    bleCharacteristic = null;
    updateStatus('Chưa kết nối', false);
    updateUIState(false);
    console.log('Device disconnected');
}

// Send command to ESP32
async function sendCommand(command) {
    if (!isConnected || !bleCharacteristic) {
        console.warn('Not connected, cannot send command:', command);
        return;
    }

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(command);
        await bleCharacteristic.writeValue(data);
        console.log('Sent command:', command);
    } catch (error) {
        console.error('Error sending command:', error);
    }
}

// UI Update Functions
function updateStatus(message, connected) {
    statusText.textContent = message;
    if (connected) {
        statusIndicator.classList.add('connected');
    } else {
        statusIndicator.classList.remove('connected');
    }
}

function updateUIState(connected) {
    if (connected) {
        connectBtn.classList.add('hidden');
        disconnectBtn.classList.remove('hidden');

        // Enable manual mode controls
        speedSlider.disabled = false;
        increaseSpeed.disabled = false;
        decreaseSpeed.disabled = false;
        btnForward.disabled = false;
        btnBackward.disabled = false;
        btnLeft.disabled = false;
        btnRight.disabled = false;
        btnStop.disabled = false;

        // Enable programming mode controls if there are blocks
        const playBtn = document.getElementById('playBtn');
        const stopBtn = document.getElementById('stopBtn');
        if (playBtn && commandSequence && commandSequence.length > 0) {
            playBtn.disabled = false;
        }
    } else {
        connectBtn.classList.remove('hidden');
        disconnectBtn.classList.add('hidden');

        // Disable manual mode controls
        speedSlider.disabled = true;
        increaseSpeed.disabled = true;
        decreaseSpeed.disabled = true;
        btnForward.disabled = true;
        btnBackward.disabled = true;
        btnLeft.disabled = true;
        btnRight.disabled = true;
        btnStop.disabled = true;

        // Disable programming mode controls
        const playBtn = document.getElementById('playBtn');
        const stopBtn = document.getElementById('stopBtn');
        if (playBtn) playBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = true;
    }
}

function updateSpeedDisplay() {
    speedValue.textContent = currentSpeed;
}

// Prevent pull-to-refresh and other default behaviors on mobile
document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('.control-btn')) {
        e.preventDefault();
    }
}, { passive: false });
