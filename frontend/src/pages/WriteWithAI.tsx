import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { health as ollamaHealth, listModels as ollamaListModels, ragConvert as ollamaRagConvert } from '../services/ollama';
import ThemeSwitch from '../components/ThemeSwitchButton';

import styledComp from 'styled-components';

// Simple styled components without MUI conflicts
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
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    z-index: 0;
  }
`;

const ContentWrapper = styledComp.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const Header = styledComp.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styledComp.h1<{ theme?: { text: string, mode: string } }>`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.theme?.mode === 'dark' 
    ? 'linear-gradient(90deg, #93c5fd, #c4b5fd)' 
    : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: ${props => props.theme?.mode === 'dark' 
      ? 'linear-gradient(90deg, #93c5fd, #c4b5fd)' 
      : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'};
    margin: 1rem auto;
    border-radius: 2px;
  }
`;

const Description = styledComp.p<{ theme?: { text: string } }>`
  font-size: 1.2rem;
  color: ${props => props.theme?.text || '#4b5563'};
  margin-bottom: 2rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  opacity: 0.9;
`;

const ChatContainer = styledComp.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid #333;
  border-radius: 20px;
  background-color: #1e1e1e;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(12px);
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  }
`;

const MessagesContainer = styledComp.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Message = styledComp.div<{ isUser?: boolean }>`
  max-width: 80%;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isUser ? '#3b82f6' : '#333'};
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const InputContainer = styledComp.div`
  display: flex;
  padding: 1.2rem;
  background-color: #252526;
  border-top: 1px solid #333;
`;

const InputField = styledComp.input`
  flex: 1;
  padding: 0.9rem 1.2rem;
  border: none;
  border-radius: 14px;
  background-color: #333;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

const SendButton = styledComp.button`
  margin-left: 0.8rem;
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const GenerateButton = styledComp.button`
  display: block;
  margin: 1.5rem auto;
  padding: 1.1rem 2.2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.5);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const StatusMessage = styledComp.div<{ isError?: boolean }>`
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 14px;
  background-color: ${props => props.isError ? '#fee2e2' : '#dbeafe'};
  color: ${props => props.isError ? '#b91c1c' : '#1e40af'};
  font-weight: 500;
`;

const ModelSelector = styledComp.select`
  padding: 0.7rem 1rem;
  border-radius: 14px;
  background-color: #333;
  color: white;
  border: 1px solid #444;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

const WriteWithAI: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Add keyboard event listeners for navigation and actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+W to write with AI
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        // Focus on input field
        const input = document.querySelector('input');
        if (input) {
          (input as HTMLInputElement).focus();
        }
      }
      // Ctrl+Enter to send message
      else if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        // Trigger send button click
        const sendButton = document.querySelector('button:last-child');
        if (sendButton) {
          (sendButton as HTMLButtonElement).click();
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
  }, [navigate]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load available models
  useEffect(() => {
    (async () => {
      try {
        const tags = await ollamaListModels();
        const names = tags.map(m => m.name || m.model).filter(Boolean);
        setModels(names);
        if (names.length > 0) {
          setSelectedModel(names[0]);
        }
      } catch (e) {
        console.error('Failed to load models:', e);
      }
    })();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = inputValue;
    const newMessages = [...messages, { text: userMessage, isUser: true }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check Ollama health
      const ok = await ollamaHealth();
      if (!ok) {
        throw new Error('Ollama daemon is not reachable at http://localhost:11434');
      }

      // Get response from Ollama
      const response = await ollamaRagConvert(selectedModel || models[0] || '', userMessage, 'generate');
      
      // Add AI response
      setMessages([...newMessages, { text: response, isUser: false }]);
    } catch (error: any) {
      setMessages([...newMessages, { text: `Error: ${error.message}`, isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCode = () => {
    // Get the last AI response (which should contain the generated code)
    const lastAiMessage = messages.findLast(m => !m.isUser);
    if (lastAiMessage) {
      navigate('/code-entry', { state: { code: lastAiMessage.text } });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
          <BackButton onClick={() => navigate(-1)} />
        </div>
        <ThemeSwitch />
        <Header>
          <Title>Write Code with AI</Title>
          <Description>
            Describe what you want to build, and our AI assistant will generate the code for you. 
            Once generated, you can continue the conversation or move to the code editor.
          </Description>
        </Header>

        <ModelSelector 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={isLoading}
        >
          {models.length > 0 ? (
            models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))
          ) : (
            <option>Loading models...</option>
          )}
        </ModelSelector>

        <ChatContainer>
          <MessagesContainer>
            {messages.map((message, index) => (
              <Message key={index} isUser={message.isUser}>
                {message.text}
              </Message>
            ))}
            {isLoading && (
              <Message isUser={false}>
                Thinking...
              </Message>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          <InputContainer>
            <InputField
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you want to build..."
              disabled={isLoading}
            />
            <SendButton onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
              Send
            </SendButton>
          </InputContainer>
        </ChatContainer>

        <GenerateButton 
          onClick={handleGenerateCode} 
          disabled={messages.length === 0 || isLoading}
        >
          Use This Code
        </GenerateButton>
      </ContentWrapper>
    </Container>
  );
};

export default WriteWithAI;