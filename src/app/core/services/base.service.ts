import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { Turbine } from '../types/turbine';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  baseUrl = 'https://wtt.pockethost.io';
  pb = new PocketBase(this.baseUrl);

  constructor() {}

  async getTurbines(): Promise<Array<Turbine>> {
    const turbinesRes = await this.pb.collection('turbines').getList(1, 50);
    return turbinesRes.items.map((item) => {
      return {
        id: item.id,
        name: item['name'],
        active: item['active'],
      };
    });
  }

  async updateTurbine(id: string, active: boolean) {
    return await this.pb.collection('turbines').update(id, { active });
  }

  subscribeAllTurbine(call: (e: any) => void) {
    this.pb.collection('turbines').subscribe('*', call);
  }

  unsubscribeAllTurbine() {
    this.pb.collection('turbines').unsubscribe('*');
  }

}
