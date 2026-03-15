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

export function getComparisonPairs(): { slugA: string; slugB: string; slug: string }[] {
  const providers = getAllProviders();
  const pairs: { slugA: string; slugB: string; slug: string }[] = [];
  for (let i = 0; i < providers.length; i++) {
    for (let j = i + 1; j < providers.length; j++) {
      pairs.push({
        slugA: providers[i].slug,
        slugB: providers[j].slug,
        slug: `${providers[i].slug}-vs-${providers[j].slug}`,
      });
    }
  }
  return pairs;
}
