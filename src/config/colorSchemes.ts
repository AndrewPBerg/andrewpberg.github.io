
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
      foreground: 0x2c5282, // Medium dark blue
    },
    contact: {
      background: 0x000000,
      foreground: 0xdcdcdc, // Light grey
    },
    stack: {
      background: 0x000000,
      foreground: 0x90cdf4, // Light blue
    },
    projects: {
      background: 0x000000,
      foreground: 0x4a5568, // Dark grey
    },
  },
  light: {
    info: {
      background: 0xffffff,
      foreground: 0x00ff00, // Green
    },
    contact: {
      background: 0xffffff,
      foreground: 0x2b6cb0, // Dark blue
    },
    stack: {
      background: 0xffffff,
      foreground: 0x006400, // Dark green
    },
    projects: {
      background: 0xffffff,
      foreground: 0xeb34de, // Pink
    },
  },
};

export default colorSchemes; 
