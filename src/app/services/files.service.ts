import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

//La interface y sus atributos lo sacamos de lo que nos retorna el Insomnia/Postman para tipar el onUpload()
interface File {
  originalname: string;
  filename: string;
  location: string;
}

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private apiUrl = `${environment.API_URL}/api/files`;

  constructor(private http: HttpClient) {}

  getFile(name: string, url: string, type: string) {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      //arriba obtuvimos el archivo pero no es descargable
      tap((content) => {
        const blob = new Blob([content], { type });
        saveAs(blob, name);
      }),
      map(() => true)
    );
  }

  uploadFile(file: Blob) {
    //no podemos enviarlo como JSON, lo enviamos como un objeto nativo de HTML para enviar este tipo de datos
    const dto = new FormData();
    dto.append('file', file); //'file' es bajo el nombre que nos indique el backend

    //Algunos endpoints exigen que vaya con un header específico
    const headers = new HttpHeaders();
    headers.set('Content-type', 'multipart/form-data');

    return this.http.post<File>(`${this.apiUrl}/upload`, dto, {headers});
  }
}
