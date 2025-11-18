<script lang="ts">
  import * as Tone from "tone";
  import type { Track } from "@tonejs/midi/dist/Track.js";
  import type { Note } from "@tonejs/midi/dist/Note.js";
  import { onMount } from "svelte";
  const DEFAULT_BPM = 120;
  interface Props {
    track: Track;
    ppq: number;
    durationTicks: number;
  }
  let { track, ppq, durationTicks }: Props = $props();

  let ctx = $state<Tone.Context | null>(null);
  let synth = $state<Tone.Synth<Tone.SynthOptions> | null>(null);
  let part = $state<Tone.Part<Note> | null>(null);
  let bpm = $state(DEFAULT_BPM);
  let isPlaying = $state(false);
  let stopID = $state<number | undefined>(undefined);
  let playSub = $derived.by(async () => {
    if (isPlaying) {
      await ctx?.resume();

      ctx?.transport.scheduleRepeat((time) => {
        ctx?.draw.schedule(() => {
          if (ctx) ctx.transport.bpm.value = bpm;
        }, time);
      }, "64n");
      ctx?.transport.start();
      part?.start();

      await new Promise<void>((res) => {
        stopID = ctx?.transport.schedule((time: number) => {
          isPlaying = false;
          res();
        }, `${durationTicks}i`);
      });
    }

    if (ctx) ctx.transport.position = 0;
    if (ctx) ctx.transport.seconds = 0;
    if (ctx) ctx.transport.bpm.value = bpm;
    if (ctx) ctx.transport.PPQ = ppq;
    if (ctx && stopID) ctx.transport.clear(stopID);
    part?.stop(0);
    ctx?.transport.stop();
    return false;
  });

  onMount(() => {
    // @ts-ignore
    const context = new (window.AudioContext || window.webkitAudioContext)();
    ctx = new Tone.Context({ latencyHint: "playback", context });
    ctx.transport.PPQ = ppq;
    Tone.setContext(ctx, false);
    synth = new Tone.Synth().toDestination();
    part = new Tone.Part((t: number, n: Note) => {
      playNote(t, n);
    }, track.notes);
  });

  function playNote(t: number, n: Note) {
    const freq = Tone.Frequency(n.midi, "midi").toFrequency();
    synth?.triggerAttackRelease(freq, n.duration, t, n.velocity);
  }
</script>

<label>
  <input type="range" bind:value={bpm} min="60" max="240" />
  <span>bpm: {bpm}</span>
</label>

<button onclick={() => (isPlaying = !isPlaying)}
  >{isPlaying ? "stop" : "play"}</button
>

{#await playSub}
  ...
{:then play}
  done
{/await}
