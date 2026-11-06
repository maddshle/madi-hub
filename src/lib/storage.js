import { supabase, isDatabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'madi_hub_tools_backup';

const DEFAULT_TOOLS = [
  {
    id: 'demo-1',
    title: 'hue-helper',
    description: 'Color palette generator & WCAG contrast compliance checker.',
    url: 'https://hue-helper-theta.vercel.app',
    github_url: 'https://github.com/user/hue-helper',
    category: 'Utility',
    tags: ['react', 'tailwindcss', 'color'],
    is_featured: true,
    is_visible: true,
    framework: 'vite',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-2',
    title: 'unek-unek.com',
    description: 'Platform curhat & peer-support anonim berbasis web.',
    url: 'https://unek-unek.com',
    github_url: '',
    category: 'Web App',
    tags: ['fullstack', 'community', 'react'],
    is_featured: true,
    is_visible: true,
    framework: 'nextjs',
    created_at: new Date().toISOString()
  }
];

// Unified data fetching layer supporting Supabase with LocalStorage fallback
export async function getTools() {
  if (isDatabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) return data;
      console.warn('Supabase query warning, falling back to local storage:', error);
    } catch (err) {
      console.error('Supabase connection error:', err);
    }
  }

  // Fallback to localStorage
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!local) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_TOOLS));
    return DEFAULT_TOOLS;
  }
  return JSON.parse(local);
}

export async function saveTool(tool) {
  if (isDatabaseConfigured) {
    if (tool.id && !tool.id.startsWith('demo-') && !tool.id.startsWith('local-')) {
      const { data, error } = await supabase
        .from('tools')
        .update({
          title: tool.title,
          description: tool.description,
          url: tool.url,
          github_url: tool.github_url,
          category: tool.category,
          tags: tool.tags,
          is_featured: tool.is_featured,
          is_visible: tool.is_visible,
          updated_at: new Date().toISOString()
        })
        .eq('id', tool.id)
        .select();
      if (!error) return data[0];
    } else {
      const payload = { ...tool };
      delete payload.id;
      const { data, error } = await supabase
        .from('tools')
        .insert([payload])
        .select();
      if (!error) return data[0];
    }
  }

  // LocalStorage sync
  const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  let updated;
  if (tool.id) {
    updated = current.map(item => item.id === tool.id ? { ...item, ...tool } : item);
  } else {
    const newTool = { ...tool, id: `local-${Date.now()}`, created_at: new Date().toISOString() };
    updated = [newTool, ...current];
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return tool;
}

export async function deleteTool(id) {
  if (isDatabaseConfigured && !id.startsWith('demo-') && !id.startsWith('local-')) {
    await supabase.from('tools').delete().eq('id', id);
  }
  const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

export async function bulkInsertTools(toolsList) {
  if (isDatabaseConfigured) {
    const { data, error } = await supabase
      .from('tools')
      .upsert(toolsList, { onConflict: 'vercel_project_id' })
      .select();
    if (!error) return data;
  }

  // LocalStorage fallback merge
  const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  const existingUrls = new Set(current.map(t => t.url));
  const newItems = toolsList
    .filter(t => !existingUrls.has(t.url))
    .map(t => ({ ...t, id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` }));
  
  const merged = [...newItems, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
  return merged;
}
