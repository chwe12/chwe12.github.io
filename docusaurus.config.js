import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  /* 自訂名稱和icon + */
  title: 'Squirrel Site',
  tagline: 'My Journey ?',
  favicon: 'img/favicon.ico',
  /* 自訂名稱和icon - */

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  /* update到github上 + */
  url: 'https://chwe12.github.io',
  baseUrl: '/',
  trailingSlash: false,
  organizationName: 'chwe12',
  projectName: 'chwe12.github.io',
  deploymentBranch: 'main',
  /* update到github上 - */

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
         },
        blog: {
          showReadingTime: true,
          /* 控制blog側邊 recent post 的數量 + */
          blogSidebarTitle: 'All posts', 
          blogSidebarCount: 'ALL',
          /* 控制blog側邊 recent post 的數量 - */
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'game-docs', 
      path: 'game',
      routeBasePath: 'game',
      sidebarPath: './sidebars.js',
      editUrl: 'https://github.com/chwe12/chwe12.github.io/edit/source/',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    },
  ],
  ],


  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'My Website',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Doc',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/game', label: 'Game', position: 'left'},
        ],
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Intro',
                to: '/docs/intro',
              },
              {
                label: 'Link',
                to: '/docs/link',
              },
              {
                label: 'My_Tools',
                to: '/docs/My_Tools/UnitConverter',
              },
              {
                label: 'Research',
                to: '/docs/Research/Docusaurus/intro',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'Game',
                to: '/game',
              },
            ],
          },          

        ],
        copyright: `Copyright © ${new Date().getFullYear()} , Taipei squirrel`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
