const API_BASE_URL = 'http://localhost:3000';
const AST2M_BASE_URL = 'http://localhost:3400';

interface LLMResponse {
    status: string;
    message: string;
    details?: string;
}

export const loadLLM = async (): Promise<LLMResponse> => {
    const response = await fetch(`${API_BASE_URL}/load-llm`, {
        method: 'POST',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to load LLM');
    }
    return data;
};

export const getLLMStatus = async (): Promise<{ status: string }> => {
    const response = await fetch(`${API_BASE_URL}/llm-status`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to get LLM status');
    }
    return data;
};

export const unloadLLM = async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/unload-llm`, {
        method: 'POST',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unload LLM');
    }
};

export const convertCodeToMermaid = async (code: string, language?: 'js' | 'ts' | 'python' | 'java' | 'c' | 'cpp' | 'pascal' | 'auto'): Promise<string> => {
    // try main backend first, but fall back on network errors or non-OK
    try {
        const response = await fetch(`${API_BASE_URL}/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language: language || 'auto' }),
        });
        if (response.ok) {
            const data = await response.json();
            return data.mermaid;
        }
    } catch (_) {
        // ignore and fall back
    }

    const fallback = await fetch(`${AST2M_BASE_URL}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: language || 'auto' }),
    });
    if (!fallback.ok) {
        let message = 'Failed to convert code to Mermaid';
        try {
            const err = await fallback.json();
            message = err?.message || message;
        } catch {}
        throw new Error(message);
    }
    const data = await fallback.json();
    return data.mermaid;
};

// Lightweight client-side detector mirroring backend for display purposes only
export const detectLanguageLocal = (code: string): 'js' | 'ts' | 'python' | 'java' | 'c' | 'cpp' | 'pascal' | 'no language detected' => {
    const src = String(code || '');
    const trimmed = src.trim();

    // Java markers - check this BEFORE Python to avoid false positives
    // Enhanced Java detection to better catch cases with imports and print statements
    if (/\bpublic\s+class\s+\w+|System\.out\.print|public\s+static\s+void\s+main\s*\(String\[\]|Scanner\s+\w+|\.nextInt\(|\.next\(|import\s+java\.util\.Scanner|import\s+java\./.test(trimmed)) return 'java';

    // Python - check AFTER Java to avoid false positives
    if (/\bdef\s+\w+\(|:\n\s+/.test(trimmed) && !/System\.out\.print|public\s+static\s+void\s+main/.test(trimmed)) {
        // Additional check to make sure it's not Java with print statements
        if (!/\bpublic\s+class\s+\w+|System\.out\.print|public\s+static\s+void\s+main\s*\(String\[\]/.test(trimmed)) {
            if (/^#!.*python/.test(trimmed) || /\bprint\s*\(/.test(trimmed)) return 'python';
        }
    }

    // C/C++ includes
    if (/^#include\s+</m.test(trimmed)) {
        // Look for C++-specific markers
        if (/\bstd::|cout\s*<<|cin\s*>>|\bclass\s+\w+/.test(trimmed)) return 'cpp';
        // If we have #include but no C++ markers, assume C
        return 'c';
    }

    // C language detection - detect common C functions and patterns
    if (/\bprintf\s*\(|\bscanf\s*\(|\bfprintf\s*\(|\bfscanf\s*\(|\bgetc\s*\(|\bputc\s*\(|\bfopen\s*\(|\bfclose\s*\(|\bmalloc\s*\(|\bfree\s*\(|\bstrlen\s*\(|\bstrcpy\s*\(|\bstrcat\s*\(/.test(trimmed)) return 'c';

    // C++ detection - look for C++ specific markers without #include
    if (/\bstd::|cout\s*<<|cin\s*>>|\bclass\s+\w+|namespace\b/.test(trimmed)) return 'cpp';

    // Pascal detection - look for Pascal-specific keywords
    if (/program\s+\w+|begin|end\.|writeln\s*\(|readln\s*\(|if\s+.*\s+then|case\s+.*\s+of/i.test(trimmed)) return 'pascal';

    // TypeScript vs JavaScript
    // TypeScript type annotations / interfaces / enums
    if (/\binterface\s+\w+|\benum\s+\w+|:\s*\w+(<.*>)?\s*(=|;|,|\))/.test(trimmed)) return 'ts';

    // Default to JS when using console.log, import/export, arrow functions
    if (/console\.log\(|\bexport\b|\bimport\b|=>/.test(trimmed)) return 'js';

    // Fallback heuristics
    if (/using\s+namespace\s+std;/.test(trimmed)) return 'cpp';
    if (/\{|\}/.test(trimmed) && /;\s*($|\n)/m.test(trimmed)) return 'js';

    // If no patterns match, return "no language detected"
    return 'no language detected';
};

export const detectLanguageAPI = async (code: string): Promise<string> => {
    // try main backend, fall back to ast2m server
    try {
        const response = await fetch(`${API_BASE_URL}/detect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });
        if (response.ok) {
            const data = await response.json();
            return data.language;
        }
    } catch (_) {}

    const fallback = await fetch(`${AST2M_BASE_URL}/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
    });
    if (!fallback.ok) {
        let message = 'Failed to detect language';
        try {
            const err = await fallback.json();
            message = err?.message || message;
        } catch {}
        throw new Error(message);
    }
    const data = await fallback.json();
    return data.language;
};