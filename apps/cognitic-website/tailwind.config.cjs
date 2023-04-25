module.exports = {
  content: [
    '../../packages/ui/**/*.{js,ts,html,svelte}',
    './pages/**/*.{js,ts,html,svelte}',
    './components/**/*.{js,ts,html,svelte}',
    './src/**/*.{js,ts,html,svelte}'
  ],
  safelist: [
  ],
  theme: {
    fontFamily: {
      basier: ['Basier Square Regular', 'Roboto'],
      basierMono: ['Basier Square Mono']
    },
    colors: {
      background: {
        primary: '#09090B',
        primaryHover: '#121217',
        primaryDisabled: '#6B5D07',
        primaryActive: '#16161D',
        secondary: '#16161D',
        secondaryHover: '#1F1F28',
        secondaryActive: '#24242E',
        inverse: '#FFFFFF'
      },

      stroke: {
        primary: '#1F1F28',
        secondary: '#2D2D39',
      },

      content: {
        primary: '#FFFFFF',
        primarySub: '#C3C6CA',
        secondary: '#8E929A',
        tertiary: '#737882',
        inverse: '#09090B'
      },

      primary: {
        lighter: '#FFEA66',
        DEFAULT: '#FFDC00',
        darker: '#B29A00'
      },

      error: {
        lighter: '#F76E72',
        DEFAULT: '#F53B42',
        darker: '#D9262D'
      },

      degraded: {
        lighter: '#FFA966',
        DEFAULT: '#FF8C33',
        darker: '#F26E0D'
      },

      success: {
        lighter: '#6BC77F',
        DEFAULT: '#46B95F',
        darker: '#38944C'
      },
    }
  },
  variants: {},
  plugins: []
};