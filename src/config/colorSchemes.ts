
/**
 * Color schemes for the topology effect based on theme and section
 * 
 * Format: 
 * - Colors are in hexadecimal format (0xRRGGBB)
 * - Each section has a background and foreground color for both dark and light themes
 */

export interface ColorScheme {
  background: number;
  foreground: number;
}

export interface ThemeColorSchemes {
  [section: string]: ColorScheme;
}

export interface ColorSchemes {
  dark: ThemeColorSchemes;
  light: ThemeColorSchemes;
}

const colorSchemes: ColorSchemes = {
  dark: {
    info: {
      background: 0x0a0a0a, // Very dark grey
      foreground: 0x00d4ff, // Bright cyan - professional and modern
    },
    contact: {
      background: 0x0a0a0a,
      foreground: 0xff6b35, // Vibrant orange - warm and inviting
    },
    stack: {
      background: 0x0a0a0a,
      foreground: 0x39ff14, // Electric green - tech/coding vibe
    },
    projects: {
      background: 0x0a0a0a,
      foreground: 0xff1744, // Bright red - bold and attention-grabbing
    },
    publications: {
      background: 0x0a0a0a,
      foreground: 0x9c27b0, // Vibrant purple - academic/scholarly
    },
  },
  light: {
    info: {
      background: 0xf8f9fa, // Very light grey
      foreground: 0x0066cc, // Strong blue - professional
    },
    contact: {
      background: 0xf8f9fa,
      foreground: 0xe65100, // Deep orange - warm contrast
    },
    stack: {
      background: 0xf8f9fa,
      foreground: 0x2e7d32, // Forest green - tech/growth
    },
    projects: {
      background: 0xf8f9fa,
      foreground: 0xc62828, // Deep red - strong contrast
    },
    publications: {
      background: 0xf8f9fa,
      foreground: 0x7b1fa2, // Deep purple - scholarly elegance
    },
  },
};

export default colorSchemes; 
