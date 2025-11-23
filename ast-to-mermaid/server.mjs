import express from 'express';
import cors from 'cors';
import { convertAST } from './src/index.mjs';

console.log('[ast2m] booting service...');

const PORT = Number(process.env.AST2M_PORT || process.env.PORT || 3400);

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const LANGUAGE_ALIASES = {
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  python: 'python',
  py: 'python',
  java: 'java',
  c: 'c',
  'c++': 'cpp',
  cpp: 'cpp',
  pascal: 'pascal',
  fortran: 'fortran',
  auto: 'auto'
};

const detectLanguage = (code = '') => {
  const src = String(code || '');
  const trimmed = src.trim();

  if (!trimmed) return null;

  if (/\bpublic\s+class\s+\w+|System\.out\.print|public\s+static\s+void\s+main\s*\(String\[\]|Scanner\s+\w+|\.nextInt\(|\.next\(/.test(trimmed)) {
    return 'java';
  }

  if (/\bdef\s+\w+\(|:\s*\n\s+/.test(trimmed) && !/public\s+class\s+\w+/.test(trimmed)) {
    if (/^#!.*python/.test(trimmed) || /\bprint\s*\(/.test(trimmed)) {
      return 'python';
    }
  }

  if (/^#include\s+</m.test(trimmed)) {
    if (/\bstd::|cout\s*<<|cin\s*>>|\bclass\s+\w+/.test(trimmed)) {
      return 'cpp';
    }
    return 'c';
  }

  if (/\bprintf\s*\(|\bscanf\s*\(|\bmalloc\s*\(|\bfree\s*\(|\bstrcpy\s*\(/.test(trimmed)) {
    return 'c';
  }

  if (/\bstd::|cout\s*<<|cin\s*>>|\bclass\s+\w+|namespace\b/.test(trimmed)) {
    return 'cpp';
  }

  if (/\binterface\s+\w+|\benum\s+\w+|:\s*\w+(<.*>)?\s*(=|;|,|\))/.test(trimmed)) {
    return 'typescript';
  }

  if (/console\.log\(|\bexport\b|\bimport\b|=>/.test(trimmed)) {
    return 'javascript';
  }

  if (/program\s+\w+|implicit\s+none|write\s*\(|print\s*\(|do\s+\w*=/.test(trimmed)) {
    return 'fortran';
  }

  if (/program\s+\w+|begin|end\.|writeln\s*\(|readln\s*\(/i.test(trimmed)) {
    return 'pascal';
  }

  return null;
};

const normalizeLanguage = (language) => {
  if (!language) return null;
  const normalized = LANGUAGE_ALIASES[String(language).toLowerCase()];
  return normalized || null;
};

app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'ast-to-mermaid', port: PORT });
});

app.post('/detect', (req, res) => {
  try {
    const { code } = req.body || {};
    if (typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ message: 'Code is required for detection' });
    }

    const detected = detectLanguage(code);
    if (!detected) {
      return res.json({ language: 'no language detected' });
    }
    res.json({ language: detected });
  } catch (error) {
    console.error('[ast2m] detect error:', error);
    res.status(500).json({ message: 'Failed to detect language' });
  }
});

app.post('/convert', async (req, res) => {
  try {
    const { code, language = 'auto' } = req.body || {};
    console.log('[ast2m] Received convert request:', { code, language });
    
    if (typeof code !== 'string' || !code.trim()) {
      console.log('[ast2m] Invalid code provided');
      return res.status(400).json({ message: 'Code is required for conversion' });
    }
    
    let normalized = normalizeLanguage(language);
    console.log('[ast2m] Normalized language:', normalized);
    
    if (!normalized || normalized === 'auto') {
      const detected = detectLanguage(code);
      console.log('[ast2m] Detected language:', detected);
      normalized = normalizeLanguage(detected);
    }
    
    if (!normalized) {
      console.log('[ast2m] Unable to determine language');
      return res.status(400).json({ message: 'Unable to determine language for conversion' });
    }
    
    // Call convertAST with await since it returns a Promise
    console.log('[ast2m] Calling convertAST');
    const mermaid = await convertAST(code, normalized);
    console.log('[ast2m] convertAST result:', mermaid);
    res.json({ language: normalized, mermaid });
  } catch (error) {
    console.error('[ast2m] convert error:', error);
    res.status(500).json({ message: error?.message || 'Failed to convert code to Mermaid' });
  }
});

app.listen(PORT, () => {
  console.log(`[ast2m] server listening on http://localhost:${PORT}`);
});

