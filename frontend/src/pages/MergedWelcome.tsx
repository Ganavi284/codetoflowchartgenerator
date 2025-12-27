import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiCode, FiGitBranch, FiDownload, FiPlay } from 'react-icons/fi';
import ThemeSwitch from '../components/ThemeSwitchButton';

import styled from 'styled-components';

const Container = styled.div<{ theme?: { background: string, text: string, card: string, border: string, mode: string } }>`
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

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  text-align: center;
`;

const Title = styled.h1<{ theme?: { text: string, mode: string } }>`
  font-size: 3.5rem;
  font-weight: 800;
  background: ${props => props.theme?.mode === 'dark' 
    ? 'linear-gradient(90deg, #93c5fd, #c4b5fd)' 
    : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: -0.5px;
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
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p<{ theme?: { text: string } }>`
  font-size: 1.5rem;
  color: ${props => props.theme?.text || '#4b5563'};
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const StartButton = styled.button`
  padding: 1.2rem 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  display: flex;
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

const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 3rem auto 0;
  padding: 0 20px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const FeatureCard = styled.div<{ theme?: { card: string, text: string, border: string, mode: string } }>`
  padding: 2.5rem;
  border-radius: 20px;
  background: ${props => props.theme?.card || 'rgba(255,255,255,0.8)'};
  border: 1px solid ${props => props.theme?.border || 'rgba(255,255,255,0.2)'};
  backdrop-filter: blur(12px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
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
  
  h3 {
    margin: 0 0 18px 0;
    display: flex;
    align-items: center;
    gap: 14px;
    color: ${props => props.theme?.text || '#1f2937'};
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    opacity: 0.85;
    color: ${props => props.theme?.text || '#4b5563'};
    line-height: 1.7;
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    
    h3 {
      font-size: 1.3rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const MergedWelcome: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/instructions');
  };

  // Add keyboard event listeners for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+S to get started
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        navigate('/instructions');
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
        <header style={{ marginBottom: '2rem' }}>
          <Title>Code → Mermaid Flowcharts</Title>
          <Subtitle>
            This tool converts valid source code into flowcharts. Please ensure your code is correct and complete for best results.
          </Subtitle>
          <ButtonContainer>
            <StartButton onClick={handleGetStarted}>
              <FiPlay style={{ marginRight: 12 }} />
              Get Started
            </StartButton>
          </ButtonContainer>
        </header>

        <FeaturesSection>
          <FeaturesGrid>
            <FeatureCard>
              <h3>
                <FiCode size={26} />
                Multi-language detection
              </h3>
              <p>JavaScript, TypeScript, Python, C/C++, Java, Pascal, Fortran.</p>
            </FeatureCard>
            <FeatureCard>
              <h3>
                <FiGitBranch size={26} />
                Accurate parsing
              </h3>
              <p>Tree‑sitter backed parsing for precise flow extraction.</p>
            </FeatureCard>
            <FeatureCard>
              <h3>
                <FiZap size={26} />
                One‑click render
              </h3>
              <p>Preview only when you choose—no auto rerenders.</p>
            </FeatureCard>
            <FeatureCard>
              <h3>
                <FiDownload size={26} />
                Easy export
              </h3>
              <p>Export as SVG, PNG, JPG, or PDF directly from preview.</p>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>
      </ContentWrapper>
    </Container>
  );
};

export default MergedWelcome;