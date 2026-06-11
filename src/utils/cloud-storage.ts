import { Prompt, INITIAL_PROMPTS } from '@/types/prompt';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const STORAGE_KEY = 'pixel_prompt_token';

// 生成随机 token
function generateToken(): string {
  return 'pp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 获取或创建 token
export function getToken(): string {
  // 先检查 URL 参数
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');
  
  if (urlToken) {
    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, urlToken);
    return urlToken;
  }
  
  // 检查 localStorage
  const storedToken = localStorage.getItem(STORAGE_KEY);
  if (storedToken) {
    return storedToken;
  }
  
  // 生成新 token
  const newToken = generateToken();
  localStorage.setItem(STORAGE_KEY, newToken);
  return newToken;
}

// 获取分享链接
export function getShareLink(): string {
  const token = getToken();
  return `${window.location.origin}${window.location.pathname}?token=${token}`;
}

// 从云端获取数据
export async function getCloudData(): Promise<{ prompts: Prompt[]; memo: string } | null> {
  try {
    const client = getSupabaseClient();
    const token = getToken();
    
    const { data, error } = await client
      .from('user_data')
      .select('prompts, memo')
      .eq('token', token)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // 数据不存在，创建新记录
        return null;
      }
      throw error;
    }
    
    return {
      prompts: data.prompts as Prompt[],
      memo: data.memo || '',
    };
  } catch (error) {
    console.error('获取云端数据失败:', error);
    return null;
  }
}

// 保存数据到云端
export async function saveCloudData(prompts: Prompt[], memo: string): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    const token = getToken();
    
    // 先检查记录是否存在
    const { data: existing } = await client
      .from('user_data')
      .select('id')
      .eq('token', token)
      .single();
    
    if (existing) {
      // 更新
      const { error } = await client
        .from('user_data')
        .update({ prompts, memo, updated_at: new Date().toISOString() })
        .eq('token', token);
      
      if (error) throw error;
    } else {
      // 插入新记录
      const { error } = await client
        .from('user_data')
        .insert({ token, prompts, memo });
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('保存云端数据失败:', error);
    return false;
  }
}
