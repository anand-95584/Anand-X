import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AirDropEntity, DamageIndicator, GameMode, GlooWallEntity, ItemLoot, PlayerState, VehicleEntity } from '../types/game';
import { CHARACTERS, GLOO_WALL_SKINS, WEAPONS } from '../utils/constants';
import { soundManager } from '../utils/sound';

interface GameCanvasProps {
  gameMode: GameMode;
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
  bots: PlayerState[];
  setBots: React.Dispatch<React.SetStateAction<PlayerState[]>>;
  glooWalls: GlooWallEntity[];
  setGlooWalls: React.Dispatch<React.SetStateAction<GlooWallEntity[]>>;
  vehicles: VehicleEntity[];
  setVehicles: React.Dispatch<React.SetStateAction<VehicleEntity[]>>;
  airDrops: AirDropEntity[];
  setAirDrops: React.Dispatch<React.SetStateAction<AirDropEntity[]>>;
  loots: ItemLoot[];
  setLoots: React.Dispatch<React.SetStateAction<ItemLoot[]>>;
  safeZone: { radius: number; centerX: number; centerZ: number; isShrinking: boolean };
  onKill: (killerName: string, victimName: string, weaponName: string, isHeadshot: boolean) => void;
  onGameOver: (isBooyah: boolean) => void;
  addDamageIndicator: (dmg: number, isHeadshot: boolean, x: number, y: number, z: number) => void;
  keysPressed: Record<string, boolean>;
  isShootingRef: React.MutableRefObject<boolean>;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameMode,
  playerState,
  setPlayerState,
  bots,
  setBots,
  glooWalls,
  setGlooWalls,
  vehicles,
  setVehicles,
  airDrops,
  setAirDrops,
  loots,
  setLoots,
  safeZone,
  onKill,
  onGameOver,
  addDamageIndicator,
  keysPressed,
  isShootingRef,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Meshes mapped by ID
  const playerMeshGroup = useRef<THREE.Group | null>(null);
  const botMeshesMap = useRef<Map<string, THREE.Group>>(new Map());
  const glooMeshesMap = useRef<Map<string, THREE.Group>>(new Map());
  const vehicleMeshesMap = useRef<Map<string, THREE.Group>>(new Map());
  const airDropMeshesMap = useRef<Map<string, THREE.Group>>(new Map());
  const lootMeshesMap = useRef<Map<string, THREE.Group>>(new Map());
  const zoneCylinderMesh = useRef<THREE.Mesh | null>(null);
  const alokAuraMesh = useRef<THREE.Mesh | null>(null);

  // Timing
  const lastShotTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Clear Bermuda sky blue
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.003);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaf0, 1.2);
    dirLight.position.set(120, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 500;
    const d = 150;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // 5. Ground / Terrain (Bermuda Green Hills & Dust)
    const groundGeo = new THREE.PlaneGeometry(500, 500, 64, 64);
    // Add height variation for hills
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      // Gentle Bermuda hills equation
      const heightVal = Math.sin(vx * 0.02) * Math.cos(vy * 0.02) * 2.5 + Math.sin(vx * 0.05) * 1.2;
      pos.setZ(i, heightVal);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x4b7b32,
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Roads
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.9 });
    const roadHorizontal = new THREE.Mesh(new THREE.PlaneGeometry(500, 12), roadMat);
    roadHorizontal.rotation.x = -Math.PI / 2;
    roadHorizontal.position.y = 0.05;
    scene.add(roadHorizontal);

    const roadVertical = new THREE.Mesh(new THREE.PlaneGeometry(12, 500), roadMat);
    roadVertical.rotation.x = -Math.PI / 2;
    roadVertical.position.y = 0.05;
    scene.add(roadVertical);

    // Build Landmarks (Bermuda: Factory, Clock Tower, Warehouses)
    buildLandmarks(scene);

    // Safe Zone Cylinder
    const zoneGeo = new THREE.CylinderGeometry(safeZone.radius, safeZone.radius, 100, 32, 1, true);
    const zoneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);
    zoneMesh.position.set(safeZone.centerX, 50, safeZone.centerZ);
    scene.add(zoneMesh);
    zoneCylinderMesh.current = zoneMesh;

    // Create Player Mesh Group
    const playerGroup = createCharacterMesh(playerState.characterId, false);
    scene.add(playerGroup);
    playerMeshGroup.current = playerGroup;

    // Create Alok Aura Mesh
    const auraGeo = new THREE.RingGeometry(0.1, 5, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.rotation.x = -Math.PI / 2;
    auraMesh.position.y = 0.1;
    auraMesh.visible = false;
    scene.add(auraMesh);
    alokAuraMesh.current = auraMesh;

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        mountRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Construct Landmark Structures in Three.js (Factory, Clock Tower, Warehouses, Trees)
  const buildLandmarks = (scene: THREE.Scene) => {
    // 1. FACTORY (Center Industrial Building)
    const factoryGroup = new THREE.Group();
    factoryGroup.position.set(-60, 0, -60);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.6 }); // FF Factory Yellow
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
    
    // Main Factory Body
    const factoryBody = new THREE.Mesh(new THREE.BoxGeometry(30, 14, 40), wallMat);
    factoryBody.position.y = 7;
    factoryBody.castShadow = true;
    factoryBody.receiveShadow = true;
    factoryGroup.add(factoryBody);

    // Roof Top Jump Floor
    const factoryRoof = new THREE.Mesh(new THREE.BoxGeometry(32, 1, 42), roofMat);
    factoryRoof.position.y = 14.5;
    factoryRoof.castShadow = true;
    factoryGroup.add(factoryRoof);

    // Factory Smokestacks / Silos
    const siloGeo = new THREE.CylinderGeometry(3, 3, 20, 16);
    const siloMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
    const silo1 = new THREE.Mesh(siloGeo, siloMat);
    silo1.position.set(-18, 10, -10);
    factoryGroup.add(silo1);

    scene.add(factoryGroup);

    // 2. CLOCK TOWER (Nostalgic Clock Tower Landmark)
    const clockTowerGroup = new THREE.Group();
    clockTowerGroup.position.set(60, 0, 60);

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 });
    const towerBody = new THREE.Mesh(new THREE.BoxGeometry(10, 35, 10), stoneMat);
    towerBody.position.y = 17.5;
    towerBody.castShadow = true;
    clockTowerGroup.add(towerBody);

    // Clock Face
    const clockFaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const clockFace = new THREE.Mesh(new THREE.CircleGeometry(2.5, 16), clockFaceMat);
    clockFace.position.set(0, 30, 5.1);
    clockTowerGroup.add(clockFace);

    scene.add(clockTowerGroup);

    // 3. WAREHOUSES
    [-100, 100].forEach((xPos, idx) => {
      const warehouseGroup = new THREE.Group();
      warehouseGroup.position.set(xPos, 0, idx === 0 ? 80 : -80);

      const whMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 }); // Red Shed
      const whMesh = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 30), whMat);
      whMesh.position.y = 5;
      whMesh.castShadow = true;
      warehouseGroup.add(whMesh);

      scene.add(warehouseGroup);
    });

    // 4. TREES, ROCKS & COVER BARRELS
    const treeGeo = new THREE.ConeGeometry(3.5, 9, 8);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
    const trunkGeo = new THREE.CylinderGeometry(0.6, 0.8, 4, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });

    for (let i = 0; i < 40; i++) {
      const tx = (Math.random() - 0.5) * 400;
      const tz = (Math.random() - 0.5) * 400;
      // avoid building overlapping
      if (Math.abs(tx) < 20 && Math.abs(tz) < 20) continue;

      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 2;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliage = new THREE.Mesh(treeGeo, treeMat);
      foliage.position.y = 7;
      foliage.castShadow = true;
      tree.add(foliage);

      scene.add(tree);
    }

    // Explosive Barrels
    const barrelGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.8, 12);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    for (let i = 0; i < 15; i++) {
      const bx = (Math.random() - 0.5) * 350;
      const bz = (Math.random() - 0.5) * 350;
      const barrel = new THREE.Mesh(barrelGeo, barrelMat);
      barrel.position.set(bx, 1.4, bz);
      barrel.castShadow = true;
      scene.add(barrel);
    }
  };

  // Helper to create 3D Character Mesh
  const createCharacterMesh = (charId: string, isBot: boolean): THREE.Group => {
    const group = new THREE.Group();
    const charDef = CHARACTERS.find((c) => c.id === charId) || CHARACTERS[0];

    // Colors
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.5 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: isBot ? 0xd97706 : 0x1e293b, roughness: 0.6 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.7), shirtMat);
    torso.position.y = 1.6;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), skinMat);
    head.position.y = 2.8;
    head.castShadow = true;
    group.add(head);

    // Sunglasses / Glasses for Alok / Kelly
    if (charId === 'ALOK' || !isBot) {
      const glassesMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.22, 0.3), glassesMat);
      glasses.position.set(0, 2.85, 0.3);
      group.add(glasses);
    }

    // Legs
    const legGeo = new THREE.BoxGeometry(0.5, 1.4, 0.5);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.35, 0.7, 0);
    leftLeg.name = 'leftLeg';
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.35, 0.7, 0);
    rightLeg.name = 'rightLeg';
    group.add(rightLeg);

    // Gun in hands
    const gunGroup = new THREE.Group();
    gunGroup.name = 'gunGroup';
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const gunBody = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 1.2), gunMat);
    gunBody.position.set(0.5, 1.8, 0.6);
    gunGroup.add(gunBody);

    // Pan on Back (Classic FF Pan!)
    const panMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9 });
    const panMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16), panMat);
    panMesh.rotation.x = Math.PI / 2;
    panMesh.position.set(0, 1.8, -0.42);
    group.add(panMesh);

    group.add(gunGroup);

    return group;
  };

  // Main 60fps Game Loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;

      if (!scene || !camera || !renderer) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // 1. UPDATE PLAYER MOVEMENT & CONTROLS
      if (playerState.isAlive) {
        let speed = 8.5;
        if (playerState.characterId === 'KELLY') speed *= 1.15; // Kelly Dash speed!
        if (playerState.isSprinting) speed *= 1.35;
        if (playerState.isCrouching) speed *= 0.5;
        if (playerState.isProning) speed *= 0.25;

        let moveX = 0;
        let moveZ = 0;

        if (keysPressed['KeyW'] || keysPressed['ArrowUp']) moveZ -= 1;
        if (keysPressed['KeyS'] || keysPressed['ArrowDown']) moveZ += 1;
        if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) moveX -= 1;
        if (keysPressed['KeyD'] || keysPressed['ArrowRight']) moveX += 1;

        if (moveX !== 0 || moveZ !== 0) {
          const len = Math.hypot(moveX, moveZ);
          moveX /= len;
          moveZ /= len;

          const dx = (moveX * Math.cos(playerState.rotationY) + moveZ * Math.sin(playerState.rotationY)) * speed * delta;
          const dz = (-moveX * Math.sin(playerState.rotationY) + moveZ * Math.cos(playerState.rotationY)) * speed * delta;

          // Check map bounds
          const nextX = Math.max(-230, Math.min(230, playerState.x + dx));
          const nextZ = Math.max(-230, Math.min(230, playerState.z + dz));

          setPlayerState((prev) => ({ ...prev, x: nextX, z: nextZ }));

          // Animate Legs Swing
          if (playerMeshGroup.current) {
            const leftLeg = playerMeshGroup.current.getObjectByName('leftLeg');
            const rightLeg = playerMeshGroup.current.getObjectByName('rightLeg');
            if (leftLeg && rightLeg) {
              const swing = Math.sin(now * 0.012) * 0.5;
              leftLeg.rotation.x = swing;
              rightLeg.rotation.x = -swing;
            }
          }
        }

        // Handle Active Skill Cooldown / Aura
        if (playerState.characterId === 'ALOK' && playerState.activeSkillDurationRemaining > 0) {
          setPlayerState((prev) => {
            const newDur = Math.max(0, prev.activeSkillDurationRemaining - delta);
            const heal = 5 * delta;
            return {
              ...prev,
              hp: Math.min(prev.maxHp, prev.hp + heal),
              activeSkillDurationRemaining: newDur,
            };
          });

          if (alokAuraMesh.current) {
            alokAuraMesh.current.visible = true;
            alokAuraMesh.current.position.set(playerState.x, 0.1, playerState.z);
          }
        } else if (alokAuraMesh.current) {
          alokAuraMesh.current.visible = false;
        }

        if (playerState.skillCooldownRemaining > 0) {
          setPlayerState((prev) => ({
            ...prev,
            skillCooldownRemaining: Math.max(0, prev.skillCooldownRemaining - delta),
          }));
        }

        // Zone Damage Check
        const distFromCenter = Math.hypot(playerState.x - safeZone.centerX, playerState.z - safeZone.centerZ);
        if (distFromCenter > safeZone.radius) {
          const zoneDmg = 4 * delta; // 4 HP per sec outside zone
          setPlayerState((prev) => {
            const newHp = Math.max(0, prev.hp - zoneDmg);
            if (newHp === 0 && prev.isAlive) {
              onGameOver(false);
              return { ...prev, hp: 0, isAlive: false };
            }
            return { ...prev, hp: newHp };
          });
        }

        // Update Player Mesh Position & Rotation
        if (playerMeshGroup.current) {
          playerMeshGroup.current.position.set(playerState.x, playerState.y, playerState.z);
          playerMeshGroup.current.rotation.y = playerState.rotationY;
        }

        // Camera Follow (3rd Person TPS Camera)
        const camDistance = playerState.isScoped ? 3 : 10;
        const camHeight = playerState.isScoped ? 2.5 : 5.5;

        const targetCamX = playerState.x - Math.sin(playerState.rotationY) * camDistance;
        const targetCamZ = playerState.z - Math.cos(playerState.rotationY) * camDistance;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.1);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, playerState.y + camHeight, 0.1);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.1);

        camera.lookAt(playerState.x, playerState.y + 2, playerState.z);

        // SHOOTING LOGIC
        if (isShootingRef.current) {
          const currentWeapon = playerState.currentWeaponIndex === 0 
            ? playerState.primaryWeapon 
            : playerState.currentWeaponIndex === 1 
            ? playerState.secondaryWeapon 
            : playerState.meleeWeapon;

          if (currentWeapon && currentWeapon.category !== 'MELEE') {
            const magIndex = playerState.currentWeaponIndex;
            const currentAmmo = playerState.currentMagAmmo[magIndex];

            const fireDelay = 1.0 / currentWeapon.fireRate;
            if (now - lastShotTimeRef.current >= fireDelay * 1000) {
              if (currentAmmo > 0) {
                lastShotTimeRef.current = now;

                // Decrement ammo
                setPlayerState((prev) => {
                  const updatedMags = [...prev.currentMagAmmo] as [number, number, number];
                  updatedMags[magIndex] -= 1;
                  return { ...prev, currentMagAmmo: updatedMags };
                });

                // Play gunshot sound
                soundManager.playGunshot(currentWeapon.id);

                // Shoot Raycast to check for hitting Bots or Gloo Walls
                const raycaster = new THREE.Raycaster();
                const shootDir = new THREE.Vector3(
                  Math.sin(playerState.rotationY),
                  0,
                  Math.cos(playerState.rotationY)
                ).normalize();

                raycaster.set(new THREE.Vector3(playerState.x, playerState.y + 2, playerState.z), shootDir);

                // Check Bot hits
                bots.forEach((bot) => {
                  if (!bot.isAlive) return;

                  const dx = bot.x - playerState.x;
                  const dz = bot.z - playerState.z;
                  const dist = Math.hypot(dx, dz);

                  if (dist < currentWeapon.range) {
                    // Accuracy angle calculation
                    const angleToBot = Math.atan2(dx, dz);
                    const diffAngle = Math.abs(angleToBot - playerState.rotationY);

                    if (diffAngle < 0.25) {
                      // HIT!
                      const isHeadshot = Math.random() < 0.35 || playerState.isScoped;
                      let baseDmg = currentWeapon.damage;
                      if (isHeadshot) baseDmg *= currentWeapon.headshotMultiplier;

                      // Apply damage to Bot
                      setBots((prevBots) =>
                        prevBots.map((b) => {
                          if (b.id !== bot.id) return b;

                          let finalHp = b.hp - baseDmg;
                          if (finalHp <= 0) {
                            soundManager.playHitmark(true);
                            onKill(playerState.name, bot.name, currentWeapon.name, isHeadshot);
                            
                            // Check if all bots dead -> BOOYAH!
                            const aliveRemaining = prevBots.filter((item) => item.id !== bot.id && item.isAlive).length;
                            if (aliveRemaining === 0) {
                              onGameOver(true);
                            }

                            return { ...b, hp: 0, isAlive: false };
                          } else {
                            soundManager.playHitmark(isHeadshot);
                            return { ...b, hp: finalHp };
                          }
                        })
                      );

                      addDamageIndicator(Math.round(baseDmg), isHeadshot, bot.x, bot.y + 2, bot.z);
                      
                      // Increment Player Stats
                      setPlayerState((prev) => ({
                        ...prev,
                        damageDealt: prev.damageDealt + Math.round(baseDmg),
                        kills: prev.kills + (bot.hp <= baseDmg ? 1 : 0),
                      }));
                    }
                  }
                });
              } else {
                // Auto reload if empty
                soundManager.playReload();
              }
            }
          }
        }
      }

      // 2. UPDATE AI BOTS (Smarter Free Fire AI behavior)
      setBots((prevBots) =>
        prevBots.map((bot) => {
          if (!bot.isAlive) return bot;

          // AI moves toward safe zone center or player
          let dx = playerState.x - bot.x;
          let dz = playerState.z - bot.z;
          const distToPlayer = Math.hypot(dx, dz);

          let newX = bot.x;
          let newZ = bot.z;
          let newRot = bot.rotationY;

          if (distToPlayer < 40) {
            // Aggressive mode: Turn & shoot player
            newRot = Math.atan2(dx, dz);

            // Move closer
            if (distToPlayer > 12) {
              newX += Math.sin(newRot) * 4.5 * delta;
              newZ += Math.cos(newRot) * 4.5 * delta;
            }

            // Random Shooting at Player
            if (Math.random() < 0.03 && playerState.isAlive) {
              soundManager.playGunshot(bot.primaryWeapon?.id || 'AK47');
              const isHit = Math.random() < 0.45;
              if (isHit) {
                const isHeadshot = Math.random() < 0.2;
                const botDmg = isHeadshot ? 45 : 18;

                setPlayerState((p) => {
                  const updatedHp = Math.max(0, p.hp - botDmg);
                  if (updatedHp === 0 && p.isAlive) {
                    onGameOver(false);
                    return { ...p, hp: 0, isAlive: false };
                  }
                  return { ...p, hp: updatedHp };
                });

                soundManager.playHitmark(false);
                addDamageIndicator(botDmg, isHeadshot, playerState.x, playerState.y + 2, playerState.z);
              }
            }
          } else {
            // Wandering / Moving to SafeZone center
            const dirToZoneX = safeZone.centerX - bot.x;
            const dirToZoneZ = safeZone.centerZ - bot.z;
            newRot = Math.atan2(dirToZoneX, dirToZoneZ);
            newX += Math.sin(newRot) * 3.5 * delta;
            newZ += Math.cos(newRot) * 3.5 * delta;
          }

          return { ...bot, x: newX, z: newZ, rotationY: newRot };
        })
      );

      // 3. RENDER BOT MESHES
      bots.forEach((bot) => {
        let mesh = botMeshesMap.current.get(bot.id);
        if (!mesh) {
          mesh = createCharacterMesh(bot.characterId, true);
          scene.add(mesh);
          botMeshesMap.current.set(bot.id, mesh);
        }

        if (bot.isAlive) {
          mesh.position.set(bot.x, bot.y, bot.z);
          mesh.rotation.y = bot.rotationY;
          mesh.visible = true;
        } else {
          mesh.visible = false;
        }
      });

      // 4. RENDER GLOO WALLS
      glooWalls.forEach((wall) => {
        let gMesh = glooMeshesMap.current.get(wall.id);
        if (!gMesh) {
          gMesh = new THREE.Group();
          
          // Curved Gloo Wall Shield Geometry
          const wallGeo = new THREE.CylinderGeometry(6, 6, 4.5, 16, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
          const wallSkin = GLOO_WALL_SKINS.find((s) => s.id === wall.color) || GLOO_WALL_SKINS[0];
          const wallMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(wallSkin.color),
            roughness: 0.2,
            metalness: 0.8,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide,
          });
          const wallMeshObj = new THREE.Mesh(wallGeo, wallMat);
          wallMeshObj.position.y = 2.25;
          wallMeshObj.castShadow = true;
          gMesh.add(wallMeshObj);

          scene.add(gMesh);
          glooMeshesMap.current.set(wall.id, gMesh);
        }

        gMesh.position.set(wall.x, wall.y, wall.z);
        gMesh.rotation.y = wall.rotationY;
      });

      // 5. UPDATE SAFE ZONE VISUALS
      if (zoneCylinderMesh.current) {
        zoneCylinderMesh.current.scale.set(safeZone.radius, 1, safeZone.radius);
        zoneCylinderMesh.current.position.set(safeZone.centerX, 50, safeZone.centerZ);
      }

      // Render Three.js Scene
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [playerState, bots, glooWalls, safeZone]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-900">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
