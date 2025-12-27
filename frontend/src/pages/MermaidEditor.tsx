import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mermaid from 'mermaid';
import { FiDownload, FiArrowLeft, FiZoomIn, FiZoomOut, FiMaximize2 } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ThemeSwitch from '../components/ThemeSwitchButton';
import styled from 'styled-components';

const Container = styled.div<{ theme?: { background: string, text: string, card: string, border: string, mode: string } }> `
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

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: ${props => props.theme?.card || 'rgba(255,255,255,0.8)'};
  border: 1px solid ${props => props.theme?.border || 'rgba(255,255,255,0.2)'};
  border-radius: 20px;
  margin-bottom: 1.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  
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

const Title = styled.h1<{ theme?: { text: string, mode: string } }>`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: ${props => props.theme?.mode === 'dark' 
    ? 'linear-gradient(90deg, #93c5fd, #c4b5fd)' 
    : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' }>`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  
  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: linear-gradient(135deg, #64748b 0%, #475569 100%);
    color: white;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(100, 116, 139, 0.4);
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    }
  `}
  
  ${props => props.variant === 'warning' && `
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
    }
  `}
  
  ${props => props.variant === 'success' && `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
    }
  `}
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${props => props.theme?.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 14px;
  backdrop-filter: blur(12px);
`;

const ZoomDisplay = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  min-width: 3.5rem;
  text-align: center;
  background: ${props => props.theme?.mode === 'dark' 
    ? 'rgba(55, 65, 81, 0.5)' 
    : 'rgba(243, 244, 246, 0.8)'};
  padding: 0.25rem 0.75rem;
  border-radius: 10px;
`;

const DiagramContainer = styled.div`
  background: ${props => props.theme?.card || 'rgba(255,255,255,0.8)'};
  border: 1px solid ${props => props.theme?.border || 'rgba(255,255,255,0.2)'};
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12px);
  overflow: hidden;
  height: calc(100vh - 200px);
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #059669);
  }
`;

const DiagramViewer = styled.div`
  height: 100%;
  overflow: auto;
  background-color: inherit;
  position: relative;
  scroll-behavior: smooth;
`;

const DiagramContent = styled.div`
  min-width: fit-content;
  min-height: fit-content;
  padding: 2rem;
`;

const ScalableDiagram = styled.div`
  display: inline-block;
  transition: transform 0.3s ease;
`;

const PreviewArea = styled.div`
  background-color: inherit;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: inline-block;
  min-width: 12.5rem;
  min-height: 12.5rem;
