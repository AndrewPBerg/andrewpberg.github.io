
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
      foreground: 0x6b9dc2, // Muted blue - subtle and professional
    },
    contact: {
      background: 0x0a0a0a,
      foreground: 0xb8845f, // Muted orange - warm but subtle
    },
    stack: {
      background: 0x0a0a0a,
      foreground: 0x7ba05b, // Muted green - soft tech vibe
    },
    work: {
      background: 0x0a0a0a,
      foreground: 0xb85450, // Muted red - understated
    },
    publications: {
      background: 0x0a0a0a,
      foreground: 0x8b6b9c, // Muted purple - scholarly but soft
    },
    books: {
      background: 0x0a0a0a,
      foreground: 0xa89074, // Muted beige - warm and literary
    },
  },
  light: {
    info: {
      background: 0xf8f9fa, // Very light grey
      foreground: 0x4a6b85, // Muted blue - professional but soft
    },
    contact: {
      background: 0xf8f9fa,
      foreground: 0x9c6b47, // Muted orange - warm contrast but subtle
    },
    stack: {
      background: 0xf8f9fa,
      foreground: 0x5a7a4a, // Muted green - growth but gentle
    },
    work: {
      background: 0xf8f9fa,
      foreground: 0x9c5a5a, // Muted red - contrast but not harsh
    },
    publications: {
      background: 0xf8f9fa,
      foreground: 0x6b5a7a, // Muted purple - scholarly elegance but soft
    },
    books: {
      background: 0xf8f9fa,
      foreground: 0x7a6b5a, // Muted brown - warm and readable
    },
  },
};

export default colorSchemes; 
