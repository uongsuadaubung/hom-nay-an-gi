<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { appState, mainMenu, vegMenu } from '../store';
  import { fetchMenuFromGoogleSheet } from '../data';

  let visible = $state(false);

  // URL ứng dụng Google Apps Script bạn vừa triển khai
  // Lưu ý: Nếu URL này rỗng, ứng dụng sẽ chỉ chạy bằng mock data và giả lập chờ 2.5s
  const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/REDACTED_API_KEY/exec'; 
  // const GOOGLE_SHEET_API_URL = ''; 

  onMount(() => {
    visible = true;

    // 1. Minimum duration promise (chờ ít nhất 2.5s để xem splash screen xong)
    const minWaitPromise = new Promise(resolve => setTimeout(resolve, 2500));

    // 2. Data fetch promise (gọi API lấy dữ liệu)
    const fetchPromise = GOOGLE_SHEET_API_URL
      ? fetchMenuFromGoogleSheet(GOOGLE_SHEET_API_URL)
          .then(data => {
            // Cập nhật store nếu gọi thành công
            if (data.mains.length > 0) mainMenu.set(data.mains);
            if (data.vegs.length > 0) vegMenu.set(data.vegs);
          })
          .catch(err => console.error("API Call error:", err)) // Nếu lỗi dùng dữ liệu mock cũ
      : Promise.resolve();

    // 3. Đợi đồng thời cả hai promise hoàn thành
    Promise.all([minWaitPromise, fetchPromise]).finally(() => {
      visible = false;
      setTimeout(() => {
        $appState = 'ready';
      }, 500); // Animation fade-out mất 500ms
    });
  });
</script>

{#if visible}
  <div
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950"
    out:fade={{ duration: 500 }}
  >
    <div class="relative flex flex-col items-center">
      <!-- Glow effect -->
      <div class="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-500 blur-3xl opacity-30 animate-pulse rounded-full w-full h-full"></div>
      
      <h1 
        class="relative text-5xl md:text-7xl font-extrabold text-center drop-shadow-2xl font-['Outfit']"
        in:fly={{ y: 50, duration: 1000, delay: 200 }}
      >
        <span class="text-slate-100">Hôm nay</span>
        <br />
        <span class="text-gradient leading-tight block mt-2">Ăn gì?</span>
      </h1>
      
      <div 
        class="absolute -bottom-16 flex gap-2"
        in:fade={{ duration: 1000, delay: 1000 }}
      >
        <div class="w-3 h-3 rounded-full bg-orange-500 animate-bounce" style="animation-delay: 0s;"></div>
        <div class="w-3 h-3 rounded-full bg-rose-500 animate-bounce" style="animation-delay: 0.15s;"></div>
        <div class="w-3 h-3 rounded-full bg-orange-500 animate-bounce" style="animation-delay: 0.3s;"></div>
      </div>
    </div>
  </div>
{/if}
