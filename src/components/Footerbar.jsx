import React from 'react'

const Footerbar = () => {
  return (
    <footer
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        background: '#1e3a8a', 
        boxShadow: '0 -2px 8px rgba(0,0,0,0.25)', 
        zIndex: 1000,
        color: '#ffffff',
        fontSize: '0.70rem',
        fontWeight: '500',
      }}
    >
      <div >
        Copyright © {new Date().getFullYear()}, EVENTMAP, All Rights Reserved
      </div>

      <div style={{ opacity: 1 }}>
        powered by carkings-group
      </div>
    </footer>
  )
}

export default Footerbar
