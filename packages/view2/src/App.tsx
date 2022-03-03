import 'regular-table/dist/css/material.css';
import React, { useEffect, useRef } from 'react';
import 'regular-table';
import type {
  RegularTableElement,
  DataResponse,
  MetaData,
} from 'regular-table';
import { country, domainName, word } from 'minifaker';
import 'minifaker/locales/en';

interface ExtendedResponse extends DataResponse {
  metadata: string[][];
}

interface ExtendedMetadata extends MetaData {
  user: 'green' | 'red';
}

const colors = { green: '#e4ebe4', red: '#f1dbdb' };

function createPeople(n: number) {
  const map = [
    () =>
      `${capitalize(word({ type: 'adjective' }))} ${capitalize(
        word({ type: 'noun' }),
      )}`,
    () => String(Math.ceil(Math.random() * 100)),
    () => country({ useCode: 'alpha3' }),
    domainName,
    () => String((Math.random() * 1000).toFixed(2)),
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

  const people: string[][] = createPeople(5000);

  useEffect(() => {
    const regularTable = document.createElement('regular-table');
    regTableInstance.current = regularTable;
    view.current?.appendChild(regularTable);
    function getDataSlice(x0: number, y0: number, x1: number, y1: number) {
      const metadata = [];
      for (let i = 0; i < people[4].length; i += 1) {
        const priceInc = Math.random() * 100 - 50;
        people[4][i] = String((parseFloat(people[4][i]) + priceInc).toFixed(2));
        metadata[i] = priceInc < 0 ? 'red' : 'green';
      }

      const res: ExtendedResponse = {
        num_rows: people[0].length,
        num_columns: people.length,
        data: people.slice(x0, x1).map((col) => col.slice(y0, y1)),
        column_headers: [
          ['Company Name'],
          ['Employees'],
          ['Country'],
          ['Domain'],
          ['Price'],
        ],
        metadata: [[], [], [], [], metadata],
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
      const thd: NodeListOf<HTMLTableCellElement> =
        table.querySelectorAll('body td');
      for (const td of thd) {
        const meta = table.getMeta(td) as ExtendedMetadata;
        if (meta.user) {
          td.style.backgroundColor = colors[meta.user];
        }
      }
    });
  });

  useEffect(() => {
    (regTableInstance.current as RegularTableElement).draw();
    setInterval(
      () => (regTableInstance.current as RegularTableElement).draw(),
      1000,
    );
  });

  return <div ref={view}></div>;
}

function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}
