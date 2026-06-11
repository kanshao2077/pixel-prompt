import { useState, useRef, useEffect } from 'react';
import { Prompt } from '@/types/prompt';
import { updatePrompt, deletePrompt } from '@/utils/storage';
import { useSound } from '@/hooks/useSound';

interface PromptCardProps {
  prompt: Prompt;
  onDelete: () => void;
  isDragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
  isWelcomeCard?: boolean;
  autoExpand?: boolean;
  clearAutoExpand?: () => void;
  onExpandChange?: (expanded: boolean) => void;
}

export default function PromptCard({ 
  prompt, 
  onDelete, 
  isDragging = false,
  dragHandleProps,
  isWelcomeCard = false,
  autoExpand = false,
  clearAutoExpand,
  onExpandChange
}: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState(prompt.title);
  const [desc, setDesc] = useState(prompt.desc);
  const [content, setContent] = useState(prompt.content);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 音效钩子
  const { play } = useSound();

  // 点击外部自动折叠
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        onExpandChange?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, onExpandChange]);

  // 同步 props 变化
  useEffect(() => {
    setTitle(prompt.title);
    setDesc(prompt.desc);
    setContent(prompt.content);
  }, [prompt]);

  // 自动展开新建的卡片
  useEffect(() => {
    if (autoExpand) {
      setIsExpanded(true);
      clearAutoExpand?.();
      // 自动聚焦到标题输入框
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    }
  }, [autoExpand, clearAutoExpand]);

  // 自动保存标题
  const handleTitleBlur = () => {
    if (title !== prompt.title) {
      updatePrompt(prompt.id, { title });
    }
  };

  // 自动保存描述
  const handleDescBlur = () => {
    if (desc !== prompt.desc) {
      updatePrompt(prompt.id, { desc });
    }
  };

  // 自动保存内容
  const handleContentBlur = () => {
    if (content !== prompt.content) {
      updatePrompt(prompt.id, { content });
    }
  };

  // 一键复制（折叠状态点击标题区域）
  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // 空内容时不复制
    if (!content.trim()) {
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      play('click');
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 展开状态下的复制按钮
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败,请手动复制');
    }
  };

  // 删除确认
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    deletePrompt(prompt.id);
    onDelete();
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // 切换展开状态
  const toggleExpand = () => {
    // 拖拽时不触发展开
    if (isDragging) return;
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandChange?.(newExpanded);
    play('click');
  };

  return (
    <div 
      ref={cardRef}
      className={`border-2 border-black bg-white h-full flex flex-col ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* 隐形拖拽感应区 - 顶部极细条 (仅非欢迎卡片显示) */}
      {!isWelcomeCard && (
        <div
          {...(dragHandleProps || {})}
          className="stealth-drag-zone h-2 cursor-grab transition-none"
          title="按住此处拖拽排序"
        />
      )}
      
      {/* 折叠状态 */}
      {!isExpanded && (
        <div
          onClick={handleQuickCopy}
          onDoubleClick={!isDragging ? toggleExpand : undefined}
          onMouseEnter={() => play('hover')}
          className="p-3 flex-1 flex flex-col hover:bg-black hover:text-white transition-none cursor-pointer group select-none"
          title="单击复制，双击展开"
        >
          {/* 标题区域 */}
          <div className="font-bold text-sm mb-1 line-clamp-2 relative">
            {title || '(无标题)'}
            {copied && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-black text-white px-1.5 py-0.5">
                COPIED!
              </span>
            )}
          </div>
          {/* 描述区域 */}
          <div className="text-xs opacity-60 line-clamp-2">
            {desc || '(无描述)'}
          </div>
        </div>
      )}

      {/* 展开状态 */}
      {isExpanded && (
        <div className="p-3 flex flex-col h-full">
          {/* 标题编辑 */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full mb-2 p-2 border-2 border-black bg-white font-bold text-sm focus:outline-none focus:border-dashed focus:border-black placeholder:opacity-60 placeholder:text-[#aaa]"
            placeholder="你的技能命名..."
          />

          {/* 描述编辑 */}
          <input
            ref={descRef}
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onBlur={handleDescBlur}
            className="w-full mb-2 p-2 border-2 border-black bg-white text-xs focus:outline-none focus:border-dashed focus:border-black placeholder:opacity-60 placeholder:text-[#aaa]"
            placeholder="添加技能卷轴描述..."
          />

          {/* 内容编辑 */}
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleContentBlur}
            className="w-full flex-1 min-h-[120px] p-2 border-2 border-black bg-white resize-none focus:outline-none focus:border-dashed focus:border-black text-sm mb-2 placeholder:opacity-60 placeholder:text-[#aaa]"
            placeholder="在此吟唱你的咒语..."
            style={{ caretColor: '#000' }}
          />

          {/* 操作按钮 */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {/* 复制按钮 */}
              <button
                onClick={handleCopy}
                className={`flex-1 px-3 py-1.5 border-2 border-black font-bold text-xs transition-none active:translate-x-0.5 active:translate-y-0.5 ${
                  copied
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {copied ? 'COPIED!' : '复制'}
              </button>

              {/* 折叠按钮 */}
              <button
                onClick={toggleExpand}
                className="flex-1 px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-xs font-bold active:translate-x-0.5 active:translate-y-0.5"
              >
                折叠
              </button>
            </div>

            {/* 删除按钮区域 */}
            {!showDeleteConfirm && (
              <button
                onClick={handleDeleteClick}
                className="w-full px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-xs font-bold active:translate-x-0.5 active:translate-y-0.5"
              >
                删除
              </button>
            )}

            {/* 删除确认 */}
            {showDeleteConfirm && (
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-3 py-1.5 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-none text-xs font-bold"
                >
                  确认
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-xs font-bold"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
