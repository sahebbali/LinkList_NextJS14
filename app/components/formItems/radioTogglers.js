

export default function RadioTogglers({options,defaultValue,onChange}) {
  return (
    <div className="radio-togglers shadow">
      {options.map(option => (
        <label key={option.value}>
          <input
            type="radio"
            name="bgType"
            onClick={ev => onChange(ev.target.value)}
            defaultChecked={defaultValue === option.value}
            value={option.value}/>
          <div>
            <option.icon />
            <span>{option.label}</span>
          </div>
        </label>
      ))}
    </div>
  );
}