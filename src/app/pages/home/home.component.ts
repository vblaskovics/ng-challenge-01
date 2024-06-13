import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { BaseService } from '../../core/services/base.service';
import { Turbine } from '../../core/types/turbine';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  destroyRef = inject(DestroyRef);

  baseService = inject(BaseService);

  turbines$ = signal<Array<Turbine>>([]);

  async ngOnInit() {
    const turbines = await this.baseService.getTurbines();
    this.turbines$.set(turbines);

    this.baseService.subscribeAllTurbine((res) => {
      const turbineRecord: Turbine = res.record;
      this.turbines$.update((turbines) =>
        turbines.map((t) => (t.id === turbineRecord.id ? turbineRecord : t))
      );
    });
  }

  onClickTurbineStatus(turbine: Turbine) {
    this.baseService.updateTurbine(turbine.id, !turbine.active);
  }

  ngOnDestroy(): void {
    this.baseService.unsubscribeAllTurbine();
  }
}
