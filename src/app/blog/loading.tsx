import { calcViewportHeight } from '../../lib/dom/viewport-utils'

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