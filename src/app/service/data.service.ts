import { Injectable } from '@angular/core';
import {BlockzUser} from '../blockz-user';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  blockzUser: BlockzUser = new BlockzUser();
  constructor() { }
}
