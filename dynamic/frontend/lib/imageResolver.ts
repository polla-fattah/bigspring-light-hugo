export function getLabImageUrl(image: string | null | undefined, title: string = ''): string {
  // If user uploaded a custom image (e.g., /images/uploads/xxx or http://)
  if (
    image && 
    image.trim() !== '' && 
    image !== 'null' && 
    image !== 'undefined' &&
    (image.startsWith('http') || image.includes('/uploads/') || image.endsWith('.svg'))
  ) {
    return image.startsWith('/') || image.startsWith('http') ? image : `/${image}`;
  }

  const text = (title || '').toLowerCase();

  if (text.includes('chem')) {
    return '/images/labs/lab-chemistry.svg';
  }

  if (
    text.includes('biolog') || 
    text.includes('biotech') || 
    text.includes('fish') || 
    text.includes('food') || 
    text.includes('poultry') ||
    text.includes('nutrition')
  ) {
    return '/images/labs/lab-biology.svg';
  }

  if (
    text.includes('soil') || 
    text.includes('plant') || 
    text.includes('horticulture') || 
    text.includes('forest') || 
    text.includes('agri') ||
    text.includes('water')
  ) {
    return '/images/labs/lab-agriculture.svg';
  }

  if (
    text.includes('engineer') || 
    text.includes('aviation') || 
    text.includes('wind') ||
    text.includes('physic')
  ) {
    return '/images/labs/lab-engineering.svg';
  }

  return '/images/labs/default-lab.svg';
}

export function getEventImageUrl(image: string | null | undefined, title: string = ''): string {
  if (
    image && 
    image.trim() !== '' && 
    image !== 'null' && 
    image !== 'undefined' &&
    (image.startsWith('http') || image.includes('/uploads/') || image.endsWith('.svg') || image.includes('-openday') || image.includes('ethics') || image.includes('genomics') || image.includes('gpu') || image.includes('krg') || image.includes('materials') || image.includes('poster') || image.includes('powerbi') || image.includes('graduation'))
  ) {
    return image.startsWith('/') || image.startsWith('http') ? image : `/${image}`;
  }
  return '/images/events/default-event.svg';
}

export function getProjectImageUrl(image: string | null | undefined, title: string = ''): string {
  if (
    image && 
    image.trim() !== '' && 
    image !== 'null' && 
    image !== 'undefined' &&
    (image.startsWith('http') || image.includes('/uploads/') || image.endsWith('.svg'))
  ) {
    return image.startsWith('/') || image.startsWith('http') ? image : `/${image}`;
  }
  return '/images/projects/default-project.svg';
}

export function getUnitImageUrl(image: string | null | undefined, title: string = ''): string {
  if (
    image && 
    image.trim() !== '' && 
    image !== 'null' && 
    image !== 'undefined' &&
    (image.startsWith('http') || image.includes('/uploads/') || image.endsWith('.svg'))
  ) {
    return image.startsWith('/') || image.startsWith('http') ? image : `/${image}`;
  }
  return '/images/units/default-unit.svg';
}
