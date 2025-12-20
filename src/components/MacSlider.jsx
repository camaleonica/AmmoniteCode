import './MacSlider.css'

const MacSlider = ({ label, value, onChange, min, max, step = 1, ...props }) => {
  return (
    <div className="mac-slider-container">
      {label && <label className="mac-slider-label">{label}: {value}</label>}
      <div className="mac-slider-wrapper">
        <input
          type="range"
          className="mac-slider"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          {...props}
        />
      </div>
    </div>
  )
}

export default MacSlider

