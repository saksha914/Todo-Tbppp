import { useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Notifications as NotificationIcon,
  Person as PersonIcon
} from '@mui/icons-material'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

  const menuItems = [
    { icon: <DashboardIcon />, label: 'Dashboard', path: '/' },
    { icon: <TaskIcon />, label: 'All Tasks', path: '/tasks' },
    { icon: <CalendarIcon />, label: 'Calendar', path: '/calendar' },
    { icon: <SettingsIcon />, label: 'Settings', path: '/settings' },
  ]

  return (
    <Box sx={{ display: 'flex', bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 180,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 180,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff', // Set Drawer background to white
            border: 'none',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: theme.palette.primary.main, 
              fontWeight: 600,
              mb: 4 
            }}
          >
            TaskMaster
          </Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                my: 0.5,
                mx: 2,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          bgcolor: '#ffffff', // Set main background to white
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 150}}>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton 
              sx={{ 
                bgcolor: '#ffffff', // Set icon button background to white
                '&:hover': { bgcolor: '#f0f0f0' } // Subtle hover effect
              }}
            >
              <NotificationIcon />
            </IconButton>
            <IconButton 
              sx={{ 
                bgcolor: '#ffffff', // Set icon button background to white
                '&:hover': { bgcolor: '#f0f0f0' } // Subtle hover effect
              }}
            >
              <PersonIcon />
            </IconButton>
          </Box>
        </Box>
        {children}
      </Box>
    </Box>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
