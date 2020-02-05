export function swing(p: number): number {
  return 0.5 - Math.cos(p * Math.PI) / 2;
}

export async function adjustVolume(
  element: HTMLMediaElement,
  newVolume: number,
  {
    duration = 1000,
    easing = swing,
    interval = 13
  }: {
    duration?: number;
    easing?: typeof swing;
    interval?: number;
  } = {}
): Promise<void> {
  const originalVolume = element.volume;
  const delta = newVolume - originalVolume;
  if (!delta || !duration || !easing || !interval) {
    element.volume = newVolume;
    return Promise.resolve();
  }
  const ticks = Math.floor(duration / interval);
  let tick = 1;
  return new Promise<void>(resolve => {
    const timer = setInterval(() => {
      element.volume = originalVolume + easing(tick / ticks) * delta;
      if (++tick === ticks) {
        clearInterval(timer);
        resolve();
      }
    }, interval);
  });
}
