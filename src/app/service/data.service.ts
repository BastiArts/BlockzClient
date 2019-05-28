import {Injectable} from '@angular/core';
import {BlockzUser} from '../classes/blockz-user';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  blockzUser: BlockzUser = new BlockzUser();
  chosenGame: string = '';
  constructor() { }
}
