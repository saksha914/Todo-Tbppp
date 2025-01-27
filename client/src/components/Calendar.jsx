import { useState } from 'react'
import { Card, CardContent } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const Calendar = () => {
  const [date, setDate] = useState(null)

  return (
    <Card 
      sx={{
        background: '#FFFFFF', // Remove gradient, use clean white
      }}
    >
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            value={date}
            onChange={(newDate) => setDate(newDate)}
            slotProps={{
              actionBar: { actions: [] },
              toolbar: { hidden: true },
            }}
            sx={{
              width: '100%',
              bgcolor: '#FFFFFF',
              '& .MuiPickersDay-root': {
                borderRadius: '50%',
                color: '#2F2F2F',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(124, 74, 58, 0.1)', // Match primary color
                },
              },
              '& .MuiDayCalendar-weekDayLabel': {
                color: 'text.secondary',
              },
              '& .MuiPickersDay-today': {
                borderColor: 'primary.main',
              },
              // Fix for dark calendar bottom
              '& .MuiPickersCalendarHeader-root': {
                color: '#2F2F2F',
              },
              '& .MuiDayCalendar-header': {
                backgroundColor: '#FFFFFF',
              },
              '& .MuiPickersDay-dayOutsideMonth': {
                color: '#00000040',
              },
              '& .MuiPickersCalendarHeader-switchViewButton': {
                color: '#2F2F2F',
              },
            }}
          />
        </LocalizationProvider>
      </CardContent>
    </Card>
  )
}

export default Calendar 