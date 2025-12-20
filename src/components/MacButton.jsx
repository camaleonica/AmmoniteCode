import './MacButton.css'

const MacButton = ({ 
  children, 
  onClick, 
  variant = 'default',
  size = 'medium',
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <button
      className={`mac-button mac-button-${variant} mac-button-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default MacButton

