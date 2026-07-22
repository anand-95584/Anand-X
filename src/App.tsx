import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AirDropEntity,
  ChatLogEntry,
  DamageIndicator,
  GameMode,
  GlooWallEntity,
  ItemLoot,
  KillFeedEntry,
  PlayerState,
  PlayerStats,
  VehicleEntity,
} from './types/game';
import { CHARACTERS, GLOO_WALL_SKINS, WEAPONS, WEAPON_SKINS } from './utils/constants';
import { loadPlayerStats, savePlayerStats } from './utils/storage';
import { soundManager } from './utils/sound';
import { EmoteItem, QuickChatMessage } from './utils/emotes';
import { INITIAL_VEHICLES, VEHICLE_CONFIGS } from './utils/vehicles';

import { Lobby } from './components/Lobby';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { CharacterModal } from './components/CharacterModal';
import { VaultModal } from './components/VaultModal';
import { StatsModal } from './components/StatsModal';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Game Navigation State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>('BATTLE_ROYALE');
  
  // Modals State
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Player Stats
  const [stats, setStats] = useState<PlayerStats>(loadPlayerStats);

  // Match State
  const [matchStartTime, setMatchStartTime] = useState<number>(0);
  const [survivalTime, setSurvivalTime] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isBooyah, setIsBooyah] = useState<boolean>(false);

  // Safe Zone
  const [safeZone, setSafeZone] = useState({
    radius: 180,
    centerX: 0,
    centerZ: 0,
    isShrinking: true,
  });

  // Entities
  const [glooWalls, setGlooWalls] = useState<GlooWallEntity[]>([]);
  const [vehicles, setVehicles] = useState<VehicleEntity[]>([]);
  const [airDrops, setAirDrops] = useState<AirDropEntity[]>([]);
  const [loots, setLoots] = useState<ItemLoot[]>([]);
  const [killFeed, setKillFeed] = useState<KillFeedEntry[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLogEntry[]>([]);
  const [damageIndicators, setDamageIndicators] = useState<DamageIndicator[]>([]);

  // Input state
  const keysPressedRef = useRef<Record<string, boolean>>({});
  const isShootingRef = useRef<boolean>(false);
  const vehicleInputRef = useRef<{ throttle: number; steer: number }>({ throttle: 0, steer: 0 });

  // Player Entity State
  const [playerState, setPlayerState] = useState<PlayerState>({
    id: 'player_main',
    name: 'SURVIVOR_2019',
    isBot: false,
    isAlive: true,
    x: 0,
    y: 0,
    z: 0,
    rotationY: 0,
    hp: 200,
    maxHp: 200,
    ep: 100,
    maxEp: 200,
    armorVest: 3,
    armorVestHp: 100,
    helmet: 3,
    helmetHp: 100,

    primaryWeapon: WEAPONS['AK47'],
    secondaryWeapon: WEAPONS['MP40'],
    meleeWeapon: WEAPONS['PAN'],
    currentWeaponIndex: 0,
    ammo: { AR: 120, SMG: 120, SG: 30, SNIPER: 20, HG: 30 },
    currentMagAmmo: [30, 32, 1],
    medkits: 5,
    glooWalls: 4,

    isSprinting: false,
    isCrouching: false,
    isProning: false,
    isReloading: false,
    isHealing: false,
    isScoped: false,
    inVehicle: false,

    characterId: stats.selectedCharacter,
    skillCooldownRemaining: 0,
    activeSkillDurationRemaining: 0,

    kills: 0,
    damageDealt: 0,
  });

  // Bots Entity State
  const [bots, setBots] = useState<PlayerState[]>([]);

  // Initialize Match
  const handleStartMatch = () => {
    const totalBotsCount = gameMode === 'BATTLE_ROYALE' ? 24 : 7;
    const initialBots: PlayerState[] = [];

    const botNames = [
      'GlooGod_007', 'BermudaKing', 'KellyDash_Pro', 'ProAWM_Sniper',
      'NoobMaster', 'BooyahHunter', 'Alok_Beats', 'Shadow_Ninja',
      'Dragon_AK', 'HeadshotMachine', 'Pochinok_Hero', 'ClockTower_Boss',
      'Factory_Roofer', 'Peak_Sniper', 'Titan_SCAR', 'M1014_Beast',
    ];

    for (let i = 0; i < totalBotsCount; i++) {
      const angle = (i / totalBotsCount) * Math.PI * 2;
      const radius = 50 + Math.random() * 100;
      const botX = Math.cos(angle) * radius;
      const botZ = Math.sin(angle) * radius;

      initialBots.push({
        id: `bot_${i}`,
        name: botNames[i % botNames.length] + `_${i + 1}`,
        isBot: true,
        isAlive: true,
        x: botX,
        y: 0,
        z: botZ,
        rotationY: Math.random() * Math.PI * 2,
        hp: 100,
        maxHp: 100,
        ep: 0,
        maxEp: 100,
        armorVest: 2,
        armorVestHp: 80,
        helmet: 2,
        helmetHp: 80,

        primaryWeapon: i % 2 === 0 ? WEAPONS['AK47'] : WEAPONS['MP40'],
        secondaryWeapon: WEAPONS['M1014'],
        meleeWeapon: WEAPONS['PAN'],
        currentWeaponIndex: 0,
        ammo: { AR: 120, SMG: 120, SG: 30, SNIPER: 20, HG: 30 },
        currentMagAmmo: [30, 32, 1],
        medkits: 2,
        glooWalls: 2,

        isSprinting: false,
        isCrouching: false,
        isProning: false,
        isReloading: false,
        isHealing: false,
        isScoped: false,
        inVehicle: false,

        characterId: 'ANDREW',
        skillCooldownRemaining: 0,
        activeSkillDurationRemaining: 0,

        kills: 0,
        damageDealt: 0,
      });
    }

    setBots(initialBots);
    setVehicles(INITIAL_VEHICLES);
    setGlooWalls([]);
    setKillFeed([]);
    setChatLogs([]);
    setDamageIndicators([]);
    setSafeZone({ radius: 180, centerX: 0, centerZ: 0, isShrinking: true });

    setPlayerState({
      id: 'player_main',
      name: 'SURVIVOR_2019',
      isBot: false,
      isAlive: true,
      x: 0,
      y: 0,
      z: 0,
      rotationY: 0,
      hp: 200,
      maxHp: 200,
      ep: 100,
      maxEp: 200,
      armorVest: 3,
      armorVestHp: 100,
      helmet: 3,
      helmetHp: 100,

      primaryWeapon: WEAPONS['AK47'],
      secondaryWeapon: WEAPONS['MP40'],
      meleeWeapon: WEAPONS['PAN'],
      currentWeaponIndex: 0,
      ammo: { AR: 120, SMG: 120, SG: 30, SNIPER: 20, HG: 30 },
      currentMagAmmo: [30, 32, 1],
      medkits: 5,
      glooWalls: 5,

      isSprinting: false,
      isCrouching: false,
      isProning: false,
      isReloading: false,
      isHealing: false,
      isScoped: false,
      inVehicle: false,

      characterId: stats.selectedCharacter,
      skillCooldownRemaining: 0,
      activeSkillDurationRemaining: 0,

      kills: 0,
      damageDealt: 0,
    });

    setMatchStartTime(Date.now());
    setIsGameOver(false);
    setIsBooyah(false);
    setIsPlaying(true);
  };

  // Keyboard Event Handlers
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = true;

      // Quick Gloo Wall (G)
      if (e.code === 'KeyG') {
        handlePlaceGlooWall();
      }
      // Alok / Character Skill (Q)
      if (e.code === 'KeyQ') {
        handleUseSkill();
      }
      // Medkit (4)
      if (e.code === 'Digit4') {
        handleUseMedkit();
      }
      // Reload (R)
      if (e.code === 'KeyR') {
        handleReload();
      }
      // Weapon Switch (1, 2, 3)
      if (e.code === 'Digit1') setPlayerState((p) => ({ ...p, currentWeaponIndex: 0 }));
      if (e.code === 'Digit2') setPlayerState((p) => ({ ...p, currentWeaponIndex: 1 }));
      if (e.code === 'Digit3') setPlayerState((p) => ({ ...p, currentWeaponIndex: 2 }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, playerState]);

  // Safe Zone Shrinking Timer
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const zoneInterval = setInterval(() => {
      setSafeZone((prev) => {
        if (prev.radius > 15) {
          return { ...prev, radius: prev.radius - 0.5 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(zoneInterval);
  }, [isPlaying, isGameOver]);

  // Gloo Wall Action
  const handlePlaceGlooWall = () => {
    if (playerState.glooWalls <= 0 || !playerState.isAlive) return;

    const spawnDist = 3.5;
    const wallX = playerState.x + Math.sin(playerState.rotationY) * spawnDist;
    const wallZ = playerState.z + Math.cos(playerState.rotationY) * spawnDist;

    const newGloo: GlooWallEntity = {
      id: `gloo_${Date.now()}`,
      x: wallX,
      y: 0,
      z: wallZ,
      rotationY: playerState.rotationY,
      hp: 300,
      maxHp: 300,
      ownerId: playerState.id,
      color: stats.selectedGlooSkin,
    };

    setGlooWalls((prev) => [...prev, newGloo]);
    setPlayerState((prev) => ({ ...prev, glooWalls: prev.glooWalls - 1 }));
    soundManager.playGlooWallDeploy();
  };

  // Character Active Skill Action
  const handleUseSkill = () => {
    if (playerState.skillCooldownRemaining > 0 || !playerState.isAlive) return;

    const charDef = CHARACTERS.find((c) => c.id === playerState.characterId);
    if (charDef?.id === 'ALOK') {
      soundManager.playSkillAlok();
      setPlayerState((prev) => ({
        ...prev,
        activeSkillDurationRemaining: 10,
        skillCooldownRemaining: charDef.cooldown || 45,
      }));
    }
  };

  // Medkit Action
  const handleUseMedkit = () => {
    if (playerState.medkits <= 0 || playerState.hp >= playerState.maxHp || !playerState.isAlive) return;

    soundManager.playMedkit();
    setPlayerState((prev) => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + 75),
      medkits: prev.medkits - 1,
    }));
  };

  // Reload Action
  const handleReload = () => {
    soundManager.playReload();
    const curIdx = playerState.currentWeaponIndex;
    const curWeapon = curIdx === 0 ? playerState.primaryWeapon : playerState.secondaryWeapon;

    if (curWeapon) {
      setPlayerState((prev) => {
        const updatedMags = [...prev.currentMagAmmo] as [number, number, number];
        updatedMags[curIdx] = curWeapon.magazineSize;
        return { ...prev, currentMagAmmo: updatedMags };
      });
    }
  };

  // Add Damage Indicator Overlay
  const addDamageIndicator = (dmg: number, isHeadshot: boolean, x: number, y: number, z: number) => {
    const newIndicator: DamageIndicator = {
      id: `dmg_${Date.now()}_${Math.random()}`,
      damage: dmg,
      isHeadshot,
      x,
      y,
      z,
      createdAt: Date.now(),
    };

    setDamageIndicators((prev) => [...prev.slice(-8), newIndicator]);
  };

  // Handle Kill & Feed
  const handleKill = (killerName: string, victimName: string, weaponName: string, isHeadshot: boolean) => {
    const entry: KillFeedEntry = {
      id: `kf_${Date.now()}_${Math.random()}`,
      killerName,
      victimName,
      weaponName,
      isHeadshot,
      time: Date.now(),
    };

    setKillFeed((prev) => [...prev, entry]);
  };

  // Handle Emotes Trigger
  const handleTriggerEmote = (emote: EmoteItem) => {
    if (!playerState.isAlive) return;
    const expiresAt = Date.now() + emote.duration;

    setPlayerState((prev) => ({
      ...prev,
      activeEmote: {
        id: emote.id,
        name: emote.name,
        icon: emote.icon,
        animationType: emote.animationType,
        particleColor: emote.particleColor,
        expiresAt,
      },
    }));

    const newChat: ChatLogEntry = {
      id: `chat_${Date.now()}_${Math.random()}`,
      senderName: playerState.name,
      isPlayer: true,
      text: `performed ${emote.name}!`,
      icon: emote.icon,
      time: Date.now(),
    };
    setChatLogs((prev) => [...prev.slice(-6), newChat]);
    soundManager.playEmoteSound(emote.id);
  };

  // Handle Quick Chat Trigger
  const handleTriggerQuickChat = (msg: QuickChatMessage) => {
    if (!playerState.isAlive) return;
    const expiresAt = Date.now() + 3500;

    setPlayerState((prev) => ({
      ...prev,
      activeChatBubble: {
        text: msg.text,
        icon: msg.icon,
        expiresAt,
      },
    }));

    const newChat: ChatLogEntry = {
      id: `chat_${Date.now()}_${Math.random()}`,
      senderName: playerState.name,
      isPlayer: true,
      text: msg.text,
      icon: msg.icon,
      time: Date.now(),
    };
    setChatLogs((prev) => [...prev.slice(-6), newChat]);
    soundManager.playRadioPing();
  };

  // Handle Toggle Vehicle Enter / Exit
  const handleToggleVehicle = (targetVehicleId?: string) => {
    if (!playerState.isAlive) return;

    if (playerState.inVehicle) {
      // Exit Vehicle
      const currentVeh = vehicles.find((v) => v.id === playerState.vehicleId);
      const exitX = currentVeh ? currentVeh.x + Math.cos(currentVeh.rotationY) * 2.5 : playerState.x;
      const exitZ = currentVeh ? currentVeh.z - Math.sin(currentVeh.rotationY) * 2.5 : playerState.z;

      setPlayerState((prev) => ({
        ...prev,
        inVehicle: false,
        vehicleId: undefined,
        x: exitX,
        z: exitZ,
      }));

      if (currentVeh) {
        setVehicles((prev) =>
          prev.map((v) => (v.id === currentVeh.id ? { ...v, driverId: undefined, isEngineRunning: false, speed: 0 } : v))
        );
      }
    } else if (targetVehicleId) {
      // Enter Vehicle
      const targetVeh = vehicles.find((v) => v.id === targetVehicleId);
      if (targetVeh && targetVeh.hp > 0) {
        const dist = Math.hypot(targetVeh.x - playerState.x, targetVeh.z - playerState.z);
        if (dist < 7.0) {
          setPlayerState((prev) => ({
            ...prev,
            inVehicle: true,
            vehicleId: targetVeh.id,
            x: targetVeh.x,
            z: targetVeh.z,
            rotationY: targetVeh.rotationY,
          }));

          setVehicles((prev) =>
            prev.map((v) => (v.id === targetVeh.id ? { ...v, driverId: playerState.id, isEngineRunning: true } : v))
          );

          soundManager.playVehicleEngine();
        }
      }
    }
  };

  // Handle Honk Vehicle Horn
  const handleHonkHorn = () => {
    soundManager.playVehicleHorn();
  };

  // Vehicle Movement Physics & Roadkill Loop
  useEffect(() => {
    if (!isPlaying || isGameOver || !playerState.inVehicle || !playerState.vehicleId) return;

    const interval = setInterval(() => {
      setVehicles((prevVehicles) => {
        return prevVehicles.map((veh) => {
          if (veh.id !== playerState.vehicleId) return veh;

          // Get driving inputs
          const throttle = vehicleInputRef.current.throttle;
          const steer = vehicleInputRef.current.steer;

          let newSpeed = veh.speed;
          if (throttle > 0) {
            newSpeed = Math.min(veh.maxSpeed, newSpeed + veh.acceleration);
          } else if (throttle < 0) {
            newSpeed = Math.max(-veh.maxSpeed * 0.4, newSpeed - veh.acceleration * 0.8);
          } else {
            newSpeed = newSpeed * 0.92; // Friction deceleration
          }

          if (Math.abs(newSpeed) < 0.01) newSpeed = 0;

          let newRot = veh.rotationY;
          if (Math.abs(newSpeed) > 0.05) {
            const config = VEHICLE_CONFIGS[veh.type];
            const turnRate = config ? config.turnSpeed : 0.04;
            newRot += steer * turnRate * Math.sign(newSpeed);
          }

          const newX = veh.x + Math.sin(newRot) * newSpeed;
          const newZ = veh.z + Math.cos(newRot) * newSpeed;

          // Sync player position to vehicle position
          setPlayerState((p) => ({
            ...p,
            x: newX,
            z: newZ,
            rotationY: newRot,
          }));

          // Roadkill Check (Collision with Bots)
          if (Math.abs(newSpeed) > 0.3) {
            setBots((prevBots) =>
              prevBots.map((bot) => {
                if (!bot.isAlive) return bot;
                const d = Math.hypot(bot.x - newX, bot.z - newZ);
                if (d < 3.8) {
                  const roadkillDamage = Math.round(Math.abs(newSpeed) * 220);
                  const newHp = Math.max(0, bot.hp - roadkillDamage);
                  addDamageIndicator(roadkillDamage, true, bot.x, bot.y + 2, bot.z);
                  soundManager.playVehicleHorn();

                  if (newHp === 0) {
                    handleKill(playerState.name, bot.name, veh.name.toUpperCase(), true);
                    setPlayerState((p) => ({
                      ...p,
                      kills: p.kills + 1,
                      damageDealt: p.damageDealt + bot.hp,
                    }));
                  }
                  return { ...bot, hp: newHp, isAlive: newHp > 0 };
                }
                return bot;
              })
            );
          }

          return {
            ...veh,
            x: newX,
            z: newZ,
            rotationY: newRot,
            speed: newSpeed,
          };
        });
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, playerState.inVehicle, playerState.vehicleId]);

  // Match Over Event
  const handleGameOver = (booyah: boolean) => {
    if (isGameOver) return;

    const timeSurvived = Math.floor((Date.now() - matchStartTime) / 1000);
    setSurvivalTime(timeSurvived);
    setIsBooyah(booyah);
    setIsGameOver(true);

    // Save Persistent Stats
    const earnedGold = booyah ? 450 + playerState.kills * 50 : 150 + playerState.kills * 30;
    const earnedRP = booyah ? 55 + playerState.kills * 5 : Math.max(5, playerState.kills * 8);

    const updatedStats: PlayerStats = {
      ...stats,
      gold: stats.gold + earnedGold,
      totalMatches: stats.totalMatches + 1,
      booyahs: stats.booyahs + (booyah ? 1 : 0),
      totalKills: stats.totalKills + playerState.kills,
      maxKillsInMatch: Math.max(stats.maxKillsInMatch, playerState.kills),
      rankPoints: stats.rankPoints + earnedRP,
    };

    setStats(updatedStats);
    savePlayerStats(updatedStats);
  };

  // Character & Vault Handlers
  const handleSelectCharacter = (charId: any) => {
    const updated = { ...stats, selectedCharacter: charId };
    setStats(updated);
    savePlayerStats(updated);
  };

  const handleUnlockCharacter = (charId: any, cost: number) => {
    if (stats.gold < cost) return;
    const updated = {
      ...stats,
      gold: stats.gold - cost,
      unlockedCharacters: [...stats.unlockedCharacters, charId],
      selectedCharacter: charId,
    };
    setStats(updated);
    savePlayerStats(updated);
  };

  const handleEquipSkin = (skinId: string) => {
    const skinDef = WEAPON_SKINS.find((s) => s.id === skinId);
    if (skinDef) {
      const updatedSkins = { ...stats.selectedSkins, [skinDef.weaponId]: skinId };
      const updated = { ...stats, selectedSkins: updatedSkins };
      setStats(updated);
      savePlayerStats(updated);
    }
  };

  const handleEquipGlooSkin = (skinId: string) => {
    const updated = { ...stats, selectedGlooSkin: skinId };
    setStats(updated);
    savePlayerStats(updated);
  };

  const handleEquipBundle = (bundleId: string) => {
    const updated = { ...stats, selectedBundle: bundleId };
    setStats(updated);
    savePlayerStats(updated);
  };

  const aliveBotsCount = bots.filter((b) => b.isAlive).length;
  const aliveTotalCount = aliveBotsCount + (playerState.isAlive ? 1 : 0);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {!isPlaying ? (
        <Lobby
          stats={stats}
          selectedMode={gameMode}
          setSelectedMode={setGameMode}
          onStartGame={handleStartMatch}
          onOpenCharacterModal={() => setIsCharacterModalOpen(true)}
          onOpenVaultModal={() => setIsVaultModalOpen(true)}
          onOpenStatsModal={() => setIsStatsModalOpen(true)}
        />
      ) : (
        <>
          <GameCanvas
            gameMode={gameMode}
            playerState={playerState}
            setPlayerState={setPlayerState}
            bots={bots}
            setBots={setBots}
            glooWalls={glooWalls}
            setGlooWalls={setGlooWalls}
            vehicles={vehicles}
            setVehicles={setVehicles}
            airDrops={airDrops}
            setAirDrops={setAirDrops}
            loots={loots}
            setLoots={setLoots}
            safeZone={safeZone}
            onKill={handleKill}
            onGameOver={handleGameOver}
            addDamageIndicator={addDamageIndicator}
            keysPressed={keysPressedRef.current}
            isShootingRef={isShootingRef}
          />

          <GameHUD
            playerState={playerState}
            setPlayerState={setPlayerState}
            aliveCount={aliveTotalCount}
            totalCount={gameMode === 'BATTLE_ROYALE' ? 25 : 8}
            killFeed={killFeed}
            chatLogs={chatLogs}
            damageIndicators={damageIndicators}
            vehicles={vehicles}
            safeZone={safeZone}
            onPlaceGlooWall={handlePlaceGlooWall}
            onUseSkill={handleUseSkill}
            onUseMedkit={handleUseMedkit}
            onReload={handleReload}
            onToggleScope={() => setPlayerState((p) => ({ ...p, isScoped: !p.isScoped }))}
            onToggleMute={() => {
              setIsMuted(!isMuted);
              soundManager.setMuted(!isMuted);
            }}
            isMuted={isMuted}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onTriggerEmote={handleTriggerEmote}
            onTriggerQuickChat={handleTriggerQuickChat}
            onToggleVehicle={handleToggleVehicle}
            onHonkHorn={handleHonkHorn}
            vehicleInputRef={vehicleInputRef}
            isShootingRef={isShootingRef}
          />
        </>
      )}

      {/* MODALS */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        stats={stats}
        onSelectCharacter={handleSelectCharacter}
        onUnlockCharacter={handleUnlockCharacter}
      />

      <VaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        stats={stats}
        onEquipSkin={handleEquipSkin}
        onEquipGlooSkin={handleEquipGlooSkin}
        onEquipBundle={handleEquipBundle}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isMuted={isMuted}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          soundManager.setMuted(!isMuted);
        }}
      />

      <GameOverModal
        isOpen={isGameOver}
        isBooyah={isBooyah}
        kills={playerState.kills}
        damage={playerState.damageDealt}
        survivalTime={survivalTime}
        onPlayAgain={handleStartMatch}
        onReturnLobby={() => setIsPlaying(false)}
      />
    </div>
  );
}
