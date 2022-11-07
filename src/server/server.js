import express from 'express';
import fs from 'node:fs';
import path from 'node:path'
import { fileURLToPath } from 'node:url'



export async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production', hmrPort) {
    const app = express();

    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const resolve = (p) => path.resolve(__dirname, p)

    app.use('*', async (req, res) => {
        const template = fs.readFileSync(resolve('../../index.html'), 'utf-8')

        const html = template;

        res.status(200).set({'Content-Type': 'text/html'}).end(html);
    });

    return {app};
}

createServer().then(({app}) => {
    app.listen(3501, () => {
        console.log('http://localhost:3501');
    });
});