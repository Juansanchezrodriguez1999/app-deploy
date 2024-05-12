export default function TableRow({ data }) {
  return (
    <tr>
      {data.map((item) => {
        return (
          <td className={'whitespace-nowrap p-3'} key={item}>
            {item}
          </td>
        );
      })}
    </tr>
  );
}
