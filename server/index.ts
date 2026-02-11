import { createServer } from 'http';
import next from 'next';
import { initSocketIO } from './socket/index';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '8000', 10);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  initSocketIO(httpServer);

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
    console.log(`> Socket.io server running on same port`);
    console.log(`> Mode: ${dev ? 'development' : 'production'}`);
  });
});
