<script lang="ts">
  import Tempo from "$lib/tempo.svelte";
  import type { Midi } from "@tonejs/midi/dist/Midi.js";

  async function getMidi(url: string): Promise<Midi> {
    return await (await import("@tonejs/midi")).Midi.fromUrl(url);
  }
</script>

{#await getMidi("/twinkle_twinkle.mid")}
  ...loading
{:then { tracks, durationTicks, header }}
  <Tempo track={tracks[0]} {durationTicks} ppq={header.ppq} />
{/await}
