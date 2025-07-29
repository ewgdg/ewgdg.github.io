'use client'
import { useCallback } from 'react'
import { notFound } from 'next/navigation'

function AdminPage() {
  const setRef = useCallback((el: HTMLDivElement) => {
    const loadCMS = async () => {
      try {
        // Import the CMS module dynamically
        await import('@/cms/cms.js')
      } catch (error) {
        console.error('Failed to load CMS:', error)
      }
    }
    if (el) {
      loadCMS()
    }
  }, [])

  return (
    <div id="nc-root" ref={setRef}></div>
  )
}

// Only export the component in development
export default process.env.NODE_ENV === 'development' ? AdminPage : function() { notFound() }