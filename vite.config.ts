import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, Plugin } from 'vite';
import postcssMixins from 'postcss-mixins';
import postcssNested from 'postcss-nested';
import { patchCssModules } from 'vite-css-modules';

const src = path.resolve(__dirname, 'frontend/src');

const backendPort = process.env.SONARR_PORT ?? '8989';
const backendTarget = `http://localhost:${backendPort}`;

function sonarrDevPlaceholders(): Plugin {
  return {
    name: 'sonarr-dev-placeholders',
    apply: 'serve',
    transformIndexHtml(html) {
      return html
        .replace('__MINI_PROFILER__', '')
        .replace('__URL_BASE__', '')
        .replace("'_THEME_'", "'auto'");
    },
  };
}

export default defineConfig({
  plugins: [sonarrDevPlaceholders(), patchCssModules({ exportMode: 'default' }), react()],

  base: '/',

  server: {
    proxy: {
      '/api': { target: backendTarget, changeOrigin: true },
      '/signalr': { target: backendTarget, changeOrigin: true, ws: true },
      '/initialize.json': { target: backendTarget, changeOrigin: true },
      '/feed': { target: backendTarget, changeOrigin: true },
      '/login': { target: backendTarget, changeOrigin: true },
      '/logout': { target: backendTarget, changeOrigin: true },
      '/Content': { target: backendTarget, changeOrigin: true },
      '/MediaCover': { target: backendTarget, changeOrigin: true },
      '/ping': { target: backendTarget, changeOrigin: true },
    },
  },

  build: {
    outDir: '_output/UI',
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      // Mirror webpack's resolve.modules: [srcFolder] — one entry per top-level src dir
      Activity: path.join(src, 'Activity'),
      AddSeries: path.join(src, 'AddSeries'),
      App: path.join(src, 'App'),
      Calendar: path.join(src, 'Calendar'),
      Commands: path.join(src, 'Commands'),
      Components: path.join(src, 'Components'),
      Content: path.join(src, 'Content'),
      Diag: path.join(src, 'Diag'),
      DownloadClient: path.join(src, 'DownloadClient'),
      Episode: path.join(src, 'Episode'),
      EpisodeFile: path.join(src, 'EpisodeFile'),
      Filters: path.join(src, 'Filters'),
      FirstRun: path.join(src, 'FirstRun'),
      Helpers: path.join(src, 'Helpers'),
      Home: path.join(src, 'Home'),
      InteractiveImport: path.join(src, 'InteractiveImport'),
      InteractiveSearch: path.join(src, 'InteractiveSearch'),
      Internationalization: path.join(src, 'Internationalization'),
      Language: path.join(src, 'Language'),
      OAuth: path.join(src, 'OAuth'),
      Organize: path.join(src, 'Organize'),
      Parse: path.join(src, 'Parse'),
      Path: path.join(src, 'Path'),
      Quality: path.join(src, 'Quality'),
      RootFolder: path.join(src, 'RootFolder'),
      Season: path.join(src, 'Season'),
      Series: path.join(src, 'Series'),
      Settings: path.join(src, 'Settings'),
      Shared: path.join(src, 'Shared'),
      Store: path.join(src, 'Store'),
      Styles: path.join(src, 'Styles'),
      System: path.join(src, 'System'),
      Tags: path.join(src, 'Tags'),
      Utilities: path.join(src, 'Utilities'),
      Wanted: path.join(src, 'Wanted'),
      typings: path.join(src, 'typings'),

      jquery: 'jquery/dist/jquery.min.js',
    },
  },

  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    postcss: {
      plugins: [
        postcssMixins({
          mixinsFiles: [
            path.join(src, 'Styles/Mixins/cover.css'),
            path.join(src, 'Styles/Mixins/linkOverlay.css'),
            path.join(src, 'Styles/Mixins/scroller.css'),
            path.join(src, 'Styles/Mixins/truncate.css'),
          ],
        }),
        postcssNested(),
      ],
    },
  },
});
