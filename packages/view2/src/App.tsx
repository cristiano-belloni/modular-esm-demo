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
      return Promise.resolve(res);
    }
    const table = regTableInstance.current as RegularTableElement;
    table.setDataListener(getDataSlice);
    table.addStyleListener(() => {
      const ths: NodeListOf<HTMLTableCellElement> =
        table.querySelectorAll('thead th');
      for (const th of ths) {
        th.style.textAlign = 'left';
        th.style.fontWeight = '900';
        th.style.padding = '0 0 12px 0';
      }
    });
  });

  useEffect(() => {
    (regTableInstance.current as RegularTableElement).draw();
  });

  return <div ref={view}></div>;
}
