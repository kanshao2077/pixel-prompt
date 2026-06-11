import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { exportToMarkdownClipboard, importFromMarkdownText, clearAllPrompts } from '@/utils/storage';
import PixelToast from './PixelToast';

interface PixelHeaderProps {
  onNewPrompt: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function PixelHeader({ onNewPrompt, searchQuery, onSearchChange }: PixelHeaderProps) {
  const [showAbout, setShowAbout] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDataMenu, setShowDataMenu] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [importText, setImportText] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dataMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dataMenuRef.current && !dataMenuRef.current.contains(event.target as Node)) {
        setShowDataMenu(false);
      }
    };

    if (showDataMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDataMenu]);

  // 处理粘贴导入
  const handlePasteImport = () => {
    setShowImportDialog(true);
    setShowDataMenu(false);
  };

  const handleImportSubmit = async () => {
    if (!importText.trim()) {
      alert('请输入 Markdown 文本');
      return;
    }

    try {
      await importFromMarkdownText(importText);
      setShowImportDialog(false);
      setImportText('');
      setToastMessage('[ 系统消息：数据导入成功 ]');
      setShowToast(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      alert(`✗ 导入失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 处理导出备份
  const handleExport = async () => {
    try {
      await exportToMarkdownClipboard();
      setShowDataMenu(false);
      setToastMessage('[ 系统消息：数据已复制 ]');
      setShowToast(true);
    } catch (error) {
      alert(`✗ 导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 处理清空全部
  const handleClearAll = () => {
    setShowClearConfirm(true);
    setShowDataMenu(false);
  };

  const handleClearConfirm = () => {
    clearAllPrompts();
    setShowClearConfirm(false);
    setToastMessage('[ 系统消息：数据已清空 ]');
    setShowToast(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // 打开搜索框并自动聚焦
  const handleSearchClick = () => {
    setShowSearch(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // 关闭搜索框并清空搜索
  const handleSearchClose = () => {
    setShowSearch(false);
    onSearchChange('');
  };

  return (
    <>
      <header className="border-b-2 border-black bg-white">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* LOGO */}
          <h1 className="text-2xl font-bold tracking-tight">PixelPrompt</h1>

          {/* 工具栏 */}
          <div className="flex items-center gap-2">
            {/* 关于按钮 */}
            <button
              onClick={() => setShowAbout(true)}
              className="w-10 h-9 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-sm font-bold flex items-center justify-center"
              title="关于"
            >
              [i]
            </button>

            {/* 新建按钮 */}
            <button
              onClick={onNewPrompt}
              className="w-10 h-9 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-sm font-bold flex items-center justify-center"
              title="新建提示词"
            >
              [+]
            </button>

            {/* 搜索按钮 */}
            <button
              onClick={handleSearchClick}
              className="w-10 h-9 border-2 border-black bg-white hover:bg-black hover:text-white transition-none flex items-center justify-center"
              title="搜索"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pixel-icon"
              >
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="9" y1="9" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
            </button>

            {/* DATA 菜单按钮 */}
            <div className="relative" ref={dataMenuRef}>
              <button
                onClick={() => setShowDataMenu(!showDataMenu)}
                className="px-3 h-9 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-sm font-bold flex items-center justify-center"
                title="数据管理"
              >
                [ DATA ]
              </button>

              {/* 下拉菜单 */}
              {showDataMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 border-2 border-black bg-white shadow-[4px_4px_0_#000] z-50">
                  <button
                    onClick={handlePasteImport}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-black hover:text-white transition-none border-b border-black"
                  >
                    粘贴导入 (Paste MD)
                  </button>
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-black hover:text-white transition-none border-b border-black"
                  >
                    导出备份 (Export MD)
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-600 hover:text-white transition-none"
                  >
                    清空全部 (Clear All)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 浮动搜索框 */}
        {showSearch && (
          <div className="border-t-2 border-black bg-white px-4 py-3">
            <div className="max-w-[1400px] mx-auto flex items-center gap-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onBlur={handleSearchClose}
                placeholder="搜索技能..."
                className="flex-1 px-3 py-1.5 border-2 border-black bg-white text-sm focus:outline-none focus:border-dashed placeholder:opacity-60 placeholder:text-[#aaa]"
              />
              <button
                onClick={handleSearchClose}
                className="px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-sm font-bold"
              >
                [X]
              </button>
            </div>
          </div>
        )}
      </header>
      {/* 关于模态框 */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="border-2 border-black bg-white rounded-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold border-b-2 border-black pb-2">
              关于 PixelPrompt
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              <strong>PixelPrompt</strong> 是一款致敬 1984 Macintosh System 1 美学的个人提示词管理工具。
            </p>
            <p>{"黑白为界，本地为家。 支持 Markdown 导入导出自由迁徙，通过顶部隐形拖拽重塑思维的经纬。 极简容器，只为捕获转瞬即逝的灵光。"}</p>

            <p className="text-xs opacity-60 pt-4 border-t border-black">{"                            Designed by kanshao 2077"}</p>
          </div>
        </DialogContent>
      </Dialog>
      {/* 导入文本对话框 */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="border-2 border-black bg-white rounded-none max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold border-b-2 border-black pb-2">
              导入 Markdown 文本
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="粘贴 Markdown 文本...&#10;&#10;格式说明:&#10;# 标题&#10;> // 描述&#10;正文内容(可包含 # 和 --- 等标记)&#10;&#10;---&#10;&#10;# 下一个标题&#10;> // 描述&#10;正文内容&#10;&#10;智能识别: 只有当 --- 前后都有空行且后面紧跟 # 标题时,才会被识别为分隔符。正文中的 --- 会被保留。"
              className="w-full h-64 p-3 border-2 border-black bg-white resize-none focus:outline-none focus:border-dashed text-sm font-mono"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportText('');
                }}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-sm font-bold"
              >
                取消
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-sm font-bold"
              >
                导入
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* 清空确认对话框 */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="border-2 border-black bg-white rounded-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold border-b-2 border-black pb-2 text-red-600">
              ⚠️ 危险操作
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              确定要清空所有提示词吗？
            </p>
            <p className="text-sm text-red-600 font-bold">
              此操作不可撤销！
            </p>
            <div className="flex gap-2 justify-end pt-4 border-t-2 border-black">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-none text-sm font-bold"
              >
                取消
              </button>
              <button
                onClick={handleClearConfirm}
                className="px-4 py-2 border-2 border-black bg-red-600 text-white hover:bg-red-700 transition-none text-sm font-bold"
              >
                确认清空
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Toast 提示 */}
      {showToast && (
        <PixelToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
