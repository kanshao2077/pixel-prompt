// 提示词数据类型定义
export interface Prompt {
  id: string;
  title: string;
  desc: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

// 初始化数据
export const INITIAL_PROMPTS: Prompt[] = [
  {
    id: "init_01",
    title: "👋 欢迎",
    desc: "点击展开查看使用说明",
    content: "PixelPrompt 使用指南:\n\n• 点击 [+] 新建\n• 单击卡片复制内容\n• 双击卡片展开编辑\n• 底部是灵感草稿纸\n\nEnjoy!",
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];
