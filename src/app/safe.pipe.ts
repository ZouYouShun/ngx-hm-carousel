import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

// https://forum.ionicframework.com/t/inserting-html-via-angular-2-use-of-domsanitizationservice-bypasssecuritytrusthtml/62562/5
@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  public transform(value: string, type: string = 'html'): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html': return this._sanitizer.bypassSecurityTrustHtml(value);
      case 'style': return this._sanitizer.bypassSecurityTrustStyle(value);
      case 'background-image': return this._sanitizer.bypassSecurityTrustStyle(
        `url('${value}')`
      );
      case 'youtu-background-image':
        const url = value.split('/');
        return this._sanitizer.bypassSecurityTrustStyle(
          `url('https://i.ytimg.com/vi/${url[url.length - 1]}/hqdefault.jpg')`
        ); // https://i.ytimg.com/vi/HSOtku1j600/hqdefault.jpg
      case 'script':
        return this._sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        if (!value) {
          value = 'assets/img/avatar.jpg';
        }
        return this._sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this._sanitizer.bypassSecurityTrustResourceUrl(value);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
  }

}
