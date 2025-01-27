import { Box } from '@mui/material'
import TaskList from '../components/TaskList'
import ProjectsSection from '../components/ProjectsSection'
import Calendar from '../components/Calendar'
import NotesSection from '../components/NotesSection'
import PieChart from '../components/PieChart'
import StickyNotes from '../components/StickyNotes'

const Dashboard = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        },
        gridAutoRows: 'minmax(250px, auto)',
        gap: 2,
        p: 1,
        overflow: 'auto',
        '& > div': {
          minHeight: '250px',
          maxHeight: '300px',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
          },
        }
      }}
    >
      <Box>
        <PieChart />
      </Box>
      <Box>
        <TaskList />
      </Box>
      <Box>
        <Calendar />
      </Box>
      <Box>
        <NotesSection />
      </Box>
      <Box>
        <StickyNotes />
      </Box>
      <Box sx={{
        gridColumn: {
          xs: '1',
          md: 'span 2',
          lg: 'span 3'
        }
      }}>
        <ProjectsSection />
      </Box>
    </Box>
  )
}

export default Dashboard