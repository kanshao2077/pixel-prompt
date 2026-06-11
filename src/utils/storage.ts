import { Prompt, INITIAL_PROMPTS } from '@/types/prompt';
import { getCloudData, saveCloudData, getToken, getShareLink } from './cloud-storage';

// LocalStorage 键名（作为 fallback）
const STORAGE_KEYS = {
  PROMPTS: 'pixel_prompt_data',
  MEMO: 'pixel_memo_data'
};

// 初始化：尝试同步云端数据
export async function initStorage(): Promise<boolean> {
  try {
    const cloudData = await getCloudData();
    if (cloudData) {
      // 云端有数据，覆盖本地
      localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(cloudData.prompts));
      localStorage.setItem(STORAGE_KEYS.MEMO, cloudData.memo);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// 同步到云端（静默失败，不影响本地使用）
async function syncToCloud(prompts: Prompt[], memo: string): Promise<void> {
  try {
    await saveCloudData(prompts, memo);
  } catch (error) {
    console.log('云端同步失败:', error);
  }
}

// 获取所有提示词
export function getPrompts(): Prompt[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROMPTS);
    if (!data) {
      // 首次使用,初始化数据
      savePrompts(INITIAL_PROMPTS);
      return INITIAL_PROMPTS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('读取提示词失败:', error);
    return INITIAL_PROMPTS;
  }
}

// 保存所有提示词
export function savePrompts(prompts: Prompt[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
    // 同步到云端（异步，不阻塞）
    const memo = getMemo();
    syncToCloud(prompts, memo);
  } catch (error) {
    console.error('保存提示词失败:', error);
  }
}

// 添加新提示词
export function addPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Prompt {
  const newPrompt: Prompt = {
    ...prompt,
    id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  const prompts = getPrompts();
  prompts.push(newPrompt);
  savePrompts(prompts);
  
  return newPrompt;
}

// 更新提示词
export function updatePrompt(id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>): void {
  const prompts = getPrompts();
  const index = prompts.findIndex(p => p.id === id);
  
  if (index !== -1) {
    prompts[index] = {
      ...prompts[index],
      ...updates,
      updatedAt: Date.now()
    };
    savePrompts(prompts);
  }
}

// 删除提示词
export function deletePrompt(id: string): void {
  const prompts = getPrompts();
  const filtered = prompts.filter(p => p.id !== id);
  savePrompts(filtered);
}

// 更新提示词顺序
export function updatePromptsOrder(prompts: Prompt[]): void {
  savePrompts(prompts);
}

// 获取灵感碎片
export function getMemo(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.MEMO) || '';
  } catch (error) {
    console.error('读取灵感碎片失败:', error);
    return '';
  }
}

// 保存灵感碎片
export function saveMemo(memo: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMO, memo);
    // 同步到云端（异步，不阻塞）
    const prompts = getPrompts();
    syncToCloud(prompts, memo);
  } catch (error) {
    console.error('保存灵感碎片失败:', error);
  }
}

// 导出为 Markdown 并复制到剪贴板
export async function exportToMarkdownClipboard(): Promise<void> {
  const prompts = getPrompts();
  
  // 过滤掉欢迎卡片
  const exportPrompts = prompts.filter(p => p.id !== 'init_01');
  
  if (exportPrompts.length === 0) {
    throw new Error('暂无可导出的提示词');
  }
  
  // 生成 Markdown 内容
  const markdown = exportPrompts.map(prompt => {
    const title = prompt.title || '无标题';
    const desc = prompt.desc ? `> // ${prompt.desc}` : '';
    const content = prompt.content || '';
    
    return `# ${title}\n${desc ? desc + '\n' : ''}${content}`;
  }).join('\n\n---\n\n');
  
  // 复制到剪贴板
  await navigator.clipboard.writeText(markdown);
}

// 从 Markdown 文本导入
export async function importFromMarkdownText(text: string): Promise<void> {
  // 智能分割
  const sections: string[] = [];
  const lines = text.split('\n');
  let currentSection: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const prevLine = i > 0 ? lines[i - 1].trim() : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
    const nextNextLine = i < lines.length - 2 ? lines[i + 2].trim() : '';
    
    const isSeparator = 
      line === '---' && 
      (prevLine === '' || i === 0) && 
      nextLine === '' && 
      nextNextLine.startsWith('# ');
    
    if (isSeparator && currentSection.length > 0) {
      sections.push(currentSection.join('\n').trim());
      currentSection = [];
      i++;
    } else {
      currentSection.push(lines[i]);
    }
  }
  
  if (currentSection.length > 0) {
    sections.push(currentSection.join('\n').trim());
  }
  
  if (sections.length === 0) {
    sections.push(text.trim());
  }
  
  const newPrompts: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  
  sections.forEach(section => {
    const sectionLines = section.split('\n');
    let title = '';
    let desc = '';
    let content = '';
    
    let i = 0;
    
    if (sectionLines[i]?.startsWith('# ')) {
      title = sectionLines[i].substring(2).trim();
      i++;
    }
    
    if (sectionLines[i]?.startsWith('> //')) {
      desc = sectionLines[i].substring(4).trim();
      i++;
    } else if (sectionLines[i]?.startsWith('>')) {
      desc = sectionLines[i].substring(1).trim();
      i++;
    }
    
    content = sectionLines.slice(i).join('\n').trim();
    
    if (!title && content) {
      const firstLine = content.split('\n')[0];
      title = firstLine.substring(0, 50);
      content = content.substring(firstLine.length).trim();
    }
    
    if (title || content) {
      newPrompts.push({ title, desc, content });
    }
  });
  
  if (newPrompts.length === 0) {
    throw new Error('未能解析出有效的提示词内容');
  }
  
  const existingPrompts = getPrompts();
  const welcomeCard = existingPrompts.find(p => p.id === 'init_01');
  
  const allPrompts: Prompt[] = welcomeCard ? [welcomeCard] : [];
  
  newPrompts.forEach(p => {
    allPrompts.push({
      ...p,
      id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  });
  
  savePrompts(allPrompts);
}

// 清空全部提示词(保留欢迎卡片)
export function clearAllPrompts(): void {
  const existingPrompts = getPrompts();
  const welcomeCard = existingPrompts.find(p => p.id === 'init_01');
  
  const prompts: Prompt[] = welcomeCard ? [welcomeCard] : [];
  savePrompts(prompts);
}

// 导出分享链接
export { getShareLink };
