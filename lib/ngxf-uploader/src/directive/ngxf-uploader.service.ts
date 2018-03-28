import { HttpParams, HttpHeaders } from '@angular/common/http';
import {
  HttpErrorResponse,
  HttpHeaderResponse,
  HttpEventType,
  HttpRequest,
  HttpClient
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { filter, map, catchError } from 'rxjs/operators';

@Injectable()
export class NgxfUploaderService {

  constructor(private http: HttpClient) { }

  upload(d: UploadObject): Observable<UploadEvent> {
    if ((d.files instanceof File) || (d.files instanceof Array && d.files.length !== 0)) {
      const ufData = new FormData();

      if (d.files instanceof File) {
        ufData.append(<string>d.filesKey || 'file', d.files, d.files.name);
      } else {
        for (let i = 0; i < d.files.length; i++) {

          let key = 'file';

          // If it has key
          if (d.filesKey) {
            if (d.filesKey instanceof Array) {
              key = d.filesKey[i % d.filesKey.length];
            } else {
              key = d.filesKey;
            }
          }
          ufData.append(key, d.files[i], d.files[i].name);
        }
      }

      if (d.fields) {
        Object.keys(d.fields).forEach(key => ufData.append(key, d.fields[key]));
      }


      let url = d.url;
      let req;
      let params: any;

      if (d.params && !(d.params instanceof HttpParams)) {
        url = `${url}?${this.addPamars(d.params)}`;
      } else {
        params = d.params;
      }


      if (d.headers instanceof HttpHeaders) {
        req = new HttpRequest(d.method || 'POST', url, ufData, {
          headers: d.headers,
          params: params,
          reportProgress: d.process,
        });
      } else {
        req = new HttpRequest(d.method || 'POST', url, ufData, {
          headers: new HttpHeaders(d.headers),
          params: params,
          reportProgress: d.process,
        });
      }

      return this.http.request(req).pipe(
        filter((r: any) => {
          if (d.process) {
            return !(r instanceof HttpHeaderResponse || r.type === HttpEventType.DownloadProgress);
          }
          return (r.type === HttpEventType.Response);
        }),
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.Sent:
              return <UploadEvent>{
                status: UploadStatus.Uploading,
                percent: 0
              };
            case HttpEventType.UploadProgress:
              return <UploadEvent>{
                status: UploadStatus.Uploading,
                percent: Math.round(100 * event.loaded / event.total) || 0
              };
            case HttpEventType.Response:
              return <UploadEvent>{
                status: UploadStatus.Completed,
                percent: 100,
                data: event.body
              };
          }
        }),
        catchError((error: HttpErrorResponse) => {
          return ErrorObservable.create(<UploadEvent>{
            status: UploadStatus.UploadError,
            data: error.error
          });
        })
      );
    } else {
      return ErrorObservable.create(<UploadEvent>{ status: UploadStatus.FileNumError }).pipe(
        map((error: any) => error)
      );
    }
  }

  private addPamars(params: { [name: string]: string | string[] }) {
    let url = '';

    Object.keys(params).forEach(key => {
      url = `${url}${key}=${params[key]}&`;
    });
    return url.slice(0, -1);
  }
}

export const enum FileError {
  NumError,
  TypeError,
  SizeError
}

export const enum UploadStatus {
  Uploading,
  Completed,
  UploadError,
  FileNumError
}

export interface UploadObject {
  url: string;
  files: File | File[];
  headers?: { [name: string]: string | string[] } | HttpHeaders;
  params?: { [name: string]: string | string[] } | HttpParams;
  fields?: any;
  filesKey?: string | string[];
  process?: boolean;
  method?: string; // Custom your method Default is POST
}

export interface UploadEvent {
  status: UploadStatus;
  percent: number;
  data?: any;
}

export interface FileOption {
  size: { min?: number, max?: number }; // unit: Byte
}
