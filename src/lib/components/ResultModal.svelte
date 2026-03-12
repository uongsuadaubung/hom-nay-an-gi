<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  import { appState, currentSpinResult, spinPhase, selectedMain, selectedVeg } from '../store';
  import confetti from 'canvas-confetti';

  onMount(() => {
    // Fire confetti when the modal appears
    if ($currentSpinResult) {
      const color = $currentSpinResult.color;
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: [color, '#ffffff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: [color, '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  });

  function handleRespin() {
    appState.set('ready');
    currentSpinResult.set(null);
  }

  function handleNext() {
    if ($spinPhase === 'main') {
      selectedMain.set($currentSpinResult);
      spinPhase.set('veg');
      appState.set('ready');
    } else {
      selectedVeg.set($currentSpinResult);
      spinPhase.set('done');
      appState.set('ready');
    }
    currentSpinResult.set(null);
  }
</script>

<svelte:window onkeydown={(e) => $currentSpinResult && e.key === 'Escape' && handleRespin()} />

{#if $currentSpinResult}
  <!-- Container -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop as a button to natively support a11y -->
    <button 
      class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-default border-none"
      transition:fade={{ duration: 300 }}
      onclick={handleRespin}
      aria-label="Đóng popup"
      tabindex="-1"
    ></button>

    <!-- Modal -->
    <div 
      class="relative w-full max-w-md bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700 overflow-hidden text-center"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      in:scale={{ duration: 600, easing: backOut, start: 0.5 }}
      out:fly={{ y: 50, duration: 300 }}
    >
      <!-- Confetti imitation Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div class="absolute top-[10%] left-[20%] w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
        <div class="absolute top-[30%] right-[20%] w-4 h-4 bg-yellow-500 rotate-45 animate-pulse"></div>
        <div class="absolute bottom-[20%] left-[30%] w-3 h-3 bg-green-500 animate-bounce"></div>
        <div class="absolute top-[50%] right-[40%] w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>

      <div class="relative z-10 flex flex-col items-center">
        <h2 class="text-slate-400 font-medium uppercase tracking-widest text-sm mb-2">
          {$spinPhase === 'main' ? 'Món chính hôm nay...' : 'Rau ăn kèm hôm nay...'}
        </h2>
        
        <div 
          class="w-full py-8 my-4 rounded-2xl flex flex-col items-center justify-center shadow-inner relative gap-4"
          style="background: linear-gradient(135deg, {$currentSpinResult.color}88, {$currentSpinResult.color}44)"
        >
          <!-- Glowing effect -->
          <div 
            class="absolute inset-0 blur-2xl opacity-40 rounded-full"
            style="background: {$currentSpinResult.color}"
          ></div>

          {#if $currentSpinResult.image}
            <!-- Food image -->
            <div class="relative">
              <div 
                class="absolute -inset-2 rounded-full blur-xl opacity-70"
                style="background: {$currentSpinResult.color}"
              ></div>
              <img
                src={$currentSpinResult.image}
                alt={$currentSpinResult.name}
                class="relative w-40 h-40 rounded-full object-cover shadow-2xl"
                style="border: 4px solid {$currentSpinResult.color}"
              />
            </div>
          {/if}
          
          <h1 
            class="relative text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl font-['Outfit']"
          >
            {$currentSpinResult.name}
          </h1>
        </div>
        
        <p class="text-slate-300 mt-2 mb-8">
          {$spinPhase === 'main' ? 'Tuyệt vời! Tiếp theo chọn rau nào!' : 'Bữa ăn đã hoàn chỉnh!'}
        </p>

        <div class="flex gap-3 w-full">
          <button 
            class="flex-1 py-4 rounded-xl text-white font-bold hover:shadow-lg transition-all active:scale-95 bg-slate-700 hover:bg-slate-600 border border-slate-600 flex justify-center items-center"
            onclick={handleRespin}
          >
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 text-sm md:text-base">
              QUAY LẠI
            </span>
          </button>
          <button 
            class="flex-[1.5] py-4 rounded-xl text-white font-bold hover:shadow-lg transition-all active:scale-95 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/50 flex justify-center items-center text-sm md:text-base"
            onclick={handleNext}
          >
            {$spinPhase === 'main' ? 'CHỌN RAU NHÉ' : 'XONG RỒI!'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
