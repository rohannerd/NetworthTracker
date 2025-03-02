export const authModalStyles = {
  dialog: {
    '& .MuiDialog-paper': {
      backgroundColor: '#1E293B', // Solid color instead of rgba
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.6)',
    }
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)'
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#7C3AED'
      }
    },
    '& .MuiOutlinedInput-input': {
      color: '#FFFFFF !important', // Force white color
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.5)',
        opacity: 1
      }
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.9)',
      '&.Mui-focused': {
        color: '#7C3AED'
      }
    },
    '& .MuiInputAdornment-root': {
      color: 'rgba(255, 255, 255, 0.7)'
    }
  }
};