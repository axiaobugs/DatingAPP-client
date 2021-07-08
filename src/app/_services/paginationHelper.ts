import {PaginatedResult} from "../_models/pagination";
import {map} from "rxjs/operators";
import {HttpClient, HttpParams} from "@angular/common/http";

export function getPaginatedResult<T>(url,params,http:HttpClient) {
  const paginatedResult:PaginatedResult<T> = new PaginatedResult<T>();
  // observe:'response' not only get the response body  but also get the pagination from the header
  return http.get<T>(url, {observe: 'response', params}).pipe(
    map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination') !== null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
      }
      return paginatedResult;
    })
  )
}

export function getPaginationHeaders(pageNumber:number,pageSize:number){
  let params = new HttpParams();
  params = params.append('pageNumber',pageNumber.toString())
  params = params.append('pageSize',pageSize.toString())
  return params;
}
