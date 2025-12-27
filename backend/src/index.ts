import express from 'express';
import { pythonModelService } from './services/pythonModelService.js';
import { ollamaRouter } from './routes/ollamaRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
  } else {
    next();
  }
});

// Mount Ollama API
app.use('/api/ollama', ollamaRouter);

// Load the LLM (start the persistent process)
app.post('/api/llm/load', async (req, res) => {
  try {
    pythonModelService.start();
    pythonModelService.once('ready', () => {
      res.json({ status: 'success', message: 'Model loaded successfully' });
    });
    pythonModelService.once('error', (err) => {
      res.status(500).json({ status: 'error', message: err.toString() });
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : String(error) });
  }
});

// Get model status
app.get('/api/llm/status', (req, res) => {
  res.json({
    ready: pythonModelService.getReady(),
    modelPath: 'CodeLlama-7B-Instruct-GGUF/codellama-7b-instruct.Q8_0.gguf',
    loadingProgress: pythonModelService.getLoadingLogs().join('\n')
  });
});

// Stream loading progress
app.get('/api/llm/loading-progress', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send all previous logs
  for (const log of pythonModelService.getLoadingLogs()) {
    res.write(`data: ${JSON.stringify({ progress: log })}\n\n`);
  }

  // Listen for new logs
  const onLoading = (line: string) => {
    res.write(`data: ${JSON.stringify({ progress: line })}\n\n`);
    if (line.includes('Model loaded successfully')) {
      res.write('event: end\ndata: done\n\n');
      res.end();
    }
  };
  pythonModelService.on('loading', onLoading);

  req.on('close', () => {
    pythonModelService.off('loading', onLoading);
  });
});

// Stream LLM output
app.post('/api/llm/stream', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    if (!pythonModelService.getReady()) {
      return res.status(400).json({ error: 'Model not loaded' });
    }
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Listen for each line/token from the Python process
    let finished = false;
    const onResponse = (line: string) => {
      if (!finished) {
        res.write(`data: ${JSON.stringify({ data: line })}\n\n`);
      }
    };
    pythonModelService.on('response', onResponse);

    // Send the prompt
    pythonModelService.sendPrompt(prompt).then(() => {
      finished = true;
      pythonModelService.off('response', onResponse);
      res.write('event: end\ndata: done\n\n');
      res.end();
    }).catch((err) => {
      finished = true;
      pythonModelService.off('response', onResponse);
      res.write(`data: ${JSON.stringify({ data: 'Error: ' + err })}\n\n`);
      res.write('event: end\ndata: done\n\n');
      res.end();
    });

    req.on('close', () => {
      finished = true;
      pythonModelService.off('response', onResponse);
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server with increased timeout for LLM operations
const server = app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

// Set timeout to 5 minutes for long-running LLM requests
server.timeout = 300000; 