`;

const defaultCode = `graph TD
A[Start] --> B{Is it?}
B -- Yes --> C[OK]
B -- No --> D[End]`;

const MermaidEditor: React.FC = () => {
  const location = useLocation();
  const [code, setCode] = useState(defaultCode);
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Check if we received Mermaid code from CodeEntry page
  useEffect(() => {
    if (location.state?.mermaidCode) {
      setCode(location.state.mermaidCode);
    }
  }, [location.state]);

  // Define zoom functions
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  }, []);
  
  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  // Add keyboard event listeners for zooming
  useEffect(() => {
    // Listen for custom zoom events
    window.addEventListener('zoomIn', handleZoomIn);
    window.addEventListener('zoomOut', handleZoomOut);
    window.addEventListener('resetZoom', handleResetZoom);

    return () => {
      window.removeEventListener('zoomIn', handleZoomIn);
      window.removeEventListener('zoomOut', handleZoomOut);
      window.removeEventListener('resetZoom', handleResetZoom);
    };
  }, [handleZoomIn, handleZoomOut, handleResetZoom]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      // Reduce logging
      logLevel: 3,
      // Suppress error rendering
      suppressErrorRendering: true
    });
  }, []);

  // Real-time rendering
  useEffect(() => {
    renderDiagram();
  }, [code]);

  const renderDiagram = async () => {
    if (previewRef.current && code.trim()) {
      try {
        setError(null);
        previewRef.current.innerHTML = '';
        
        // Create a unique ID for each diagram to avoid conflicts
        const uniqueId = `mermaid-${Date.now()}`;
        const diagramDiv = document.createElement('div');
        diagramDiv.className = 'mermaid';
        diagramDiv.id = uniqueId;
        diagramDiv.textContent = code;
        previewRef.current.appendChild(diagramDiv);
        
        // Use mermaid.render instead of init for better control
        const { svg } = await mermaid.render(uniqueId + '-svg', code);
        previewRef.current.innerHTML = svg;
      } catch (err: any) {
        const errorMessage = err?.message || err?.toString() || 'Error rendering diagram';
        setError(errorMessage);
        if (previewRef.current) {
          previewRef.current.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center; font-size: 14px;">⚠️ ${errorMessage}</div>`;
        }
      }
    }
  };

  const exportDiagram = async (format: 'svg' | 'png' | 'pdf') => {
    if (!previewRef.current) {
      alert('No diagram to export');
      return;
    }
    
    try {
      const svgElement = previewRef.current.querySelector('svg') as SVGSVGElement | null;
      if (!svgElement) {
        alert('No diagram found. Please ensure the diagram is rendered.');
        return;
      }
      
      if (format === 'svg') {
        // Export SVG
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'mermaid-diagram.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
      } else if (format === 'png') {
        // Export PNG using html2canvas - wrap SVG in a container
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.left = '-9999px';
        wrapper.style.background = '#ffffff';
        wrapper.appendChild(svgElement.cloneNode(true));
        document.body.appendChild(wrapper);
        
        const canvas = await html2canvas(wrapper, {
          backgroundColor: '#ffffff',
          scale: 3, // Higher quality
          logging: false,
          useCORS: true
        });
        
        document.body.removeChild(wrapper);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            alert('Failed to generate PNG');
            return;
          }
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = 'mermaid-diagram.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
        }, 'image/png');
      } else if (format === 'pdf') {
        // Export PDF using html2canvas + jsPDF - wrap SVG in a container
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.left = '-9999px';
        wrapper.style.background = '#ffffff';
        wrapper.appendChild(svgElement.cloneNode(true));
        document.body.appendChild(wrapper);
        
        const canvas = await html2canvas(wrapper, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        document.body.removeChild(wrapper);
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate PDF dimensions
        const pdfWidth = imgWidth / 3.78; // Convert px to mm (96 DPI)
        const pdfHeight = imgHeight / 3.78;
        
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('mermaid-diagram.pdf');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error}`);
    }
  };


  return (
    <Container>
      <ThemeSwitch />
      <HeaderBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <StyledButton variant="secondary" onClick={() => navigate(-1)}>
            <FiArrowLeft size={16} />
            Back
          </StyledButton>
          <Title>Mermaid Diagram Viewer</Title>
        </div>
        
        <ControlGroup>
          <ZoomControls>
            <StyledButton variant="danger" onClick={handleZoomOut} title="Zoom Out">
              <FiZoomOut size={16} />
            </StyledButton>
            <ZoomDisplay>{Math.round(zoom * 100)}%</ZoomDisplay>
            <StyledButton variant="primary" onClick={handleZoomIn} title="Zoom In">
              <FiZoomIn size={16} />
            </StyledButton>
            <StyledButton variant="warning" onClick={handleResetZoom} title="Reset Zoom">
              <FiMaximize2 size={14} />
            </StyledButton>
          </ZoomControls>

          <ButtonGroup>
            <StyledButton variant="success" onClick={() => exportDiagram('svg')}>
              <FiDownload size={14} />
              SVG
            </StyledButton>
            <StyledButton variant="warning" onClick={() => exportDiagram('png')}>
              <FiDownload size={14} />
              PNG
            </StyledButton>
            <StyledButton variant="primary" onClick={() => exportDiagram('pdf')}>
              <FiDownload size={14} />
              PDF
            </StyledButton>
          </ButtonGroup>
        </ControlGroup>
      </HeaderBar>
      
      <DiagramContainer>
        <DiagramViewer ref={containerRef}>
          <DiagramContent>
            <ScalableDiagram style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
              <PreviewArea ref={previewRef} />
            </ScalableDiagram>
          </DiagramContent>
        </DiagramViewer>
      </DiagramContainer>
    </Container>
  );
};

export default MermaidEditor;