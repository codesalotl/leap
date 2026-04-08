import type { Column, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';

// export const getCommonPinningStyles = <TData>(
//     column: Column<TData>,
// ): CSSProperties => {
//     const isPinned = column.getIsPinned();
//     const isLastLeftPinnedColumn =
//         isPinned === 'left' && column.getIsLastColumn('left');
//     const isFirstRightPinnedColumn =
//         isPinned === 'right' && column.getIsFirstColumn('right');

//     return {
//         boxShadow: isLastLeftPinnedColumn
//             ? '-4px 0 4px -4px gray inset'
//             : isFirstRightPinnedColumn
//               ? '1px 0 0 0 var(--muted) inset'
//               : undefined,
//         left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
//         right:
//             isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
//         position: isPinned ? 'sticky' : 'relative',
//         width: column.getSize(),
//         backgroundColor: isFirstRightPinnedColumn ? 'var(--background)' : '',
//     };
// };

export const getCommonPinningStyles = <TData>(
    column: Column<TData>,
    table: Table<any>,
): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
        isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn =
        isPinned === 'right' && column.getIsFirstColumn('right');

    const size = column.getSize();

    const unpinnedTotal = table
        .getAllColumns()
        .filter((col) => !col.getIsPinned())
        .reduce((acc, col) => acc + col.getSize(), 0);

    // 2. Calculate this specific column's weight
    const percentage = (size / unpinnedTotal) * 100;

    return {
        boxShadow: isLastLeftPinnedColumn
            ? '-4px 0 4px -4px gray inset'
            : isFirstRightPinnedColumn
              ? //   ? '4px 0 4px -4px gray inset'
                '1px 0 0 0 var(--muted) inset'
              : undefined,

        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right:
            isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        // opacity: isPinned ? 0.95 : 1,
        position: isPinned ? 'sticky' : 'relative',

        // width: `${size / 16}rem`,
        // minWidth: `${size / 16}rem`,
        // maxWidth: `${size / 16}rem`,
        // width: `${size}px`,
        // minWidth: `${size}px`,
        // maxWidth: `${size}px`,
        // maxWidth: isPinned ? `${size}px` : undefined,
        // width: isPinned ? `${size}px` : 'auto',

        // width: isPinned ? `${size}px` : 'auto',
        width: isPinned ? `${size}px` : `${percentage}%`,
        minWidth: `${size}px`,
        maxWidth: isPinned ? `${size}px` : undefined,

        zIndex: isPinned ? 1 : 0,
        backgroundColor: isFirstRightPinnedColumn ? 'var(--background)' : '',
    };
};
