<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  import { selectedRecipeItem } from '../store';
  import type { Recipe } from '../data';

  let activeTab = $state(0);

  // Reset tab khi đổi món
  $effect(() => {
    if ($selectedRecipeItem) activeTab = 0;
  });

  function close() {
    selectedRecipeItem.set(null);
  }

  function formatContent(content: string): string[] {
    // Chuyển literal \n (từ Google Sheet/CSV) thành newline thật, rồi split
    return content.replace(/\\n/g, '\n').split('\n').filter(line => line.trim() !== '');
  }

  let activeRecipe = $derived<Recipe | undefined>(
    $selectedRecipeItem?.recipes?.[activeTab]
  );
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && close()} />

{#if $selectedRecipeItem}
  <div class="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
    <!-- Backdrop -->
    <button
      class="absolute inset-0 bg-slate-950/85 backdrop-blur-sm border-none cursor-default"
      transition:fade={{ duration: 250 }}
      onclick={close}
      aria-label="Đóng"
      tabindex="-1"
    ></button>

    <!-- Modal -->
    <div
      class="relative w-full max-w-sm bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden max-h-[85dvh] flex flex-col"
      role="dialog"
      aria-modal="true"
      in:fly={{ y: 80, duration: 500, easing: backOut }}
      out:fly={{ y: 80, duration: 250 }}
    >
      <!-- Header -->
      <div
        class="relative px-5 pt-5 pb-4 flex items-center gap-3 shrink-0"
        style="background: linear-gradient(135deg, {$selectedRecipeItem.color}33, transparent)"
      >
        {#if $selectedRecipeItem.image}
          <img
            src={$selectedRecipeItem.image}
            alt={$selectedRecipeItem.name}
            class="w-12 h-12 rounded-full object-cover shadow-lg shrink-0"
            style="border: 2px solid {$selectedRecipeItem.color}"
          />
        {:else}
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-lg"
            style="background: linear-gradient(135deg, {$selectedRecipeItem.color}66, {$selectedRecipeItem.color}33)"
          >
            🍽️
          </div>
        {/if}

        <div class="flex-1 min-w-0">
          <p class="text-slate-400 text-xs uppercase tracking-widest font-semibold">Cách nấu</p>
          <h2
            class="font-extrabold text-xl font-['Outfit'] truncate"
            style="color: {$selectedRecipeItem.color}"
          >
            {$selectedRecipeItem.name}
          </h2>
        </div>

        <button
          class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
          onclick={close}
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>

      <!-- Tabs (chỉ hiện nếu có nhiều cách nấu) -->
      {#if $selectedRecipeItem.recipes && $selectedRecipeItem.recipes.length > 1}
        <div class="flex gap-1 px-4 pb-2 overflow-x-auto shrink-0 scrollbar-hide">
          {#each $selectedRecipeItem.recipes as recipe, i}
            <button
              class="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border"
              class:text-white={activeTab === i}
              class:border-transparent={activeTab !== i}
              style={activeTab === i
                ? `background: ${$selectedRecipeItem.color}; border-color: transparent;`
                : `color: ${$selectedRecipeItem.color}; border-color: ${$selectedRecipeItem.color}44;`}
              onclick={() => activeTab = i}
            >
              {recipe.name}
            </button>
          {/each}
        </div>
        <div class="h-px bg-slate-700/50 mx-4 shrink-0"></div>
      {/if}

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-5 py-4">
        {#if activeRecipe}
          {#key activeTab}
            <ol
              class="flex flex-col gap-3"
              in:fade={{ duration: 200 }}
            >
              {#each formatContent(activeRecipe.content) as step, i}
                <li class="flex gap-3 items-start">
                  <span
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style="background: {$selectedRecipeItem.color}33; color: {$selectedRecipeItem.color}"
                  >
                    {i + 1}
                  </span>
                  <p class="text-slate-200 text-sm leading-relaxed flex-1">
                    {step.replace(/^(Bước \d+:\s*)/, '')}
                  </p>
                </li>
              {/each}
            </ol>
          {/key}
        {:else}
          <p class="text-slate-500 text-sm text-center py-8">Chưa có cách nấu nào.</p>
        {/if}
      </div>

      <!-- Safe area bottom padding -->
      <div class="h-4 shrink-0"></div>
    </div>
  </div>
{/if}
