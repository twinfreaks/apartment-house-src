import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
  transform(value: string, arg: string) : string {
    if (value) {
      let length = Number(arg);
      if (value.length < length) return value;
      value = value.slice(0, length);
      let index = value.lastIndexOf(" ");
      value = value.slice(0, index) + ". . .";
      return value;
    }
  }
}
