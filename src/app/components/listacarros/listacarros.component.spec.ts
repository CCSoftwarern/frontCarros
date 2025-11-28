import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListacarrosComponent } from './listacarros.component';

describe('ListacarrosComponent', () => {
  let component: ListacarrosComponent;
  let fixture: ComponentFixture<ListacarrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListacarrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListacarrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
