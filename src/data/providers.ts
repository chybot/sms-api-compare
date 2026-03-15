export interface Provider {
  slug: string;
  name: string;
  tagline: string;
  founded: number;
  hq: string;
  website: string;
  pricing: {
    sms_outbound_us: number | null;
    sms_inbound_us: number | null;
    phone_number_local: number | null;
    phone_number_tollfree: number | null;
    verify_per_auth: number | null;
    volume_discount: string;
    free_trial: boolean;
    free_credits: number;
  };
  features: {
    sms: boolean;
    voice: boolean;
    whatsapp: boolean;
    email: boolean;
    verify_otp: boolean;
    number_lookup: boolean;
    short_code: boolean;
    '10dlc': boolean;
    flow_builder: string | null;
    sdk_languages: string[];
  };
  compliance: {
    hipaa: boolean;
    soc2: boolean;
    pci_dss: string | false;
    gdpr: boolean;
  };
  performance: {
    sla: string;
    global_coverage: string;
  };
  pros: string[];
  cons: string[];
  best_for: string;
  verdict_vs_twilio: string | null;
}

// Use Vite's import.meta.glob to load YAML at build time
const yamlModules = import.meta.glob('../content/providers/*.yaml', { eager: true });

let _providers: Provider[] | null = null;

export function getAllProviders(): Provider[] {
  if (_providers) return _providers;
  _providers = Object.values(yamlModules).map((mod: any) => mod.default as Provider);
  _providers.sort((a, b) => a.name.localeCompare(b.name));
  return _providers;
}

export function getProvider(slug: string): Provider | undefined {
  return getAllProviders().find(p => p.slug === slug);
}

// Priority order: higher-priority providers appear first in URL slugs
// This ensures "twilio-vs-plivo" not "plivo-vs-twilio" (matches search intent)
const SLUG_PRIORITY: Record<string, number> = {
  twilio: 0, vonage: 1, plivo: 2, sinch: 3, messagebird: 4,
  telnyx: 5, bandwidth: 6, infobip: 7, ringcentral: 8,
  clicksend: 9, 'aws-sns': 10, 'firebase-auth': 11,
};

export function slugPriority(slug: string): number {
  return SLUG_PRIORITY[slug] ?? 99;
}

export function getComparisonPairs(): { slugA: string; slugB: string; slug: string }[] {
  const providers = getAllProviders();
  const pairs: { slugA: string; slugB: string; slug: string }[] = [];
  for (let i = 0; i < providers.length; i++) {
    for (let j = i + 1; j < providers.length; j++) {
      const a = providers[i].slug;
      const b = providers[j].slug;
      // Put higher-priority provider first in the slug
      const [first, second] = slugPriority(a) <= slugPriority(b) ? [a, b] : [b, a];
      pairs.push({
        slugA: first,
        slugB: second,
        slug: `${first}-vs-${second}`,
      });
    }
  }
  return pairs;
}
