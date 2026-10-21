interface BaseProps {
    id: string;
    value: string | number | null;
    onChange: (val: string | number | null) => void;
}

interface SelectFieldProps extends BaseProps {
    type: 'select';
    options: string[];
}

interface InputFieldProps extends BaseProps {
    type?: 'number' | 'text' | 'datetime-local';
    options?: never;
}

type FormFieldProps = SelectFieldProps | InputFieldProps;

export default function FormField(params: FormFieldProps) {
    const { id, value, onChange, type = 'text' } = params;
    const getValidNumber = (value: number | string) => {
        if (type === 'number') {
            return value === '' ? null : Number(value);
        }
        return value;
    };

    if (params.type === 'select') {
        return (
            <select id={id} value={value ?? ''} onChange={e => onChange(e.target.value)}>
                {params.options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        );
    }

    return (
        <input id={id} type={type} value={value ?? ''} onChange={e => onChange(getValidNumber(e.target.value))} />
    )
}
