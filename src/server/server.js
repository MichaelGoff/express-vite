import express from 'express';
import fs from 'node:fs';
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {createServer as createViteServer} from 'vite';



export async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production', hmrPort) {
    const app = express();

    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const resolve = (p) => path.resolve(__dirname, p)

    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom'
    })

    // use vite's connect instance as middleware
    // if you use your own express router (express.Router()), you should use router.use
    app.use(vite.middlewares)

    app.use('*', async (req, res, next) => {
        const url = req.originalUrl;

        try {
            let template = fs.readFileSync(resolve('../../index.html'), 'utf-8');

            // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
            //    also applies HTML transforms from Vite plugins, e.g. global preambles
            //    from @vitejs/plugin-react
            template = await vite.transformIndexHtml(url, template)

            const html = template;


            // In theory insert nonce and other junk here?

            res.status(200).set({'Content-Type': 'text/html'}).end(html);
        } catch (e) {
            // If an error is caught, let Vite fix the stack trace so it maps back to
            // your actual source code.
            vite.ssrFixStacktrace(e)
            next(e)
        }
    });

    return {app};
}

createServer().then(({app}) => {
    app.listen(3501, () => {
        console.log('http://localhost:3501');
    });
});