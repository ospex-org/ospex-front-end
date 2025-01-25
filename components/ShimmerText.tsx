import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { useEffect, useState } from 'react'

const shimmerKeyframes = keyframes`
  0% {
    background-position: -3rem top;
  }
  100% {
    background-position: 14rem top;
  }
`

const StyledText = styled.span`
  display: inline-block;
  color: transparent;
  font-weight: bold;
  background: white;
  background-image: -webkit-gradient(
    linear,
    100% 0,
    0 0,
    from(white),
    color-stop(0.5, #1A202C),
    to(white)
  );
  background-position: -4rem top;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: ${shimmerKeyframes} 1s ease-out;
  -webkit-background-size: 4.5rem 100%;
  animation-fill-mode: forwards;
`

// Create a functional component that can handle re-rendering
const ShimmerText = ({ children }: { children: React.ReactNode }) => {
  const [key, setKey] = useState(0)

  useEffect(() => {
    setKey(prev => prev + 1)
  }, [children]) // This will trigger when the text content changes

  return (
    <StyledText key={key}>
      {children}
    </StyledText>
  )
}

export default ShimmerText 