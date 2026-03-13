<script lang="ts">
  import '../app.css';
  import { appState, selectedMain, selectedVeg, selectedRecipeItem } from '$lib/store';
  import SplashScreen from '$lib/components/SplashScreen.svelte';
  import LuckyWheel from '$lib/components/LuckyWheel.svelte';
  import ResultModal from '$lib/components/ResultModal.svelte';
  import RecipeModal from '$lib/components/RecipeModal.svelte';

  function reset() {
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
        Xoay vòng quay để chọn bữa ăn ngẫu nhiên!
      </p>

      <!-- Wheel -->
      {#if $appState !== 'result'}
        <LuckyWheel />
      {/if}

    </div>

    <!-- Result Modal (hiện cả món chính + rau cùng lúc) -->
    <ResultModal />

    <!-- Recipe Modal -->
    <RecipeModal />
  {/if}

</main>
