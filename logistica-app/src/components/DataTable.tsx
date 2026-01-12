import React from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, SortingState, ColumnDef } from '@tanstack/react-table';
import { IonButton, IonSearchbar } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import '../styles/DataTable.scss';

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
}

function DataTable<T>({ data, columns }: DataTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    return (
        <div className="datatable-container">
            <div className="datatable-header">
                <IonSearchbar
                    value={globalFilter}
                    onIonInput={(e) => setGlobalFilter(e.detail.value!)}
                    placeholder="Buscar..."
                    className="datatable-search"
                />
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={header.column.getCanSort() ? 'sortable-header' : ''}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() && (
                                                    <span className="sort-icon">
                                                        {header.column.getIsSorted() === 'asc' ? (
                                                            <FontAwesomeIcon icon={faSortUp} />
                                                        ) : header.column.getIsSorted() === 'desc' ? (
                                                            <FontAwesomeIcon icon={faSortDown} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faSort} />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="datatable-row"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        onClick={(e) => {
                                            // Permitir que los clics en botones/enlaces se propaguen normalmente
                                            const target = e.target as HTMLElement;
                                            if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
                                                return;
                                            }
                                        }}
                                        style={{ cursor: 'default' }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="datatable-pagination">
                <div className="pagination-info">
                    Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{' '}
                    de {table.getFilteredRowModel().rows.length} registros
                </div>
                <div className="pagination-controls">
                    <IonButton
                        fill="outline"
                        size="small"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </IonButton>
                    <span className="page-number">
                        Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    </span>
                    <IonButton
                        fill="outline"
                        size="small"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </IonButton>
                </div>
            </div>
        </div>
    );
}

export default DataTable;