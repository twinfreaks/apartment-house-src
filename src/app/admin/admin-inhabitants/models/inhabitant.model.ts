import {Building} from "app/shared/models/building.model";

export interface Inhabitant {
  id?: number,
  surname?: string,
  name?: string,
  patronymic?: string,
  appartment?: number,
  photo?: string,
  phoneNumber?: string,
  email?: string,
  isActive?: boolean,
  building?: Building
}
