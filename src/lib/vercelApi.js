// Fetches user projects directly from Vercel REST API v9
export async function fetchVercelProjects(token, teamId = null) {
  if (!token) throw new Error('Vercel API token missing');

  let url = 'https://api.vercel.com/v9/projects';
  if (teamId) {
    url += `?teamId=${teamId}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Vercel API request failed (${res.status})`);
  }

  const data = await res.json();
  
  // Transform Vercel payload into normalized tool objects
  return (data.projects || []).map(project => {
    const prodDomain = project.targets?.production?.url;
    const projectUrl = prodDomain 
      ? (prodDomain.startsWith('http') ? prodDomain : `https://${prodDomain}`)
      : `https://${project.name}.vercel.app`;

    return {
      title: project.name,
      description: `Deployment di Vercel (${project.framework || 'Vite/Node'}). Update terakhir: ${new Date(project.updatedAt).toLocaleDateString()}`,
      url: projectUrl,
      github_url: project.link?.repo ? `https://github.com/${project.link.repo}` : '',
      category: determineCategory(project.name, project.framework),
      tags: [project.framework || 'web', 'vercel'],
      is_featured: false,
      is_visible: true,
      vercel_project_id: project.id,
      framework: project.framework || 'custom'
    };
  });
}

function determineCategory(name, framework) {
  const lc = (name + ' ' + (framework || '')).toLowerCase();
  if (lc.includes('api') || lc.includes('backend') || lc.includes('server')) return 'API';
  if (lc.includes('bot') || lc.includes('automation')) return 'Bot';
  if (lc.includes('docs') || lc.includes('guide')) return 'Docs';
  if (lc.includes('tool') || lc.includes('utility') || lc.includes('converter')) return 'Utility';
  return 'Web App';
}
