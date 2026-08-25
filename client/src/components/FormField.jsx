export default function FormField({readOnly, value, onChange, type = 'text', options}) {
    const getValidNumber = (value) => {
        if (type === 'number') {
            return value === '' ? null : Number(value);
        }
        return value;
    };

    if (type === 'select') {
        return (
            <select value={value} onChange={e => onChange(e.target.value)} disabled={readOnly}>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        );
    }

    return (
        <input type={type} value={value ?? ''} onChange={e => onChange(getValidNumber(e.target.value))} disabled={readOnly}/>
    )
}
