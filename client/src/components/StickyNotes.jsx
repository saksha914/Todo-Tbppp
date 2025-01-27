import { Card, Typography, Box } from '@mui/material'
import { useState } from 'react'

const StickyNotes = () => {
  const [notes] = useState([
    { id: 1, text: "Remember to backup database", color: '#ffeeba' },
    { id: 2, text: "Call John about project", color: '#ffcdd2' },
    { id: 3, text: "Review pull requests", color: '#c8e6c9' }
  ])

  return (
    <Card
      sx={{
        p: 2,
        width: '100%',
        backgroundColor: 'background.paper',
        border: '1px solid #E8E0D5',
        boxShadow: 'none',
        overflow: 'auto'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          color: 'text.primary',
          fontWeight: 500
        }}
      >
        Sticky Notes
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 2 
      }}>
        {notes.map((note) => (
          <Box
            key={note.id}
            sx={{
              p: 2,
              backgroundColor: note.color,
              borderRadius: 1,
              minHeight: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
              transform: 'rotate(-1deg)',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'rotate(0deg) scale(1.02)',
                cursor: 'pointer'
              }
            }}
          >
            <Typography variant="body2">
              {note.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  )
}

export default StickyNotes 