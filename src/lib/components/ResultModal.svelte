<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  import { appState, selectedMain, selectedVeg, selectedRecipeItem } from '../store';
  import confetti from 'canvas-confetti';

  onMount(() => {
    if ($selectedMain && $selectedVeg) {
      const colors = [$selectedMain.color, $selectedVeg.color, '#ffffff'];
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  });

  function handleRespin() {
    selectedMain.set(null);
    selectedVeg.set(null);
    appState.set('ready');
  }
</script>

<svelte:window onkeydown={(e) => ($selectedMain && $selectedVeg) && e.key === 'Escape' && handleRespin()} />

{#if $appState === 'result' && $selectedMain && $selectedVeg}
  <!-- Container -->
  <div class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
    <!-- Backdrop -->
    <button
      class="absolute inset-0 bg-slate-950/85 backdrop-blur-sm cursor-default border-none"
      transition:fade={{ duration: 300 }}
      onclick={handleRespin}
      aria-label="Đóng popup"
      tabindex="-1"
    ></button>

    <!-- Modal -->
    <div
      class="relative w-full max-w-sm bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-700/60 overflow-hidden text-center max-h-[90dvh] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      in:scale={{ duration: 600, easing: backOut, start: 0.5 }}
      out:fly={{ y: 80, duration: 300 }}
    >
      <!-- Decorative background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
        <div class="absolute top-[10%] left-[15%] w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
        <div class="absolute top-[25%] right-[15%] w-4 h-4 bg-yellow-500 rotate-45 animate-pulse"></div>
        <div class="absolute bottom-[20%] left-[25%] w-3 h-3 bg-green-500 animate-bounce"></div>
        <div class="absolute top-[60%] right-[30%] w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>

      <div class="relative z-10 flex flex-col items-center gap-4">
        <h2 class="text-slate-400 font-medium uppercase tracking-widest text-sm">
          🎉 Bữa ăn hôm nay
        </h2>

        <!-- Món chính -->
        <button
          class="w-full py-6 rounded-2xl flex flex-col items-center justify-center shadow-inner relative gap-2 overflow-hidden transition-all active:scale-[0.97]"
          style="background: linear-gradient(135deg, {$selectedMain.color}55, {$selectedMain.color}22)"
          class:cursor-pointer={!!$selectedMain.recipes?.length}
          onclick={() => $selectedMain?.recipes?.length && selectedRecipeItem.set($selectedMain)}
          disabled={!$selectedMain.recipes?.length}
        >
          <!-- Glow -->
          <div
            class="absolute inset-0 blur-2xl opacity-30 rounded-full"
            style="background: {$selectedMain.color}"
          ></div>

          <span class="relative z-10 text-slate-400 text-xs uppercase tracking-widest font-semibold">Món chính</span>

          {#if $selectedMain.image}
            <img
              src={$selectedMain.image}
              alt={$selectedMain.name}
              class="relative z-10 w-24 h-24 rounded-full object-cover shadow-xl"
              style="border: 3px solid {$selectedMain.color}"
            />
          {/if}

          <h3
            class="relative z-10 text-4xl font-extrabold text-white drop-shadow-xl font-['Outfit']"
          >
            {$selectedMain.name}
          </h3>

          {#if $selectedMain.recipes?.length}
            <span class="relative z-10 text-xs px-2.5 py-1 rounded-full font-semibold" style="background: {$selectedMain.color}33; color: {$selectedMain.color}">
              📖 Xem cách nấu
            </span>
          {/if}
        </button>

        <!-- Divider -->
        <div class="flex items-center justify-center text-slate-600 font-black text-2xl">+</div>

        <!-- Rau ăn kèm -->
        <button
          class="w-full py-6 rounded-2xl flex flex-col items-center justify-center shadow-inner relative gap-2 overflow-hidden transition-all active:scale-[0.97]"
          style="background: linear-gradient(135deg, {$selectedVeg.color}55, {$selectedVeg.color}22)"
          class:cursor-pointer={!!$selectedVeg.recipes?.length}
          onclick={() => $selectedVeg?.recipes?.length && selectedRecipeItem.set($selectedVeg)}
          disabled={!$selectedVeg.recipes?.length}
        >
          <!-- Glow -->
          <div
            class="absolute inset-0 blur-2xl opacity-30 rounded-full"
            style="background: {$selectedVeg.color}"
          ></div>

          <span class="relative z-10 text-slate-400 text-xs uppercase tracking-widest font-semibold">Rau ăn kèm</span>

          {#if $selectedVeg.image}
            <img
              src={$selectedVeg.image}
              alt={$selectedVeg.name}
              class="relative z-10 w-24 h-24 rounded-full object-cover shadow-xl"
              style="border: 3px solid {$selectedVeg.color}"
            />
          {/if}

          <h3
            class="relative z-10 text-4xl font-extrabold text-white drop-shadow-xl font-['Outfit']"
          >
            {$selectedVeg.name}
          </h3>

          {#if $selectedVeg.recipes?.length}
            <span class="relative z-10 text-xs px-2.5 py-1 rounded-full font-semibold" style="background: {$selectedVeg.color}33; color: {$selectedVeg.color}">
              📖 Xem cách nấu
            </span>
          {/if}
        </button>

        <!-- Button -->
        <button
          class="w-full py-4 mt-2 rounded-xl text-white font-bold hover:shadow-lg transition-all active:scale-95 bg-slate-800 hover:bg-slate-700 border border-slate-600 flex justify-center items-center"
          onclick={handleRespin}
        >
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 text-sm md:text-base">
            🔄 QUAY LẠI
          </span>
        </button>
      </div>
    </div>
  </div>
{/if}
