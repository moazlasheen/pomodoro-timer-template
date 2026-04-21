import { useState, useRef, useCallback, useEffect } from 'react';

export type SoundType = 'rain' | 'cafe' | 'brownNoise' | 'fireplace';

interface SoundConfig {
  label: string;
  icon: string;
}

export const SOUND_OPTIONS: Record<SoundType, SoundConfig> = {
  rain: { label: 'Rain', icon: 'cloud-rain' },
  cafe: { label: 'Café', icon: 'coffee' },
  brownNoise: { label: 'Brown Noise', icon: 'waves' },
  fireplace: { label: 'Fireplace', icon: 'flame' },
};

export function useAmbientSounds() {
  const [activeSound, setActiveSound] = useState<SoundType | null>(null);
  const [volume, setVolume] = useState(() => {
    return parseFloat(localStorage.getItem('ambient-volume') || '0.3');
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    source?: AudioBufferSourceNode | OscillatorNode;
    gain?: GainNode;
    filter?: BiquadFilterNode;
    noiseSource?: AudioBufferSourceNode;
    extraNodes?: AudioNode[];
  }>({});

  const cleanup = useCallback(() => {
    const nodes = nodesRef.current;
    try {
      if (nodes.source) {
        nodes.source.stop();
        nodes.source.disconnect();
      }
      if (nodes.noiseSource) {
        nodes.noiseSource.stop();
        nodes.noiseSource.disconnect();
      }
      if (nodes.extraNodes) {
        nodes.extraNodes.forEach(n => n.disconnect());
      }
      if (nodes.gain) nodes.gain.disconnect();
      if (nodes.filter) nodes.filter.disconnect();
    } catch {
      // Already stopped
    }
    nodesRef.current = {};
  }, []);

  const createNoiseBuffer = useCallback((ctx: AudioContext, seconds: number) => {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * seconds;
    const buffer = ctx.createBuffer(2, length, sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise: integrate white noise
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 3.5;
      }
    }
    return buffer;
  }, []);

  const createRain = useCallback((ctx: AudioContext, gainNode: GainNode) => {
    // Rain = filtered noise with modulation
    const bufferSize = 4;
    const buffer = ctx.createBuffer(2, ctx.sampleRate * bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) {
        // Mix of white and pink-ish noise for rain texture
        const white = Math.random() * 2 - 1;
        const mod = Math.sin(i / ctx.sampleRate * 0.3) * 0.3 + 0.7;
        data[i] = white * mod * 0.5;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 800;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 8000;

    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(gainNode);
    source.start();

    nodesRef.current = { source, gain: gainNode, extraNodes: [highpass, lowpass] };
  }, []);

  const createCafe = useCallback((ctx: AudioContext, gainNode: GainNode) => {
    // Café = warm low-mid noise (murmur)
    const bufferSize = 6;
    const buffer = ctx.createBuffer(2, ctx.sampleRate * bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise approximation
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        const pink = b0 + b1 + b2 + white * 0.5362;
        // Add subtle rhythmic variation for "chatter" feel
        const chatter = Math.sin(i / ctx.sampleRate * 2.1) * 0.15 + 0.85;
        data[i] = pink * 0.11 * chatter;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 600;
    bandpass.Q.value = 0.5;

    source.connect(bandpass);
    bandpass.connect(gainNode);
    source.start();

    nodesRef.current = { source, gain: gainNode, extraNodes: [bandpass] };
  }, []);

  const createBrownNoise = useCallback((ctx: AudioContext, gainNode: GainNode) => {
    const buffer = createNoiseBuffer(ctx, 4);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 400;

    source.connect(lowpass);
    lowpass.connect(gainNode);
    source.start();

    nodesRef.current = { source, gain: gainNode, extraNodes: [lowpass] };
  }, [createNoiseBuffer]);

  const createFireplace = useCallback((ctx: AudioContext, gainNode: GainNode) => {
    // Fireplace = low rumble + crackle pops
    const bufferSize = 5;
    const buffer = ctx.createBuffer(2, ctx.sampleRate * bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let lastOut = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        // Add random crackle pops
        const crackle = Math.random() > 0.9985 ? (Math.random() - 0.5) * 2 : 0;
        data[i] = (lastOut * 2.5 + crackle * 0.4);
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 600;

    source.connect(lowpass);
    lowpass.connect(gainNode);
    source.start();

    nodesRef.current = { source, gain: gainNode, extraNodes: [lowpass] };
  }, []);

  const play = useCallback((sound: SoundType) => {
    cleanup();

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(ctx.destination);

    switch (sound) {
      case 'rain': createRain(ctx, gainNode); break;
      case 'cafe': createCafe(ctx, gainNode); break;
      case 'brownNoise': createBrownNoise(ctx, gainNode); break;
      case 'fireplace': createFireplace(ctx, gainNode); break;
    }

    setActiveSound(sound);
    setIsPlaying(true);
  }, [volume, cleanup, createRain, createCafe, createBrownNoise, createFireplace]);

  const stop = useCallback(() => {
    cleanup();
    setActiveSound(null);
    setIsPlaying(false);
  }, [cleanup]);

  const toggleSound = useCallback((sound: SoundType) => {
    if (activeSound === sound && isPlaying) {
      stop();
    } else {
      play(sound);
    }
  }, [activeSound, isPlaying, play, stop]);

  // Update volume in real-time
  useEffect(() => {
    if (nodesRef.current.gain) {
      nodesRef.current.gain.gain.value = volume;
    }
    localStorage.setItem('ambient-volume', volume.toString());
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [cleanup]);

  return {
    activeSound,
    volume,
    isPlaying,
    setVolume,
    toggleSound,
    stop,
  };
}
