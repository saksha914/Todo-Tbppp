import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Card, Typography, Box } from '@mui/material'
import { pieChartData } from '../data/dummyData'

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = () => {
  const completed = pieChartData.tasks.filter(task => task.completed).length
  const pending = pieChartData.tasks.length - completed

  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: [
          'rgba(124, 74, 58, 0.7)',  // Primary color (brown) with opacity
          'rgba(135, 157, 124, 0.7)', // Secondary color (sage) with opacity
        ],
        borderColor: [
          'rgba(124, 74, 58, 1)',    // Solid primary
          'rgba(135, 157, 124, 1)',   // Solid secondary
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#2F2F2F',  // Match theme text color
          font: {
            family: "'Roboto', sans-serif",
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2F2F2F',
        bodyColor: '#2F2F2F',
        bodyFont: {
          family: "'Roboto', sans-serif"
        },
        borderColor: '#E8E0D5',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      }
    }
  }

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
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3,
          color: 'text.primary',
          fontWeight: 500
        }}
      >
        Task Progress
      </Typography>
      
      <Box sx={{ 
        position: 'relative',
        height: 'calc(100% - 60px)', // Account for header
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Pie data={data} options={options} />
        
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
          mt: 2
        }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(124, 74, 58, 0.7)'
            }} />
            <Typography variant="body2">
              Completed ({completed})
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(135, 157, 124, 0.7)'
            }} />
            <Typography variant="body2">
              Pending ({pending})
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default PieChart 