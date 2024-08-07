import { Input } from '@/components/ui/input';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Option = {
  label: string;
  value: string;
};

export const TableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);
  const [validationMessage, setValidationMessage] = useState('');

  console.log(`header`, row.getValue());
  useEffect(() => {
    setValue(initialValue);
    if (tableMeta?.editedRows[row.id] === false) {
      setValidationMessage('');
    }
  }, [initialValue, tableMeta?.editedRows[row.id]]);

  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    displayValidationMessage(e);
    if (validationMessage) {
      tableMeta?.setEditedRows((old: []) => ({
        ...old,
        [row.id]: !old[row.id],
      }));
      tableMeta?.revertData(row.index);
      return;
    }
    tableMeta?.updateData(row.index, column.id, value, e.target.validity.valid);
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    displayValidationMessage(e);
    setValue(e.target.value);
    tableMeta?.updateData(
      row.index,
      column.id,
      e.target.value,
      e.target.validity.valid
    );
  };

  const displayValidationMessage = <
    T extends HTMLInputElement | HTMLSelectElement,
  >(
    e: ChangeEvent<T>
  ) => {
    if (columnMeta?.validate) {
      const isValid = columnMeta.validate(e.target.value);
      if (isValid) {
        e.target.setCustomValidity('');
        setValidationMessage('');
      } else {
        e.target.setCustomValidity(columnMeta.validationMessage);
        setValidationMessage(columnMeta.validationMessage);
        toast.error(`Invalid data!`);
      }
    } else if (e.target.validity.valid) {
      setValidationMessage('');
    } else {
      setValidationMessage(e.target.validationMessage);
    }
  };

  if (tableMeta)
    if (tableMeta?.editedRows[row.id]) {
      return columnMeta?.type === 'select' ? (
        <select
          onChange={onSelectChange}
          value={initialValue}
          required={columnMeta?.required}
          title={validationMessage}
        >
          {columnMeta?.options?.map((option: Option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            type={columnMeta?.type || 'text'}
            required={columnMeta?.required}
            pattern={columnMeta?.pattern}
            className={validationMessage ? 'border-red-500' : ''}
          />
          <span className="text-red-500">{validationMessage}</span>
        </>
      );
    }
  return <span>{value}</span>;
};
