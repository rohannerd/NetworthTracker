export const authModalStyles = {
  dialog: {
    '& .MuiDialog-paper': {
      backgroundColor: '#1E293B', // Slightly lighter dark base
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.6)',
    },
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)', // Increased opacity for better contrast
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.4)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#7C3AED',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: '#FFFFFF !important', // Ensure white text is visible
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.8)', // Higher contrast placeholder
        opacity: 1,
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.9)', // Brighter label
      '&.Mui-focused': {
        color: '#7C3AED',
      },
    },
    '& .MuiInputAdornment-root': {
      color: 'rgba(255, 255, 255, 0.8)', // Brighter icons
    },
  },
};