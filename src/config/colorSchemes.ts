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
      background: 0x000000,
      foreground: 0x4a8bff, // Brighter Blue
    },
    contact: {
      background: 0x000000,
      foreground: 0xff2e2e, // Brighter Red
    },
    stack: {
      background: 0x000000,
      foreground: 0x05ff48, // Brighter Green
    },
    projects: {
      background: 0x000000,
      foreground: 0xae00ff, // Brighter Purple
    },
  },
  light: {
    info: {
      background: 0xffffff,
      foreground: 0x0066cc, // Stronger Blue
    },
    contact: {
      background: 0xffffff,
      foreground: 0xcc0000, // Stronger Red
    },
    stack: {
      background: 0xffffff,
      foreground: 0x6b8e23, // Stronger Green
    },
    projects: {
      background: 0xffffff,
      foreground: 0xcc9900, // Stronger Gold
    },
  },
};

export default colorSchemes; 