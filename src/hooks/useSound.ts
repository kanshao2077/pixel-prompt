import { useCallback, useRef } from 'react';

/**
 * 音效类型定义
 */
export type SoundType = 'hover' | 'click' | 'copy';

/**
 * 音效播放钩子
 * 使用 Web Audio API 生成简单的像素风音效
 */
export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  // 初始化 AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  /**
   * 播放 Tick 音效 (悬停)
   * 极短的高频音,模拟老式菜单选择
   */
  const playTick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 800; // 高频
      oscillator.type = 'square'; // 方波,像素风

      gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (error) {
      // 静默失败,不影响用户体验
      console.debug('音效播放失败:', error);
    }
  }, [getAudioContext]);

  /**
   * 播放 Clack 音效 (点击/展开)
   * 清脆的机械键盘声
   */
  const playClack = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 400; // 中频
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    } catch (error) {
      console.debug('音效播放失败:', error);
    }
  }, [getAudioContext]);

  /**
   * 播放 Copy 音效 (复制成功)
   * 8-bit 获取道具音效,上升音阶
   */
  const playCopy = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'square';
      
      // 上升音阶: C5 -> E5 -> G5
      oscillator.frequency.setValueAtTime(523, ctx.currentTime);
      oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.08);
      oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.16);

      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.debug('音效播放失败:', error);
    }
  }, [getAudioContext]);

  /**
   * 统一播放接口
   */
  const play = useCallback((type: SoundType) => {
    switch (type) {
      case 'hover':
        playTick();
        break;
      case 'click':
        playClack();
        break;
      case 'copy':
        playCopy();
        break;
    }
  }, [playTick, playClack, playCopy]);

  return { play };
};
