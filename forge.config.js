module.exports = {
    plugins: [
        [
            '@electron-forge/plugin-webpack',
            {
                devContentSecurityPolicy: `default-src * 'self' data: blob: file: 'unsafe-inline' 'unsafe-eval'; script-src * 'self' data: blob: file: 'unsafe-inline' 'unsafe-eval'; connect-src * 'self' data: blob: file: 'unsafe-inline' 'unsafe-eval'; img-src * 'self' data: blob: file: data: blob: 'unsafe-inline'; frame-src * 'self' data: blob: file:; style-src * 'self' data: blob: file: 'unsafe-inline';`,
                mainConfig: './webpack.main.config.js',
                renderer: {
                    config: './webpack.renderer.config.js',
                    entryPoints: [
                        {
                            html: './src/home.html',
                            js: './src/renderer.ts',
                            name: 'main_window',
                            preload: {
                                js: './src/preload.ts',
                            },
                        },
                    ],
                },
            },
        ],
    ]
}