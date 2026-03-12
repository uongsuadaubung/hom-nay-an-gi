<script lang="ts">
  import '../app.css';
  import { appState, spinPhase, selectedMain, selectedVeg, selectedRecipeItem } from '$lib/store';
  import SplashScreen from '$lib/components/SplashScreen.svelte';
  import LuckyWheel from '$lib/components/LuckyWheel.svelte';
  import ResultModal from '$lib/components/ResultModal.svelte';
  import RecipeModal from '$lib/components/RecipeModal.svelte';

  function reset() {
    spinPhase.set('main');
    selectedMain.set(null);
    selectedVeg.set(null);
    appState.set('ready');
  }
</script>

<main class="w-full min-h-[100dvh] flex flex-col items-center justify-start relative text-center antialiased selection:bg-orange-500/30 overflow-y-auto overflow-x-hidden">
  
  {#if $appState === 'splash'}
    <SplashScreen />
  {:else}
    <div class="relative z-10 w-full max-w-sm px-4 flex flex-col items-center gap-6 py-10">
      
      <!-- Title -->
      <h1 class="text-center">
        <button 
          class="text-4xl md:text-5xl font-extrabold drop-shadow-xl font-['Outfit'] cursor-pointer transition hover:scale-105 appearance-none bg-transparent border-none p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-8 focus-visible:ring-offset-slate-900 rounded-lg" 
          onclick={reset}
          aria-label="Làm lại từ đầu"
        >
          <span class="text-slate-100">Hôm nay</span>
          <span class="text-gradient inline-block ml-2">Ăn gì?</span>
        </button>
      </h1>
      
      <!-- Subtitle -->
      <p class="text-slate-400 font-medium tracking-wide">
        {#if $spinPhase === 'main'}
          Xoay vòng quay để chọn món chính ngẫu nhiên!
        {:else if $spinPhase === 'veg'}
          Tuyệt! Giờ thì xoay tiếp để chọn rau nhé!
        {:else}
          Bữa ăn hoàn hảo của bạn đã sẵn sàng!
        {/if}
      </p>

      <!-- Wheel -->
      {#if $spinPhase !== 'done'}
        <LuckyWheel />
      {/if}

      <!-- Final Result Display -->
      {#if $spinPhase === 'done' && $selectedMain && $selectedVeg}
        <div class="w-full flex flex-col gap-4 mt-2 animate-in fade-in zoom-in-95 duration-700 delay-150">
          
          <!-- Món chính card -->
          <div class="relative">
            <button
              class="w-full p-5 rounded-3xl border border-slate-700 bg-slate-800/80 shadow-2xl flex flex-col items-center gap-1 relative overflow-hidden transition-all active:scale-95 text-center"
              class:cursor-pointer={!!$selectedMain.recipes?.length}
              class:hover:border-slate-500={!!$selectedMain.recipes?.length}
              onclick={() => $selectedMain?.recipes?.length && selectedRecipeItem.set($selectedMain)}
              disabled={!$selectedMain.recipes?.length}
            >
              <div class="absolute inset-0 opacity-20 pointer-events-none" style="background: linear-gradient(135deg, {$selectedMain.color}, transparent);"></div>
              <span class="text-slate-400 text-xs uppercase tracking-widest font-semibold relative z-10">Món chính</span>
              <span class="text-3xl font-extrabold drop-shadow-lg font-['Outfit'] relative z-10" style="color: {$selectedMain.color}">{$selectedMain.name}</span>
              {#if $selectedMain.recipes?.length}
                <span class="relative z-10 mt-1 text-xs px-2.5 py-1 rounded-full font-semibold" style="background: {$selectedMain.color}22; color: {$selectedMain.color}">
                  📖 Xem cách nấu
                </span>
              {/if}
            </button>
          </div>

          <div class="flex items-center justify-center text-slate-700 font-black text-3xl drop-shadow-2xl">+</div>

          <!-- Rau card -->
          <div class="relative">
            <button
              class="w-full p-5 rounded-3xl border border-slate-700 bg-slate-800/80 shadow-2xl flex flex-col items-center gap-1 relative overflow-hidden transition-all active:scale-95 text-center"
              class:cursor-pointer={!!$selectedVeg.recipes?.length}
              class:hover:border-slate-500={!!$selectedVeg.recipes?.length}
              onclick={() => $selectedVeg?.recipes?.length && selectedRecipeItem.set($selectedVeg)}
              disabled={!$selectedVeg.recipes?.length}
            >
              <div class="absolute inset-0 opacity-20 pointer-events-none" style="background: linear-gradient(135deg, {$selectedVeg.color}, transparent);"></div>
              <span class="text-slate-400 text-xs uppercase tracking-widest font-semibold relative z-10">Rau ăn kèm</span>
              <span class="text-3xl font-extrabold drop-shadow-lg font-['Outfit'] relative z-10" style="color: {$selectedVeg.color}">{$selectedVeg.name}</span>
              {#if $selectedVeg.recipes?.length}
                <span class="relative z-10 mt-1 text-xs px-2.5 py-1 rounded-full font-semibold" style="background: {$selectedVeg.color}22; color: {$selectedVeg.color}">
                  📖 Xem cách nấu
                </span>
              {/if}
            </button>
          </div>

          <button 
            class="px-10 py-4 mt-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(251,146,60,0.4)] active:scale-95 mx-auto border border-orange-400/30"
            onclick={reset}
          >
            CHỌN LẠI TỪ ĐẦU
          </button>
        </div>
      {/if}

    </div>

    <!-- Result Modal -->
    {#if $appState === 'result'}
      <ResultModal />
    {/if}

    <!-- Recipe Modal -->
    <RecipeModal />
  {/if}

</main>
