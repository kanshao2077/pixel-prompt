import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PixelHeader from '@/components/PixelHeader';
import PromptCard from '@/components/PromptCard';
import MemoPad from '@/components/MemoPad';
import { Prompt } from '@/types/prompt';
import { getPrompts, addPrompt, updatePromptsOrder, initStorage, getShareLink } from '@/utils/storage';

// 可排序的卡片包装组件
function SortablePromptCard({ 
  prompt, 
  onDelete, 
  isWelcomeCard,
  autoExpandId,
  clearAutoExpand
}: { 
  prompt: Prompt; 
  onDelete: () => void;
  isWelcomeCard: boolean;
  autoExpandId: string | null;
  clearAutoExpand: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: prompt.id,
    disabled: isWelcomeCard,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PromptCard
        prompt={prompt}
        onDelete={onDelete}
        isDragging={isDragging}
        dragHandleProps={isWelcomeCard ? undefined : { ...attributes, ...listeners }}
        isWelcomeCard={isWelcomeCard}
        autoExpand={autoExpandId === prompt.id}
        clearAutoExpand={clearAutoExpand}
      />
    </div>
  );
}

export default function PixelPrompt() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoExpandId, setAutoExpandId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [showShareToast, setShowShareToast] = useState(false);

  // 初始化：同步云端数据并加载
  useEffect(() => {
    const init = async () => {
      // 尝试从云端同步（会覆盖本地）
      await initStorage();
      
      // 加载数据（本地或已同步的云端数据）
      const data = getPrompts();
      setPrompts(data);
      
      // 设置分享链接
      setShareLink(getShareLink());
    };
    
    init();
  }, []);

  // 复制分享链接
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch (error) {
      console.error('复制链接失败:', error);
    }
  };

  // 排序提示词列表,确保欢迎卡片始终在第一位
  const sortedPrompts = useMemo(() => {
    return [...prompts].sort((a, b) => {
      // 欢迎卡片(id: init_01)始终排在最前面
      if (a.id === 'init_01') return -1;
      if (b.id === 'init_01') return 1;
      // 其他卡片保持原有顺序
      return 0;
    });
  }, [prompts]);

  // 搜索过滤
  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedPrompts;
    }
    
    const query = searchQuery.toLowerCase();
    return sortedPrompts.filter(prompt => {
      // 欢迎卡片始终显示
      if (prompt.id === 'init_01') return true;
      
      // 匹配标题或描述
      const titleMatch = prompt.title.toLowerCase().includes(query);
      const descMatch = prompt.desc.toLowerCase().includes(query);
      const contentMatch = prompt.content.toLowerCase().includes(query);
      
      return titleMatch || descMatch || contentMatch;
    });
  }, [sortedPrompts, searchQuery]);

  // 配置拖拽传感器 - 长按拖拽
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 移动8px后激活拖拽
      },
    })
  );

  // 新建提示词
  const handleNewPrompt = () => {
    const newPrompt = addPrompt({
      title: '',
      desc: '',
      content: ''
    });
    setPrompts([...prompts, newPrompt]);
    // 自动展开新建的卡片
    setAutoExpandId(newPrompt.id);
  };

  const clearAutoExpand = () => {
    setAutoExpandId(null);
  };

  // 刷新列表 (删除后)
  const handleRefresh = () => {
    setPrompts(getPrompts());
  };

  // 拖拽结束处理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // 不允许拖到欢迎卡片的位置
    if (over.id === 'init_01') {
      return;
    }

    setPrompts((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      // 确保欢迎卡片始终在第一位
      const welcomeCard = items.find(item => item.id === 'init_01');
      const otherCards = items.filter(item => item.id !== 'init_01');
      
      const oldIndexInOther = otherCards.findIndex((item) => item.id === active.id);
      const newIndexInOther = otherCards.findIndex((item) => item.id === over.id);
      
      const reorderedOther = arrayMove(otherCards, oldIndexInOther, newIndexInOther);
      const newOrder = welcomeCard ? [welcomeCard, ...reorderedOther] : reorderedOther;
      
      // 保存新顺序
      updatePromptsOrder(newOrder);
      
      return newOrder;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <PixelHeader 
        onNewPrompt={handleNewPrompt} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 主内容区 */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-[1400px] mx-auto">
          {/* 提示词列表 - 网格布局 */}
          {filteredPrompts.length === 0 && (
            <div className="border-2 border-black bg-white p-8 text-center">
              <p className="text-sm opacity-60">
                {searchQuery ? '未找到匹配的提示词' : '暂无提示词,点击右上角 [+] 新建'}
              </p>
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredPrompts.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrompts.map((prompt) => (
                  <SortablePromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onDelete={handleRefresh}
                    isWelcomeCard={prompt.id === 'init_01'}
                    autoExpandId={autoExpandId}
                    clearAutoExpand={clearAutoExpand}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </main>

      {/* 底部灵感碎片 */}
      <footer className="py-8 px-4 border-t-2 border-black">
        <div className="max-w-[800px] mx-auto">
          <MemoPad />
          
          {/* 分享链接 */}
          <div className="mt-6 flex items-center gap-2">
            <div className="flex-1 border-2 border-black bg-white px-3 py-2 text-xs truncate opacity-60">
              {shareLink || '加载中...'}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-xs font-bold whitespace-nowrap"
            >
              复制同步链接
            </button>
          </div>
          
          {/* 复制成功提示 */}
          {showShareToast && (
            <div className="mt-2 text-xs text-center opacity-60">
              链接已复制！在其他设备打开此链接即可同步数据
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
