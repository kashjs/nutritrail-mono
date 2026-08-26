export default function FormField({ id, value, onChange, type = 'text', options }) {
    const getValidNumber = (value) => {
        if (type === 'number') {
            return value === '' ? null : Number(value);
        }
        return value;
    };

    if (type === 'select') {
        return (
            <select id={id} value={value} onChange={e => onChange(e.target.value)}>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        );
    }

    return (
        <input id={id} type={type} value={value ?? ''} onChange={e => onChange(getValidNumber(e.target.value))} />
    )
}
