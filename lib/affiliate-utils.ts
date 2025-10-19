// lib/affiliate-utils.ts

interface AffiliateConfig {
  amazon: {
    tag: string; // Your Amazon affiliate tag
    params: string[];
  };
  flipkart: {
    affiliateId: string; // Your Flipkart affiliate ID
    params: string[];
  };
  myntra: {
    affiliateId: string; // Your Myntra affiliate ID
    params: string[];
  };
  // Add more merchants as needed
}

// Configure your affiliate parameters here
const AFFILIATE_CONFIG: AffiliateConfig = {
  amazon: {
    tag: "dealbies-21", // Replace with your actual Amazon affiliate tag
    params: ["tag"]
  },
  flipkart: {
    affiliateId: "dealbies", // Replace with your actual Flipkart affiliate ID
    params: ["affid"]
  },
  myntra: {
    affiliateId: "dealbies", // Replace with your actual Myntra affiliate ID
    params: ["affid"]
  }
};

// List of merchants that are confirmed affiliate partners
const AFFILIATE_MERCHANTS = [
  'amazon',
  'flipkart', 
  'myntra',
  'nykaa',
  'ajio',
  'tatacliq'
];

export function attachAffiliateParams(url: string, merchant: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    // Amazon affiliate parameters
    if (domain.includes('amazon.')) {
      urlObj.searchParams.set('tag', AFFILIATE_CONFIG.amazon.tag);
      return urlObj.toString();
    }
    
    // Flipkart affiliate parameters
    if (domain.includes('flipkart.')) {
      urlObj.searchParams.set('affid', AFFILIATE_CONFIG.flipkart.affiliateId);
      return urlObj.toString();
    }
    
    // Myntra affiliate parameters
    if (domain.includes('myntra.')) {
      urlObj.searchParams.set('affid', AFFILIATE_CONFIG.myntra.affiliateId);
      return urlObj.toString();
    }
    
    // Add more merchant-specific logic here
    // Example for other merchants:
    if (domain.includes('nykaa.')) {
      urlObj.searchParams.set('affid', 'dealbies');
      return urlObj.toString();
    }
    
    if (domain.includes('ajio.')) {
      urlObj.searchParams.set('affid', 'dealbies');
      return urlObj.toString();
    }
    
    if (domain.includes('tatacliq.')) {
      urlObj.searchParams.set('affid', 'dealbies');
      return urlObj.toString();
    }
    
    // Generic affiliate parameter for unknown merchants
    // You can customize this based on your needs
    if (merchant && merchant.toLowerCase().includes('amazon')) {
      urlObj.searchParams.set('tag', AFFILIATE_CONFIG.amazon.tag);
      return urlObj.toString();
    }
    
    // Return original URL if no affiliate parameters to add
    return url;
    
  } catch (error) {
    console.error('Error attaching affiliate parameters:', error);
    return url; // Return original URL if parsing fails
  }
}

export function getMerchantFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    if (domain.includes('amazon.')) return 'Amazon';
    if (domain.includes('flipkart.')) return 'Flipkart';
    if (domain.includes('myntra.')) return 'Myntra';
    if (domain.includes('nykaa.')) return 'Nykaa';
    if (domain.includes('ajio.')) return 'Ajio';
    if (domain.includes('tatacliq.')) return 'Tata CLiQ';
    
    // Extract merchant from domain
    const parts = domain.split('.');
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    
    return 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
}

export function isAffiliateMerchant(merchant: string): boolean {
  const merchantLower = merchant.toLowerCase();
  return AFFILIATE_MERCHANTS.some(affiliateMerchant => 
    merchantLower.includes(affiliateMerchant)
  );
}

export function getSeoAttributes(merchant: string): { rel: string; target: string } {
  const isAffiliate = isAffiliateMerchant(merchant);
  
  return {
    rel: isAffiliate ? 'sponsored' : 'nofollow',
    target: '_blank'
  };
}
