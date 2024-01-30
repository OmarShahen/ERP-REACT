import { DataGrid } from '@mui/x-data-grid';


export default function DataTable({ rows=[], columns=[] }) {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[25]}
      />
    </div>
  );
}