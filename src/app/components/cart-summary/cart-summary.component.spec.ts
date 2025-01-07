import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryComponent } from './cart-summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate correct totals', () => {
    component.items = [
      {
        id: '1',
        name: 'Test Item',
        price: 100,
        quantity: 2,
        image: 'test.jpg',
      },
    ];

    expect(component.subtotal).toBe(200);
    expect(component.vat).toBe(40); // 20% of 200
    expect(component.grandTotal).toBe(290); // 200 + 50 shipping + 40 VAT
  });
});
