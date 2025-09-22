import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { socketService } from '@/services/socketService';

export function useSocket() {
  const { user } = useAuth();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (user && !isInitialized.current) {
      socketService.connect(user.id);
      isInitialized.current = true;
    }

    return () => {
      if (isInitialized.current) {
        socketService.disconnect();
        isInitialized.current = false;
      }
    };
  }, [user]);

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.isSocketConnected(),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
    emit: socketService.sendEvent.bind(socketService)
  };
}

export function useSocketEvent(event, callback) {
  const { on, off } = useSocket();

  useEffect(() => {
    on(event, callback);
    
    return () => {
      off(event, callback);
    };
  }, [event, callback, on, off]);
}
