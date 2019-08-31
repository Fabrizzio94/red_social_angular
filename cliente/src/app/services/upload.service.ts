import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
@Injectable()
export class UploadService {
    public url: string;
    constructor() {
        this.url = GLOBAL.url;
    }

    reqFile(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {
        return new Promise(function(resolve, reject) {
            // tslint:disable-next-line:prefer-const
            let formData: any =  new FormData();
            // tslint:disable-next-line:prefer-const
            let xhr = new XMLHttpRequest();
            // console.log(xhr);
            // tslint:disable-next-line:prefer-const
            for (let i of files) {
                formData.set(name, i,  i.name);
            }
            xhr.onreadystatechange = function() {
                // tslint:disable-next-line:triple-equals
                if (this.readyState == 4) {
                    // tslint:disable-next-line:triple-equals
                    if (this.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}
