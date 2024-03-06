import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alphaFilter',
})
export class AlphaFilterPipe implements PipeTransform {
  transform(
    items: any,
    searchText: any,
    columnNames: any[] = [],
    fromPage: string = ''
  ): any[] {
    let exprData: string = '';

    if (!items) return [];
    if (!searchText) return items;

    return items.filter((itm: any) => {
      if (columnNames != null && columnNames.length != 0) {
        if (fromPage == 'inventory')
          exprData = itm[columnNames[0]] + ' ' + itm[columnNames[1]];
        else if (fromPage === 'dragndrop') exprData = itm.value[columnNames[0]];
        else exprData = itm[columnNames[0]];
      } else return items;

      return exprData
        .toString()
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
  }
}
