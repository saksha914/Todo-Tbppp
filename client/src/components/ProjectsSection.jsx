import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Button,
  useTheme 
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const ProjectsSection = () => {
  const theme = useTheme()
  
  const projects = [
    {
      id: 1,
      title: 'Website Redesign',
      progress: 75,
      color: theme.palette.primary.main
    },
    {
      id: 2,
      title: 'Mobile App',
      progress: 45,
      color: theme.palette.success.main
    },
    {
      id: 3,
      title: 'Marketing Campaign',
      progress: 90,
      color: theme.palette.secondary.main
    }
  ]

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Active Projects</Typography>
          <Button 
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            All
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {projects.map((project) => (
            <Card 
              key={project.id}
              variant="outlined"
              sx={{ 
                borderLeft: `4px solid ${project.color}`,
                '&:hover': { boxShadow: theme.shadows[4] }
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {project.title}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={project.progress}
                  sx={{ 
                    my: 1,
                    backgroundColor: theme.palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: project.color
                    }
                  }}
                />
                <Typography variant="body2" color="textSecondary">
                  {project.progress}% Complete
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProjectsSection 