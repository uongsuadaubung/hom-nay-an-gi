<script lang="ts">
  import { appState, currentSpinResult, spinPhase, mainMenu, vegMenu } from '../store';

  // Vòng quay luôn hiển thị đúng WHEEL_SLICES ô cố định, không phụ thuộc số món
  const WHEEL_SLICES = 10;

  // Bảng màu cho các ô vòng quay (cố định, đẹp mắt)
  const WHEEL_COLORS = [
    '#FF512F', '#DD2476', '#F09819', '#8E2DE2', '#4A00E0',
    '#00C9FF', '#11998e', '#fc4a1a', '#7F00FF', '#1a1a2e',
  ];

  let isSpinning = $state(false);
  let rotation = $state(0);
  let wheelStyles = $derived(
    `transform: rotate(${rotation}deg); transition: transform ${isSpinning ? '8s cubic-bezier(0.2, 0.8, 0.2, 1)' : '0s'};`
  );

  // Danh sách thật — chỉ dùng để bốc kết quả sau khi quay xong
  let activeFoods = $derived($spinPhase === 'main' ? $mainMenu : $vegMenu);

  // Thông số vòng quay (luôn dựa theo WHEEL_SLICES)
  const sliceAngle = 360 / WHEEL_SLICES;

  // Conic gradient từ bảng màu cố định
  const conicGradient = (() => {
    const stops = WHEEL_COLORS.map((color, i) => {
      const start = i * sliceAngle;
      const end   = (i + 1) * sliceAngle;
      return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  })();

  function spin() {
    if (isSpinning) return;
    isSpinning = true;
    appState.set('spinning');

    // Chọn ô đích ngẫu nhiên trên VÒNG QUAY (không liên quan đến món)
    const targetSlice = Math.floor(Math.random() * WHEEL_SLICES);
    const targetAngle = targetSlice * sliceAngle + sliceAngle / 2;

    // Số vòng quay thêm để có hiệu ứng đẹp
    const extraSpins = 8 + Math.floor(Math.random() * 5);
    const baseRotation = rotation % 360;
    const spinsNeeded  = 360 * extraSpins;
    const offset       = 360 - targetAngle;

    rotation = rotation - baseRotation + spinsNeeded + offset;

    setTimeout(() => {
      isSpinning = false;

      // Bốc ngẫu nhiên MÓN ĂN từ danh sách thật SAU KHI quay xong
      const picked = activeFoods[Math.floor(Math.random() * activeFoods.length)];
      currentSpinResult.set(picked);
      appState.set('result');
    }, 8100);
  }
</script>

<div class="relative w-[300px] h-[300px] mx-auto p-4 flex items-center justify-center filter drop-shadow-2xl">

  <!-- Outer Glow / Rim -->
  <div class="absolute inset-0 rounded-full border-[12px] border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-slate-800 z-10 flex items-center justify-center">

    <!-- The Wheel -->
    <div
      class="relative w-full h-full rounded-full overflow-hidden"
      style="{wheelStyles} background: {conicGradient};"
    >
      <!-- Dividers -->
      {#each { length: WHEEL_SLICES } as _, i}
        <div
          class="absolute inset-0 w-full h-full border-r-2 border-slate-800/30 origin-center"
          style="transform: rotate({i * sliceAngle}deg); margin-left: -1px;"
        ></div>
      {/each}

      <!-- Mystery "?" labels -->
      {#each { length: WHEEL_SLICES } as _, i}
        <div
          class="absolute inset-0 origin-center flex justify-center pt-8 md:pt-10 pointer-events-none"
          style="transform: rotate({i * sliceAngle + sliceAngle / 2}deg);"
        >
          <div class="font-bold text-white/90 text-3xl md:text-4xl drop-shadow-lg filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">?</div>
        </div>
      {/each}
    </div>

  </div>

  <!-- Pointer -->
  <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[30px] border-l-transparent border-r-transparent border-t-white z-20 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"></div>
  <div class="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-t-[34px] border-l-transparent border-r-transparent border-t-slate-800 z-10"></div>

  <!-- Center Button -->
  <button
    class="absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-800 border-4 border-slate-600 shadow-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-80 active:scale-95 group focus:outline-none"
    class:hover:scale-105={!isSpinning}
    class:shadow-[0_0_30px_rgba(255,81,47,0.6)]={!isSpinning}
    onclick={spin}
    disabled={isSpinning}
  >
    <div class="absolute inset-0 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 outline outline-2 outline-offset-2 outline-transparent group-hover:outline-orange-500/50 transition-all pointer-events-none shrink-0"></div>
    <span class="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-rose-400 font-extrabold text-xl md:text-2xl drop-shadow-sm font-['Outfit']">QUAY</span>
  </button>
</div>
