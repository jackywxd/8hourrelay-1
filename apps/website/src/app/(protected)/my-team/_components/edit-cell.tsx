import { MouseEvent } from 'react';
import { MdCheck, MdEdit, MdUndo } from 'react-icons/md';

export const EditCell = ({ row, table }) => {
  const meta = table.options.meta;
  const validRow = meta?.validRows[row.id];
  const disableSubmit = validRow
    ? Object.values(validRow)?.some((item) => !item)
    : false;

  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old: []) => ({
      ...old,
      [row.id]: !old[row.id],
    }));
    if (elName !== 'edit') {
      e.currentTarget.name === 'cancel'
        ? meta?.revertData(row.index)
        : meta?.updateRow(row.index);
    }
  };

  const removeRow = () => {
    meta?.removeRow(row.index);
  };

  if (meta.isEditable === false) return null;
  return (
    <div className="edit-cell-container">
      {
        meta?.editedRows[row.id] ? (
          <div className="flex gap-5">
            <button onClick={setEditedRows} name="cancel">
              <MdUndo size={24} />
            </button>{' '}
            <button
              onClick={setEditedRows}
              name="done"
              disabled={disableSubmit}
            >
              <MdCheck size={24} />
            </button>
          </div>
        ) : (
          <button onClick={setEditedRows} name="edit">
            <MdEdit size={24} />
          </button>
        )
        // <div className="edit-cell-action">
        //   <button onClick={setEditedRows} name="edit">
        //     ✐
        //   </button>
        //   <button onClick={removeRow} name="remove">
        //     X
        //   </button>
        // </div>
      }
      {/* <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      /> */}
    </div>
  );
};
