import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowLeft, FiCode, FiFileText, FiZap } from 'react-icons/fi';
import ThemeSwitch from '../components/ThemeSwitchButton';

import styledComp from 'styled-components';

const Container = styledComp.div<{ theme?: { background: string, text: string, card: string, border: string, mode: string } }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${props => props.theme?.mode === 'dark' 
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
    : 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)'};
  padding: 2rem;
  color: ${props => props.theme?.text || '#222'};
  transition: background-color 0.3s ease;
  position: relative;
  overflow: hidden;
  
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
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  text-align: center;
`;

const Title = styledComp.h1<{ theme?: { text: string, mode: string } }>`
  font-size: 3rem;
  font-weight: 800;
  background: ${props => props.theme?.mode === 'dark' 
    ? 'linear-gradient(90deg, #93c5fd, #c4b5fd)' 
    : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.2rem;
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
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styledComp.p<{ theme?: { text: string } }>`
  font-size: 1.4rem;
  color: ${props => props.theme?.text || '#4b5563'};
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Header = styledComp.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const ContinueButton = styledComp.button`
  padding: 1.2rem 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5);
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

const BackButton = styledComp.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.9rem 1.8rem;
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: #ffffff;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(100, 116, 139, 0.35);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(100, 116, 139, 0.45);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const StepsSection = styledComp.section`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const StepsContainer = styledComp.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const Step = styledComp.div`
  display: flex;
  gap: 1.8rem;
  align-items: flex-start;
  text-align: left;
  background: ${props => props.theme?.card || 'rgba(255,255,255,0.8)'};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme?.border || 'rgba(255,255,255,0.2)'};
  backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.2rem;
    padding: 1.5rem;
  }
`;

const StepNumber = styledComp.div<{ theme?: { mode: string } }>`
  background: ${props => props.theme?.mode === 'dark' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(59, 130, 246, 0.1)'};
  border: 1px solid ${props => props.theme?.mode === 'dark' 
    ? 'rgba(59, 130, 246, 0.4)' 
    : 'rgba(59, 130, 246, 0.3)'};
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
  font-size: 1.4rem;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
`;

const StepContent = styledComp.div`
  flex: 1;
`;

const StepTitle = styledComp.h3<{ theme?: { text: string } }>`
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme?.text || '#1f2937'};
  font-size: 1.5rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const StepDescription = styledComp.p<{ theme?: { text: string } }>`
  margin: 0;
  opacity: 0.9;
  color: ${props => props.theme?.text || '#4b5563'};
  line-height: 1.7;
  font-size: 1.1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TipsSection = styledComp.section<{ theme?: { card: string, border: string } }>`
  max-width: 900px;
  margin: 3rem auto 0;
  padding: 2rem;
  background: ${props => props.theme?.card || 'rgba(255,255,255,0.8)'};
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme?.border || 'rgba(255,255,255,0.2)'};
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
    background: linear-gradient(90deg, #10b981, #059669);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const TipsTitle = styledComp.h3<{ theme?: { text: string } }>`
  margin: 0 0 1.5rem 0;
  text-align: center;
  color: ${props => props.theme?.text || '#1f2937'};
  font-size: 1.5rem;
  font-weight: 600;
`;

const TipsGrid = styledComp.ul`
  text-align: left;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.2rem;
  list-style-type: none;
  
  li {
    line-height: 1.6;
    position: relative;
    padding-left: 1.5rem;
    
    &:before {
      content: "✓";
      color: #10b981;
      font-weight: bold;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Instructions: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/code-entry');
  };

  // Add keyboard event listeners for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+C to continue to code editor
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        navigate('/code-entry');
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

  return (
    <Container>
      <ContentWrapper>
        <ThemeSwitch />
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
          <BackButton onClick={() => navigate(-1)}>
            <FiArrowLeft size={18} />
            Back
          </BackButton>
        </div>
        <Header>
          <Title>How to Use This Tool</Title>
          <Subtitle>
            Follow these simple steps to convert your code into beautiful flowcharts
          </Subtitle>
        </Header>

        <StepsSection>
          <StepsContainer>
            {/* Step 1 */}
            <Step>
              <StepNumber>1</StepNumber>
              <StepContent>
                <StepTitle>
                  <FiCode size={24} />
                  Enter Your Code
                </StepTitle>
                <StepDescription>
                  Paste your source code into the editor or import a file. 
                  Supported languages include JavaScript, TypeScript, Python, Java, C/C++, Pascal, and Fortran.
                </StepDescription>
              </StepContent>
            </Step>

            {/* Step 2 */}
            <Step>
              <StepNumber>2</StepNumber>
              <StepContent>
                <StepTitle>
                  <FiFileText size={24} />
                  Select Language & Convert
                </StepTitle>
                <StepDescription>
                  Choose the correct programming language from the dropdown. 
                  The tool will validate your selection against the code and generate a Mermaid flowchart.
                </StepDescription>
              </StepContent>
            </Step>

            {/* Step 3 */}
            <Step>
              <StepNumber>3</StepNumber>
              <StepContent>
                <StepTitle>
                  <FiZap size={24} />
                  Render & Export
                </StepTitle>
                <StepDescription>
                  Click "Render Diagram" to visualize your flowchart. 
                  You can then copy the Mermaid code or export as SVG, PNG, JPG, or PDF.
                </StepDescription>
              </StepContent>
            </Step>
          </StepsContainer>
          
          <div style={{ marginTop: '3rem' }}>
            <ContinueButton onClick={handleContinue}>
              Continue to Code Editor
              <FiArrowRight style={{ marginLeft: 12 }} />
            </ContinueButton>
          </div>
        </StepsSection>

        <TipsSection>
          <TipsTitle>Tips for Best Results</TipsTitle>
          <TipsGrid>
            <li>Ensure your code is syntactically correct</li>
            <li>Use clear, descriptive function and variable names</li>
            <li>Break complex logic into smaller functions</li>
            <li>Comment your code for better understanding</li>
          </TipsGrid>
        </TipsSection>
      </ContentWrapper>
    </Container>
  );
};

export default Instructions;