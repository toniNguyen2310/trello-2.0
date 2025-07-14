// components/common/TextInput.jsx
const TextInput = ({ label, type, name, value, onChange, placeholder }) => (
    <div className="form-group">
        <label htmlFor={name} className="label">{label}</label>
        <input
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
        />
    </div>
)

export default TextInput
