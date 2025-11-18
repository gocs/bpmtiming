<script lang="ts">
  import Tempo from "$lib/tempo.svelte";
  import type { Midi } from "@tonejs/midi/dist/Midi.js";

  async function getMidi(url: string): Promise<Midi> {
    const midi = await (await import("@tonejs/midi")).Midi.fromUrl(url);
    console.log("midi", midi);
    return midi;
  }
</script>

{#await getMidi("/twinkle_twinkle.mid")}
  ...loading
{:then { tracks, duration }}
  <Tempo track={tracks[0]} {duration} />
{/await}
