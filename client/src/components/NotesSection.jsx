import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  Stack,
  Paper
} from '@mui/material'
import { notesData } from '../data/dummyData'

const NotesSection = () => {
  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        backgroundColor: 'background.paper',
        border: '1px solid #E8E0D5',
        boxShadow: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 500
          }}
        >
          Notes
        </Typography>
        <Button 
          sx={{ 
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(124, 74, 58, 0.05)'
            }
          }}
        >
          All &gt;
        </Button>
      </Box>
      
      <Stack spacing={2}>
        {notesData.map((note) => (
          <Paper
            key={note.id}
            sx={{
              p: 2,
              backgroundColor: '#FAF6E9', // Light cream color for note papers
              border: '1px solid #E8E0D5',
              boxShadow: 'none',
              borderRadius: 1,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '3px',
                height: '100%',
                backgroundColor: 'primary.main',
                opacity: 0.6,
                borderRadius: '2px 0 0 2px'
              },
              '&:hover': {
                transform: 'translateY(-1px)',
                transition: 'transform 0.2s ease-in-out',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.primary',
                lineHeight: 1.6,
                fontFamily: "'Roboto', sans-serif" // Or any other notebook-like font
              }}
            >
              {note.content}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Card>
  )
}

export default NotesSection 