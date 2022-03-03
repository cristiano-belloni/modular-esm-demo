import 'regular-table/dist/css/material.css';
import React, { useEffect, useRef } from 'react';
import 'regular-table';
import type { RegularTableElement, DataResponse } from 'regular-table';
import { name, jobTitle, streetAddress, cityName, domainName } from 'minifaker';
import 'minifaker/locales/en';

function createPeople(n: number) {
  const map = [
    name,
    jobTitle,
    () => `${streetAddress()}, ${cityName()}`,
    domainName,
  ];

  const columns: string[][] = [];
  for (let columnIndex = 0; columnIndex < map.length; columnIndex += 1) {
    const row: string[] = [];
    for (let rowIndex = 0; rowIndex < n; rowIndex += 1) {
      row.push(map[columnIndex]());
    }
    columns.push(row);
  }
  return columns;
}

export default function App(): JSX.Element {
  const view = useRef<HTMLDivElement>(null);
  const regTableInstance = useRef<unknown>(null);

  const people: string[][] = createPeople(7000);

  useEffect(() => {
    const regularTable = document.createElement('regular-table');
    regTableInstance.current = regularTable;
    view.current?.appendChild(regularTable);
    function getDataSlice(x0: number, y0: number, x1: number, y1: number) {
      const res: DataResponse = {
        num_rows: people[0].length,
        num_columns: people.length,
        data: people.slice(x0, x1).map((col) => col.slice(y0, y1)),
        column_headers: [
          ['Name'],
          ['Job Title'],
          ['Address'],
          ['Internet Domain'],
        ],
      };
      console.log(res, { x0, x1 }, { y0, y1 });
      return Promise.resolve(res);
    }
    (regTableInstance.current as RegularTableElement).setDataListener(
      getDataSlice,
    );
  });

  useEffect(() => {
    console.log(regTableInstance.current);

    (regTableInstance.current as RegularTableElement).draw();
  });

  return <div ref={view}></div>;
}
