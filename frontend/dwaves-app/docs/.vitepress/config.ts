import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'by Yakow',
    description: 'Dwaves web3 app',

    head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo-dwaves.svg' }]],

    vue: {
        reactivityTransform: true,
    },

    lastUpdated: true,

    themeConfig: {
        logo: '/logo-dwaves.png',

        editLink: {
            text: 'Suggest changes to this page',
            pattern: 'https://github.com/maoosi/prisma-appsync/edit/main/docs/:path',
        },

        socialLinks: [{ icon: 'github', link: 'https://github.com/Wbebey/dwaves' }],

        lastUpdatedText: 'Updated Date',

        footer: {
            message: 'Powered by Yakow',
            copyright: 'Copyright © 2022-present Dwaves',
        },

        nav: [
            { text: 'Documentation', link: '/essentials/getting-started' },
            { text: 'Changelog', link: '/changelog/' },
            {
                text: 'Links',
                items: [
                    {
                        text: 'Report a bug',
                        link: 'https://github.com/maoosi/prisma-appsync/issues',
                    },
                    {
                        text: 'Sponsor',
                        link: 'https://github.com/sponsors/maoosi',
                    },
                    {
                        text: 'Roadmap',
                        link: 'https://github.com/users/maoosi/projects/1',
                    },
                    {
                        text: 'Contributing',
                        link: '/contributing',
                    },
                ],
            },
        ],

        sidebar: [
            {
                text: 'Essentials',
                items: [
                    { text: '🦄 Why Prisma-AppSync?', link: '/essentials/concept' },
                    { text: '⚡️ Getting started', link: '/essentials/getting-started' },
                ],
            },
            {
                text: 'Advanced',
                items: [
                    { text: '🔌 Extending the API', link: '/advanced/extending-api' },
                    { text: '🚨 Securing the API', link: '/advanced/securing-api' },
                    { text: '🪴 Tweaking GQL Schema', link: '/advanced/tweaking-schema' },
                    { text: '🪝 Adding Hooks', link: '/advanced/hooks' },
                ],
            },
            {
                text: 'Changelog',
                items: [
                    { text: '(latest) 1.0.0-rc.4', link: '/changelog/1.0.0-rc.4' },
                    { text: '1.0.0-rc.3', link: '/changelog/1.0.0-rc.3' },
                    { text: '1.0.0-rc.2', link: '/changelog/1.0.0-rc.2' },
                    { text: '1.0.0-rc.1', link: '/changelog/1.0.0-rc.1' },
                    { text: 'Contributing', link: '/contributing' },
                ],
            },
        ],
    },
})
