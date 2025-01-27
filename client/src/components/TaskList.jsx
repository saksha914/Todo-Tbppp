import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Checkbox,
  Button,
  useTheme
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const TaskList = () => {
  const theme = useTheme()
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Call Mathew', date: 'Tomorrow', completed: false },
    { id: 2, title: 'Buy watercolor', date: 'Today', completed: true },
    { id: 3, title: 'Write to council', date: 'Today', completed: false },
    { id: 3, title: 'Write to council', date: 'Today', completed: false },

  ])

  const handleToggle = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3
        }}>
          <Typography variant="h6">Recent Tasks</Typography>
          <Button 
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            All
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {tasks.map((task) => (
            <Card
              key={task.id}
              variant="outlined"
              sx={{
                bgcolor: 'background.default',
                border: 'none',
                '&:hover': {
                  bgcolor: 'background.paper',
                }
              }}
            >
              <Box sx={{ 
                p: 1, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                    sx={{
                      color: theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'text.secondary' : 'text.primary',
                    }}
                  >
                    {task.title}
                  </Typography>
                </Box>
                <Typography color="text.secondary" variant="body2">
                  {task.date}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default TaskList 