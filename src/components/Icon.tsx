/* Radar PNCP — Icon.
 * Lucide (https://lucide.dev) — 2px outline stroke, matching the humanist type.
 * Production-correct replacement for the prototype's CDN-Lucide + innerHTML hack:
 * lucide-react renders React-owned <svg>, so there is no removeChild reconciliation
 * bug. Only the glyphs actually used are imported, keeping the bundle lean. */
import type { ComponentType, CSSProperties } from 'react'
import {
  AlarmClock,
  Archive,
  ArrowLeft,
  Banknote,
  Bell,
  Building2,
  Calculator,
  Check,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Download,
  ExternalLink,
  FileCheck,
  FileSignature,
  FileText,
  Hash,
  Landmark,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Moon,
  Plus,
  Radar,
  RefreshCw,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Tags,
  Target,
  TrendingUp,
  X,
  type LucideProps,
} from 'lucide-react'

const REGISTRY = {
  'alarm-clock': AlarmClock,
  archive: Archive,
  'arrow-left': ArrowLeft,
  banknote: Banknote,
  bell: Bell,
  'building-2': Building2,
  calculator: Calculator,
  check: Check,
  'chevron-right': ChevronRight,
  'circle-alert': CircleAlert,
  'circle-check': CircleCheck,
  download: Download,
  'external-link': ExternalLink,
  'file-check': FileCheck,
  'file-signature': FileSignature,
  'file-text': FileText,
  hash: Hash,
  landmark: Landmark,
  'layout-dashboard': LayoutDashboard,
  mail: Mail,
  'message-circle': MessageCircle,
  moon: Moon,
  plus: Plus,
  radar: Radar,
  'refresh-cw': RefreshCw,
  search: Search,
  send: Send,
  'sliders-horizontal': SlidersHorizontal,
  sparkles: Sparkles,
  sun: Sun,
  tags: Tags,
  target: Target,
  'trending-up': TrendingUp,
  x: X,
} satisfies Record<string, ComponentType<LucideProps>>

export type IconName = keyof typeof REGISTRY

export interface IconProps {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
  style?: CSSProperties
}

export function Icon({ name, size = 18, strokeWidth = 2, className, style }: IconProps) {
  const Glyph = REGISTRY[name]
  return <Glyph size={size} strokeWidth={strokeWidth} className={className} style={style} aria-hidden />
}
