import { useCallback, useState } from 'react';

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = useCallback(() => {}, []);
  const playHoverSound = useCallback(() => {}, []);
  const playClickSound = useCallback(() => {}, []);
  const playSuccessSound = useCallback(() => {}, []);
  const playBotMessageSound = useCallback(() => {}, []);

  return {
    isMuted,
    toggleMute,
    playHoverSound,
    playClickSound,
    playSuccessSound,
    playBotMessageSound
  };
}
