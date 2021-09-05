import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Node} from '../Models/node.model';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  _server = "https://node-tree-app-01.herokuapp.com/nodes";

  constructor(private httpClient: HttpClient) { }

  get() : Observable<Node[]>  {
    return this.httpClient.get<Node[]>(this._server);
  }

  getCSV() : Observable<Blob>{
    return this.httpClient.get(this._server +'/exportCsv', { responseType: 'blob' });
  }

  edit(id: number, name: string) : Observable<any> {
    const body = { name: name };
    return this.httpClient.put<any>(this._server +'/' + id, body);
  }

  post(node: Node) : Observable<Node>  {
    const httpHeaders = { headers:new HttpHeaders({'Content-Type': 'application/json'}) };
    const data = {parent: node.parent, node };
    
    return this.httpClient
      .post<Node>(this._server, JSON.stringify(data), httpHeaders);
  }

  delete(id: number) : Observable<any>{
    return this.httpClient.delete(this._server + '/' + id);
  }
}
