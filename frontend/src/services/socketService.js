import { io } from 'socket.io-client';
import { toast } from 'sonner';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(userId) {
    if (this.socket) {
      this.disconnect();
    }

    const serverUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5050';
    console.log('Connecting to Socket.IO server:', serverUrl);
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      if (userId) {
        this.joinRoom(userId);
      }
      
      toast.success('Connected to real-time updates');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
      this.handleReconnect();
    });

    // Listen for various real-time events
    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        if (this.socket) {
          this.socket.connect();
        }
      }, delay);
    } else {
      toast.error('Lost connection to server. Please refresh the page.');
    }
  }

  joinRoom(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinRoom', userId);
      console.log(`Joined room for user: ${userId}`);
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Issue-related events
    this.socket.on('issueCreated', (data) => {
      toast.success(`New issue created: ${data.title}`);
      this.emit('issueCreated', data);
    });

    this.socket.on('issueUpdated', (data) => {
      toast.info(`Issue updated: ${data.title}`);
      this.emit('issueUpdated', data);
    });

    this.socket.on('issueStatusChanged', (data) => {
      toast.info(`Issue ${data.title} is now ${data.status}`);
      this.emit('issueStatusChanged', data);
    });

    this.socket.on('commentAdded', (data) => {
      toast.info(`New comment on issue: ${data.issueTitle}`);
      this.emit('commentAdded', data);
    });

    // Repository-related events
    this.socket.on('repositoryCreated', (data) => {
      toast.success(`New repository created: ${data.name}`);
      this.emit('repositoryCreated', data);
    });

    this.socket.on('repositoryUpdated', (data) => {
      toast.info(`Repository updated: ${data.name}`);
      this.emit('repositoryUpdated', data);
    });

    this.socket.on('repositoryStarred', (data) => {
      toast.info(`${data.username} starred ${data.repositoryName}`);
      this.emit('repositoryStarred', data);
    });

    // User-related events
    this.socket.on('userFollowed', (data) => {
      toast.info(`${data.followerName} started following you`);
      this.emit('userFollowed', data);
    });

    this.socket.on('userUnfollowed', (data) => {
      toast.info(`${data.followerName} unfollowed you`);
      this.emit('userUnfollowed', data);
    });

    // General notifications
    this.socket.on('notification', (data) => {
      switch (data.type) {
        case 'success':
          toast.success(data.message);
          break;
        case 'error':
          toast.error(data.message);
          break;
        case 'info':
          toast.info(data.message);
          break;
        default:
          toast(data.message);
      }
      this.emit('notification', data);
    });
  }

  // Event emitter functionality for components to listen to socket events
  on(event, callback) {
    if (!this.eventListeners) {
      this.eventListeners = {};
    }
    
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    
    this.eventListeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.eventListeners || !this.eventListeners[event]) {
      return;
    }
    
    this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.eventListeners || !this.eventListeners[event]) {
      return;
    }
    
    this.eventListeners[event].forEach(callback => {
      callback(data);
    });
  }

  // Send events to server
  sendEvent(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  // Utility methods
  isSocketConnected() {
    return this.isConnected;
  }

  getSocket() {
    return this.socket;
  }
}

// Create a singleton instance
export const socketService = new SocketService();
export default socketService;
