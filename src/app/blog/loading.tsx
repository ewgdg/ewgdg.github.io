import { calcViewportHeight } from '../../lib/dom/viewport'

export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: calcViewportHeight(50),
      fontSize: '18px' 
    }}>
      Loading blog posts...
    </div>
  )
}