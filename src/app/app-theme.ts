import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const applicationTheme = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{cyan.50}',
            100: '{cyan.100}',
            200: '{cyan.200}',
            300: '{cyan.300}',
            400: '{cyan.400}',
            500: '{cyan.500}',
            600: '{cyan.600}',
            700: '{cyan.700}',
            800: '{cyan.800}',
            900: '{cyan.900}',
            950: '{cyan.950}',
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{cyan.500}',
                    inverseColor: '#ffffff',
                    hoverColor: '{cyan.900}',
                    activeColor: '{cyan.800}',
                },
                highlight: {
                    background: '{cyan.600}',
                    focusBackground: '{cyan.700}',
                    color: '#ffffff',
                    focusColor: '#ffffff',
                },
            },
            dark: {
                primary: {
                    color: '{cyan.50}',
                    inverseColor: '{cyan.950}',
                    hoverColor: '{cyan.100}',
                    activeColor: '{cyan.200}',
                },
                highlight: {
                    background: 'rgba(250, 250, 250, .16)',
                    focusBackground: 'rgba(250, 250, 250, .24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)',
                },
            },
        },
    },
});
