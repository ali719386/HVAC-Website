import {
  Award,
  BadgeDollarSign,
  Building2,
  CalendarCheck,
  Check,
  Clock,
  Fan,
  Flame,
  Gauge,
  Home,
  Leaf,
  MapPin,
  Phone,
  ShieldCheck,
  Snowflake,
  Thermometer,
  Users,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/lib/brand/schema";

/** Typed icon registry so brand content can reference icons by key. */
const icons: Record<IconKey, LucideIcon> = {
  snowflake: Snowflake,
  flame: Flame,
  wrench: Wrench,
  fan: Fan,
  building: Building2,
  thermometer: Thermometer,
  shield: ShieldCheck,
  clock: Clock,
  award: Award,
  "badge-dollar": BadgeDollarSign,
  users: Users,
  leaf: Leaf,
  home: Home,
  zap: Zap,
  phone: Phone,
  check: Check,
  calendar: CalendarCheck,
  "map-pin": MapPin,
  wind: Wind,
  gauge: Gauge,
};

export function Icon({ name, className }: { name: IconKey; className?: string }) {
  const Cmp = icons[name];
  return <Cmp className={className} aria-hidden="true" focusable="false" />;
}
