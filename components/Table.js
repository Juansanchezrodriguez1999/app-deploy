import TableRow from '@/components/TableRow';

export default function Table({ theadData, tbodyData }) {
  return (
    <table className="w-full divide-y divide-gray-100 rounded-lg border border-gray-300 bg-gray-50">
      <thead>
        <tr>
          {theadData.map((col, idx) => {
            return (
              <th key={idx} className="whitespace-nowrap p-2">
                <div className="text-left font-semibold text-asafe_turquoise">{col}</div>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {tbodyData.map((row) => {
          return <TableRow key={row.key} data={row.items} />;
        })}
      </tbody>
    </table>
  );
}
