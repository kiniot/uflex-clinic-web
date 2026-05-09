import { TestBed } from '@angular/core/testing';
import { DeviceStore } from './device.store';

describe('DeviceStore', () => {
  let store: DeviceStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(DeviceStore);
  });

  it('counts every device whose status is not offline as an active kit', () => {
    // 4 mocked devices — one offline (id 3) → 3 active kits
    expect(store.totalActiveKits()).toBe(3);
  });

  it('counts the devices that need recalibration', () => {
    // Only the offline kit (id 3) has calibrationStatus === "expired"
    expect(store.requiresCalibration()).toBe(1);
  });

  it('computes the online percentage as a rounded ratio', () => {
    // 2 devices online out of 4 → 50%
    expect(store.onlinePercentage()).toBe(50);
  });

  it('computes the available units percentage from the fleet connectivity snapshot', () => {
    const snapshot = store.fleetConnectivity();
    const expected =
      snapshot.totalUnits === 0
        ? 0
        : Math.round((snapshot.availableUnits / snapshot.totalUnits) * 100);

    expect(store.availableUnitsPct()).toBe(expected);
  });
});
