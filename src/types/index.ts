// Roles del sistema
export type UserRole = 'superadmin' | 'editor'

// Usuario del sistema
export interface AppUser {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

// Noticia / artículo
export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string | null
  category: string
  published: boolean
  published_at: string | null
  author_id: string
  created_at: string
  updated_at: string
}

// Página editable del sitio
export interface SitePage {
  id: string
  slug: string
  title: string
  sections: PageSection[]
  updated_at: string
  updated_by: string
}

// Sección editable dentro de una página
export interface PageSection {
  id: string
  type: 'hero' | 'text' | 'image' | 'gallery' | 'cta'
  content: Record<string, string>
  order: number
}

// Configuración global del sitio
export interface SiteConfig {
  id: string
  key: string
  value: string
  label: string
  updated_at: string
}
