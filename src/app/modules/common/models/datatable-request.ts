export class DataTableRequest
{
    sortCol : string = '';
    sortDirection : string = 'asc';
    pageIndex : number = 0;
    pageSize : number = 5;
    tableFilter : any | null = null;
}