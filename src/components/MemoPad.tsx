import { useState, useEffect, useRef } from 'react';
import { getMemo, saveMemo } from '@/utils/storage';

export default function MemoPad() {
  const [memo, setMemo] = useState('');
  // @ts-ignore - window.setTimeout returns number in browser
  const timeoutRef = useRef<number>();

  // 初始化加载
  useEffect(() => {
    setMemo(getMemo());
  }, []);

  // 自动保存 (防抖)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMemo(value);

    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 300ms 后保存
    timeoutRef.current = window.setTimeout(() => {
      saveMemo(value);
    }, 300);
  };

  return (
    <div className="border-2 border-dashed border-black bg-white p-4">
      <div className="border-b-2 border-black pb-2 mb-3">
        <h3 className="font-bold text-[15px]">{"[ 灵感碎片-MEMO ]"}</h3>
      </div>
      <textarea
        value={memo}
        onChange={handleChange}
        placeholder="记录你的冒险灵感..."
        className="w-full h-32 p-2 border-2 border-black bg-white resize-none focus:outline-none focus:border-dashed focus:border-black text-sm placeholder:opacity-60 placeholder:text-[#aaa]"
        style={{ caretColor: '#000' }}
      />
    </div>
  );
}
