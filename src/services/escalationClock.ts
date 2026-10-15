import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { timeoutCase } from './caseService';

export function useEscalationTimer(caseId: string | null) {
  const cases = useAppStore((state) => state.cases);
  const settings = useAppStore((state) => state.settings);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const currentCase = cases.find((c) => c.id === caseId);
  const isRouting = currentCase?.state === 'routing';

  useEffect(() => {
    if (!currentCase || !isRouting) {
      setSecondsLeft(null);
      return;
    }

    // Default window in seconds: 10 mins = 600s
    // With demo speed multiplier, effective seconds is divided by multiplier
    const totalWindowSec = (settings.acceptWindowMinutes || 10) * 60;
    const speed = settings.demoSpeedMultiplier || 1;

    // Calculate how long since case entered current offer
    const startTime = new Date(currentCase.createdAt).getTime();
    const elapsedRealSec = (Date.now() - startTime) / 1000;
    const elapsedVirtualSec = elapsedRealSec * speed;

    const remaining = Math.max(0, Math.round(totalWindowSec - elapsedVirtualSec));
    setSecondsLeft(remaining);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          // Trigger timeout
          timeoutCase(currentCase.id);
          return 0;
        }
        return prev - 1 * speed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [caseId, isRouting, currentCase?.currentOfferIndex, settings.demoSpeedMultiplier, settings.acceptWindowMinutes]);

  const handleSkipWait = async () => {
    if (currentCase) {
      await timeoutCase(currentCase.id);
    }
  };

  const formattedTime = () => {
    if (secondsLeft === null) return '--:--';
    const m = Math.floor(secondsLeft / 60);
    const s = Math.floor(secondsLeft % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    isRouting,
    secondsLeft,
    formattedTime: formattedTime(),
    skipWait: handleSkipWait,
    speedMultiplier: settings.demoSpeedMultiplier
  };
}
