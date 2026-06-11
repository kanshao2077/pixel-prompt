import { useEffect } from 'react';

interface PixelToastProps {
  message: string;
  onClose: () => void;
}

/**
 * 像素风提示框组件
 * 黑底白字,瞬间出现,停留 2 秒后瞬间消失
 */
export default function PixelToast({ message, onClose }: PixelToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pixel-toast">
      <div className="border-2 border-black bg-black text-white px-6 py-3 font-bold text-sm shadow-[4px_4px_0_#000]">
        {message}
      </div>
    </div>
  );
}
