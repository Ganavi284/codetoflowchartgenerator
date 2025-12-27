import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import Editor from '@monaco-editor/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { health as ollamaHealth, listModels as ollamaListModels, pullModel as ollamaPullModel, ragConvert as ollamaRagConvert } from '../services/ollama';
import BackButton from '../components/BackButton';
import { styled } from '@mui/material/styles';
import ThemeSwitch from '../components/ThemeSwitchButton';

import styledComp from 'styled-components';

const Container = styledComp.div<{ theme?: { background: string, text: string, card: string, border: string, mode: string } }>`
  background: ${props => props.theme?.mode === 'dark' 
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
    : 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)'};
  color: ${props => props.theme?.text || '#222'};
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
  
  .MuiPaper-root {
    background: ${props => props.theme?.card || 'rgba(255,255,255,0.8)'} !important;
    border: 1px solid ${props => props.theme?.border || 'rgba(255,255,255,0.2)'} !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
    border-radius: 18px !important;
    position: relative;
    z-index: 1;
  }
  
  .MuiButton-contained {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3) !important;
    border-radius: 14px !important;
    font-weight: 600 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
    }
    
    &:active {
      transform: translateY(-1px);
    }
  }
  
  .MuiTypography-h4 {
    background: ${props => props.theme?.mode === 'dark' 
      ? 'linear-gradient(90deg, #93c5fd, #c4b5fd)' 
      : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800 !important;
    margin-bottom: 1.5rem !important;
    text-align: center;
  }
  
  .MuiTypography-subtitle1 {
    font-weight: 600 !important;
    color: ${props => props.theme?.text || '#1f2937'} !important;
  }
`;

const Analysis: React.FC = () => {
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [generating, setGenerating] = useState(false);
    const [ollamaRunning, setOllamaRunning] = useState(false);
    const inputEditorRef = useRef<any>(null);
    const outputEditorRef = useRef<any>(null);
    const [hasAutoExplained, setHasAutoExplained] = useState(false);

    // Add keyboard event listeners for navigation and actions
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl+Shift+A to analyze/explain code
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
          e.preventDefault();
          if (inputCode.trim()) {
            handleConvert();
          }
        }
        // Ctrl+Shift+B to go back
        else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'b') {
          e.preventDefault();
          navigate(-1);
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [inputCode, navigate]);

    useEffect(() => {
        (async () => {
            const tags = await ollamaListModels();
            const names = tags.map(m => m.name || m.model).filter(Boolean);
            setModels(names);
            if (!selectedModel) setSelectedModel(names[0] || '');
        })();
    }, []);

    // Handle incoming code from CodeEntry page
    useEffect(() => {
        const state = location.state as { code?: string } | null;
        if (state?.code && !hasAutoExplained) {
            setInputCode(state.code);
            setHasAutoExplained(true);
            // Automatically trigger explanation after a short delay to ensure models are loaded
            setTimeout(() => {
                handleConvert();
            }, 500);
        }
    }, [location.state, hasAutoExplained]);

    const handleConvert = async () => {
        const prompt = inputCode.trim();
        if (!prompt) return;
        try {
            setGenerating(true);
            setOutputCode('# ⚡ Analyzing code... Please wait');

            // Quick health check with timeout
            const healthPromise = ollamaHealth();
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Health check timeout')), 2000)
            );

            const ok = await Promise.race([healthPromise, timeoutPromise]).catch(() => false);
            if (!ok) {
                setOutputCode('// Error: Ollama daemon is not reachable at http://localhost:11434');
                setGenerating(false);
                return;
            }

            let names = models;
            if (names.length === 0) {
                const tags = await ollamaListModels();
                names = tags.map(m => m.name || m.model).filter(Boolean);
                setModels(names);
            }
            let modelToUse = selectedModel || names[0] || '';
            if (!modelToUse) {
                setOutputCode('// Error: No Ollama model available. Please pull a model in Ollama.');
                setGenerating(false);
                return;
            }
            setSelectedModel(modelToUse);

            // Show immediate feedback
            setOutputCode(`# ⚡ Analyzing with ${modelToUse}...\n\nGenerating concise explanation. This may take a few seconds.`);

            // Use RAG convert with 'explain' mode
            const response = await ollamaRagConvert(modelToUse, prompt, 'explain');
            console.log('[Analysis] Received response:', response?.substring(0, 100));
            // For explanation, we want the full text response
            const cleanResponse = response.trim() || '// No explanation generated';
            setOutputCode(cleanResponse);
        } catch (e: any) {
            const errorMessage = `// Error during generation: ${e?.message || String(e)}`;
            setOutputCode(errorMessage);
        } finally {
            setGenerating(false);
        }
    };

    const handlePrepareOllama = async () => {
        const modelToUse = selectedModel || models[0] || 'llama3';
        try {
            setGenerating(true);
            // Ensure the model is present and ready by pulling it
            await ollamaPullModel(modelToUse);
            setOllamaRunning(true);
            alert(`Ollama model "${modelToUse}" is now ready for code analysis!`);
        } catch (e: any) {
            // Optionally log for debugging
            console.error('Failed to prepare Ollama model:', e);
            alert(`Failed to prepare Ollama: ${e?.message || String(e)}`);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Container>
            <Box sx={{ maxWidth: 1300, mx: 'auto', p: 4 }}>
                <Box sx={{ position: 'fixed', top: 16, left: 16, zIndex: 10 }}>
                    <BackButton onClick={() => navigate(-1)} />
                </Box>
                <ThemeSwitch />
                <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
                    Analyze Code
                </Typography>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                Input Programming Code
                            </Typography>
                            <Editor
                                height="400px"
                                language="javascript"
                                value={inputCode}
                                onChange={(value) => setInputCode(value || '')}
                                onMount={(editor) => {
                                    inputEditorRef.current = editor;
                                    editor.focus();
                                    // Ensure editor is editable
                                    editor.updateOptions({ readOnly: false });
                                }}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 15,
                                    lineNumbers: 'on',
                                    readOnly: false,
                                    automaticLayout: true,
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                    cursorBlinking: 'smooth',
                                    selectOnLineNumbers: true,
                                    glyphMargin: true,
                                    folding: true,
                                    lineDecorationsWidth: 10,
                                    lineNumbersMinChars: 3,
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                Code Explanation
                            </Typography>
                            <Editor
                                height="400px"
                                language="``"
                                value={outputCode}
                                onChange={(value) => setOutputCode(value || '')}
                                onMount={(editor) => {
                                    outputEditorRef.current = editor;
                                    // Ensure editor is editable
                                    editor.updateOptions({ readOnly: false });
                                }}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 15,
                                    lineNumbers: 'on',
                                    readOnly: false,
                                    automaticLayout: true,
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                    cursorBlinking: 'smooth',
                                    selectOnLineNumbers: true,
                                    glyphMargin: true,
                                    folding: true,
                                    lineDecorationsWidth: 10,
                                    lineNumbersMinChars: 3,
                                }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleConvert}
                            disabled={!inputCode.trim() || generating}
                            sx={{ minWidth: 260 }}
                        >
                            {generating ? 'Explaining...' : 'Explain Code'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Analysis;