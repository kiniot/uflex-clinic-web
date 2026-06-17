import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { Preset } from '@primeuix/themes/types';

export const appPreset: Preset = definePreset(Aura, {
  primitive: {
    petroleum: {
      50: '#E1F0F2',
      100: '#B6D9DF',
      200: '#87BDC8',
      300: '#58A1B1',
      400: '#358C9F',
      500: '#074D61', // Primary
      600: '#064659',
      700: '#053D4F',
      800: '#043445',
      900: '#022533',
      950: '#011721',
    },
    turquoise: {
      50: '#F0FAF8',
      100: '#D1F2EB',
      200: '#A3E5D7',
      300: '#75D8C3',
      400: '#48CBB6', // Secondary
      500: '#3AB29F',
      600: '#2E8F80',
      700: '#226B60',
      800: '#16473F',
      900: '#0B2420',
      950: '#051210',
    },
    dark: {
      100: '#0A0D0E', // Black 1
      200: '#1A1C1E', // Black 2
      300: '#32393B', // Black 3
    },
    sand: {
      50: '#FAF8F2',
      100: '#F7F5ED', // White (Off-white)
      200: '#E6E4D9', // Gray 5
      300: '#CDCBC0', // Gray 4
      400: '#B8B6AC',
      500: '#8C8A81', // Gray 3
      600: '#716F68',
      700: '#5C5B54', // Gray 2
      800: '#3D3C37', // Gray 1
    },
    sky: { 500: '#00B4D8' }, // Info
    emerald: { 500: '#3BC48E' }, // Success
    amber: { 500: '#FFAD33' }, // Warning
    red: { 500: '#EF5350' }, // Error
    neutral: {
      900: '#262522',
      800: '#25282A',
      700: '#A9A79E',
      600: '#DEDCD2',
    },
  },
  semantic: {
    transitionDuration: '0.3s',
    primary: {
      50: '{petroleum.50}',
      100: '{petroleum.100}',
      200: '{petroleum.200}',
      300: '{petroleum.300}',
      400: '{petroleum.400}',
      500: '{petroleum.500}',
      600: '{petroleum.600}',
      700: '{petroleum.700}',
      800: '{petroleum.800}',
      900: '{petroleum.900}',
      950: '{petroleum.950}',
    },
    info: { color: '{sky.500}' },
    success: { color: '{emerald.500}' },
    warning: { color: '{amber.500}' },
    error: { color: '{red.500}' },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{sand.50}', // Main background color in light mode (Off-white)
          100: '{sand.100}',
          200: '{sand.200}',
          300: '{sand.300}',
          400: '{sand.400}',
          500: '{sand.500}',
          600: '{sand.600}',
          700: '{sand.700}',
          800: '{sand.800}',
          900: '{neutral.900}',
          950: '{dark.100}', // Main text color in light mode (Black 1)
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        navigation: {
          item: {
            focusBackground: '{sand.100}',
            activeBackground: '{sand.200}',
          },
        },
        highlight: {
          background: '{petroleum.50}',
          focusBackground: '{petroleum.100}',
          color: '{petroleum.700}',
          focusColor: '{petroleum.800}',
        },
      },
      dark: {
        surface: {
          0: '{sand.50}', // Highest-contrast foreground on dark surfaces
          50: '{dark.200}', // Main application background
          100: '{neutral.800}', // Cards / elevated panels
          200: '{dark.300}', // Inner panels / alternative dark surfaces
          300: '{sand.700}', // Borders on dark custom surfaces
          400: '{sand.300}', // Generic muted tokens on dark
          500: '{sand.700}', // Hovered form-field border / stronger dark separators
          600: '{sand.800}', // Default form-field border / subtle dark separators
          700: '{sand.500}',
          800: '{sand.800}', // Checked/active control surfaces
          900: '{neutral.800}', // Content/overlay surface
          950: '{dark.200}', // Control/input surface
        },
        primary: {
          color: '{primary.400}',
          contrastColor: '{primary.950}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
        navigation: {
          item: {
            focusBackground: '{dark.300}',
            activeBackground: '{sand.800}',
          },
        },
        highlight: {
          background: 'rgba(72, 203, 182, 0.15)',
          focusBackground: 'rgba(72, 203, 182, 0.25)',
          color: '{turquoise.300}',
          focusColor: '{turquoise.200}',
        },
      },
    },
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{turquoise.400}',
      offset: '2px',
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          outlined: {
            secondary: {
              hoverBackground: '{surface.200}',
              activeBackground: '{surface.300}',
              borderColor: '{surface.400}',
              color: '{surface.700}',
            },
          },
        },
      },
    },
  },
});
