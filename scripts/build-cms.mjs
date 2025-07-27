import { build, context as esbuildContext } from 'esbuild';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Build src/cms/cms.js into a single, minified bundle that can be
 * loaded directly by public/admin/index.html (no Next.js required).
 * Separate the cms app from the main app to avoid dependency conflicts.
 *
 * The bundle is written to: public/admin/cms.bundle.js
 */
(async () => {
    // Grab the package version just for a nice console message
    let version = '';
    try {
        const pkg = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf8'));
        version = `v${pkg.version}`;
    } catch {
        // ignore
    }

    const isWatch = process.argv.includes('--watch');

    const buildOptions = {
        entryPoints: [resolve(__dirname, '..', 'src/cms/cms.js')],
        outfile: resolve(__dirname, '..', 'public/admin/cms.bundle.js'),
        bundle: true,
        jsx: 'automatic',
        format: 'iife',            // <script> tag friendly
        target: 'es2020',
        sourcemap: false, // no need to have .js.map file in production
        minify: true,
        define: { 'process.env.NODE_ENV': '"production"' },
    };

    if (isWatch) {
        const ctx = await esbuildContext(buildOptions);
        await ctx.watch();
        console.log(`✓ CMS bundle watching for changes ${version}`);
    } else {
        await build(buildOptions);
        console.log(`✓ CMS bundle built ${version}`); // eslint-disable-line no-console
    }
})();
