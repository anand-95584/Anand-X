import { VehicleEntity } from '../types/game';

export interface VehicleConfig {
  type: 'JEEP' | 'SPORTS_CAR' | 'MONSTER_TRUCK' | 'PICKUP';
  name: string;
  icon: string;
  color: string;
  maxSpeed: number;
  acceleration: number;
  reverseSpeed: number;
  turnSpeed: number;
  maxHp: number;
  description: string;
}

export const VEHICLE_CONFIGS: Record<VehicleEntity['type'], VehicleConfig> = {
  JEEP: {
    type: 'JEEP',
    name: 'Military Jeep',
    icon: '🚙',
    color: '#4d7c0f', // Olive Military Green
    maxSpeed: 0.85,
    acceleration: 0.025,
    reverseSpeed: 0.35,
    turnSpeed: 0.045,
    maxHp: 800,
    description: '4x4 Off-road tactical Jeep with heavy chassis.',
  },
  SPORTS_CAR: {
    type: 'SPORTS_CAR',
    name: 'Cobalt Sports Car',
    icon: '🏎️',
    color: '#2563eb', // Electric Royal Blue
    maxSpeed: 1.35,
    acceleration: 0.045,
    reverseSpeed: 0.45,
    turnSpeed: 0.055,
    maxHp: 550,
    description: 'Ultra-fast aerodynamic sports car for rapid zone rotations.',
  },
  MONSTER_TRUCK: {
    type: 'MONSTER_TRUCK',
    name: 'Monster Truck 4x4',
    icon: '🛻',
    color: '#dc2626', // Flame Crimson
    maxSpeed: 0.95,
    acceleration: 0.03,
    reverseSpeed: 0.4,
    turnSpeed: 0.035,
    maxHp: 1200,
    description: 'Gigantic reinforced wheels capable of crushing barricades.',
  },
  PICKUP: {
    type: 'PICKUP',
    name: 'Utility Pickup',
    icon: '🛻',
    color: '#d97706', // Desert Amber
    maxSpeed: 0.75,
    acceleration: 0.02,
    reverseSpeed: 0.3,
    turnSpeed: 0.04,
    maxHp: 700,
    description: 'Durable utility truck for team transport.',
  },
};

export const INITIAL_VEHICLES: VehicleEntity[] = [
  {
    id: 'veh_jeep_1',
    type: 'JEEP',
    name: 'Military Jeep',
    x: 15,
    y: 0,
    z: 25,
    rotationY: 0.5,
    speed: 0,
    maxSpeed: 0.85,
    acceleration: 0.025,
    hp: 800,
    maxHp: 800,
  },
  {
    id: 'veh_sport_1',
    type: 'SPORTS_CAR',
    name: 'Cobalt Sports Car',
    x: -30,
    y: 0,
    z: -45,
    rotationY: 2.1,
    speed: 0,
    maxSpeed: 1.35,
    acceleration: 0.045,
    hp: 550,
    maxHp: 550,
  },
  {
    id: 'veh_monster_1',
    type: 'MONSTER_TRUCK',
    name: 'Monster Truck 4x4',
    x: 65,
    y: 0,
    z: -70,
    rotationY: -1.2,
    speed: 0,
    maxSpeed: 0.95,
    acceleration: 0.03,
    hp: 1200,
    maxHp: 1200,
  },
  {
    id: 'veh_jeep_2',
    type: 'JEEP',
    name: 'Military Jeep',
    x: -80,
    y: 0,
    z: 60,
    rotationY: 1.5,
    speed: 0,
    maxSpeed: 0.85,
    acceleration: 0.025,
    hp: 800,
    maxHp: 800,
  },
  {
    id: 'veh_pickup_1',
    type: 'PICKUP',
    name: 'Utility Pickup',
    x: 0,
    y: 0,
    z: 85,
    rotationY: -0.8,
    speed: 0,
    maxSpeed: 0.75,
    acceleration: 0.02,
    hp: 700,
    maxHp: 700,
  },
];
