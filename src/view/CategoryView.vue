<script setup lang="ts">
import Slider from 'primevue/slider';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import AppFooter from '../components/AppFooter.vue';
import ProductCard from '../components/ProductCard.vue';
import { getCategoryDefaultCards } from '../data/api';

const priceRange = ref<[number, number]>([20000, 63595]);
const DefaultCards = ref<any[]>([]);
const priceSliderWrap = ref<HTMLElement | null>(null);
const draggingPrice = ref<'min' | 'max' | null>(null);
const selectedBrands = ref(['Sony']);
const selectedUsage = ref(['通勤']);
const selectedStatus = ref(['新品']);

const priceMin = 0;
const priceMax = 100000;
const priceStep = 1;
const priceTicks = [0, 25000, 50000, 75000, 100000];
const productColumnCount = 4;
const productRowCount = 5;

const formatPrice = (price: number) => price.toLocaleString('en-US');

const visibleProducts = computed(() => {
  const totalCount = productColumnCount * productRowCount;

  if (!DefaultCards.value.length) return [];

  return Array.from(
    { length: totalCount },
    (_, index) => DefaultCards.value[index % DefaultCards.value.length],
  );
});

const priceSliderStyle = computed(() => {
  const minPercent = ((priceRange.value[0] - priceMin) / (priceMax - priceMin)) * 100;
  const maxPercent = ((priceRange.value[1] - priceMin) / (priceMax - priceMin)) * 100;

  return {
    '--min-position': `${minPercent}%`,
    '--max-position': `${maxPercent}%`,
  };
});

const clampPrice = (value: number) => Math.min(priceMax, Math.max(priceMin, value));

const updateRangeFromInput = (target: 'min' | 'max', event: Event) => {
  const input = event.target as HTMLInputElement;
  const nextValue = clampPrice(Number(input.value) || 0);
  const [currentMin, currentMax] = priceRange.value;

  if (target === 'min') {
    priceRange.value = [Math.min(nextValue, currentMax - priceStep), currentMax];
    return;
  }

  priceRange.value = [currentMin, Math.max(nextValue, currentMin + priceStep)];
};

const getPriceFromPointer = (clientX: number) => {
  const track = priceSliderWrap.value?.querySelector('.p-slider') as HTMLElement | null;

  if (!track) return null;

  const rect = track.getBoundingClientRect();
  const rawRatio = (clientX - rect.left) / rect.width;
  const ratio = Math.min(1, Math.max(0, rawRatio));
  const rawValue = priceMin + ratio * (priceMax - priceMin);

  return Math.round(rawValue / priceStep) * priceStep;
};

const updatePriceDrag = (event: PointerEvent) => {
  if (!draggingPrice.value) return;

  const nextValue = getPriceFromPointer(event.clientX);
  if (nextValue === null) return;

  const [currentMin, currentMax] = priceRange.value;

  if (draggingPrice.value === 'min') {
    priceRange.value = [Math.min(nextValue, currentMax - priceStep), currentMax];
    return;
  }

  priceRange.value = [currentMin, Math.max(nextValue, currentMin + priceStep)];
};

const stopPriceDrag = () => {
  draggingPrice.value = null;
  window.removeEventListener('pointermove', updatePriceDrag);
  window.removeEventListener('pointerup', stopPriceDrag);
};

const startPriceDrag = (target: 'min' | 'max', event: PointerEvent) => {
  event.preventDefault();
  draggingPrice.value = target;
  updatePriceDrag(event);
  window.addEventListener('pointermove', updatePriceDrag);
  window.addEventListener('pointerup', stopPriceDrag);
};

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1728);

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

const scaleStyle = computed(() => {
  const designWidth = 1728;

  if (windowWidth.value < designWidth) {
    const ratio = windowWidth.value / designWidth;
    return {
      zoom: ratio,
      width: `${designWidth}px`,
      margin: '0 auto',
    };
  }

  return {
    width: `${designWidth}px`,
    margin: '0 auto',
  };
});

onMounted(async () => {
  window.addEventListener('resize', updateWidth);

  try {
    DefaultCards.value = await getCategoryDefaultCards();
  } catch (error) {
    console.error('Failed to load category data:', error);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
  stopPriceDrag();
});
</script>

<template>
  <div class="w-full bg-white overflow-x-hidden">
    <div :style="scaleStyle">
      <div class="flex w-full">
        <div class="w-[37.1875em] min-h-screen pt-[3.75em] pl-[7.25em] pr-[3.75em] flex-shrink-0">
          <div class="price-filter-card mb-12">
            <h2 class="price-section-title">價格區間</h2>

            <div ref="priceSliderWrap" class="price-slider-wrap" :style="priceSliderStyle">
              <button
                class="price-bubble price-bubble-min"
                :class="{ 'is-dragging': draggingPrice === 'min' }"
                type="button"
                @pointerdown="startPriceDrag('min', $event)"
              >
                ${{ formatPrice(priceRange[0]) }}
              </button>
              <button
                class="price-bubble price-bubble-max"
                :class="{ 'is-dragging': draggingPrice === 'max' }"
                type="button"
                @pointerdown="startPriceDrag('max', $event)"
              >
                ${{ formatPrice(priceRange[1]) }}
              </button>

              <Slider
                v-model="priceRange"
                :min="priceMin"
                :max="priceMax"
                :step="priceStep"
                range
                class="price-slider"
              />

              <div class="price-ticks">
                <span v-for="tick in priceTicks" :key="tick">{{ formatPrice(tick) }}</span>
              </div>
            </div>

            <div class="price-input-grid">
              <label>
                <span>From ($)</span>
                <input
                  :value="priceRange[0]"
                  inputmode="numeric"
                  type="number"
                  @input="updateRangeFromInput('min', $event)"
                />
              </label>
              <label>
                <span>To ($)</span>
                <input
                  :value="priceRange[1]"
                  inputmode="numeric"
                  type="number"
                  @input="updateRangeFromInput('max', $event)"
                />
              </label>
            </div>

            <button type="button" class="price-search-button">
              Search
            </button>
          </div>

          <div class="feature-filter-card">
            <section class="feature-filter-section">
              <h3>品牌</h3>
              <label class="feature-option">
                <input v-model="selectedBrands" type="checkbox" value="Sony" />
                <span></span>
                Sony
              </label>
              <label class="feature-option">
                <input v-model="selectedBrands" type="checkbox" value="鐵三角" />
                <span></span>
                鐵三角
              </label>
              <label class="feature-option">
                <input v-model="selectedBrands" type="checkbox" value="Apple" />
                <span></span>
                Apple
              </label>
            </section>

            <section class="feature-filter-section">
              <h3>使用情境</h3>
              <label class="feature-option">
                <input v-model="selectedUsage" type="checkbox" value="通勤" />
                <span></span>
                通勤
              </label>
              <label class="feature-option">
                <input v-model="selectedUsage" type="checkbox" value="運動" />
                <span></span>
                運動
              </label>
              <label class="feature-option">
                <input v-model="selectedUsage" type="checkbox" value="遊戲" />
                <span></span>
                遊戲
              </label>
              <label class="feature-option">
                <input v-model="selectedUsage" type="checkbox" value="工作會議" />
                <span></span>
                工作會議
              </label>
            </section>

            <section class="feature-filter-section">
              <h3>商品狀態</h3>
              <label class="feature-option">
                <input v-model="selectedStatus" type="checkbox" value="新品" />
                <span></span>
                新品
              </label>
              <label class="feature-option">
                <input v-model="selectedStatus" type="checkbox" value="打折" />
                <span></span>
                打折
              </label>
              <label class="feature-option">
                <input v-model="selectedStatus" type="checkbox" value="熱銷" />
                <span></span>
                熱銷
              </label>
            </section>
          </div>
        </div>

        <div class="pl-[3.5em] pr-[7.25em] pt-[3.75em] flex-grow">
          <h2 class="product-section-title">全部商品</h2>
          <div class="grid grid-cols-4 gap-[20px] mt-8 w-full pb-20">
            <ProductCard
              v-for="(item, index) in visibleProducts"
              :key="`${item.id}-${index}`"
              :info="item"
              type="default"
              variant="compact"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <AppFooter />
</template>

<style scoped>
.price-section-title {
  margin: 0;
  color: #000;
  font-size: 1.35em;
  font-weight: 800;
  letter-spacing: 0.05em;
  line-height: 1;
}

.product-section-title {
  margin: 0;
  color: #000;
  font-size: 1.35em;
  font-weight: 800;
  letter-spacing: 0.05em;
  line-height: 1;
}

.price-filter-card {
  padding: 1.65em 2em 1.85em;
  background: #fff;
  border: 0.0625em solid #e5e7eb;
  border-radius: 1.1em;
  box-shadow: 0 0.45em 1.5em rgba(15, 23, 42, 0.08);
}

.price-slider-wrap {
  position: relative;
  padding: 4.05em 0 1.2em;
}

.price-bubble {
  position: absolute;
  top: 0.8em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.85em;
  padding: 0 0.6em;
  border: 0;
  border-radius: 0.28em;
  font-size: 0.95em;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
}

.price-bubble {
  background: #000;
  color: #fff;
  cursor: grab;
  touch-action: none;
  transform: translateX(-50%);
  z-index: 2;
}

.price-bubble.is-dragging {
  cursor: grabbing;
  transform: translateX(-50%) scale(1.04);
}

.price-bubble-min {
  left: var(--min-position);
}

.price-bubble-max {
  left: var(--max-position);
}

:deep(.price-slider.p-slider) {
  height: 0.2em;
  background: #d7dee9;
  border-radius: 999px;
}

:deep(.price-slider .p-slider-range) {
  height: 0.2em;
  background: #000;
  border-radius: 999px;
}

:deep(.price-slider .p-slider-handle) {
  width: 1.05em;
  height: 1.05em;
  margin-top: -0.425em;
  background: #000;
  border: 0;
  border-radius: 50%;
  box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.22);
}

:deep(.price-slider .p-slider-handle:focus) {
  box-shadow:
    0 0.1em 0.45em rgba(0, 0, 0, 0.22),
    0 0 0 0.2em rgba(0, 0, 0, 0.12);
}

.price-ticks {
  display: flex;
  justify-content: space-between;
  margin-top: 0.65em;
  color: #b4b4b4;
  font-size: 0.85em;
}

.price-ticks span {
  position: relative;
}

.price-ticks span::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -0.65em;
  width: 0.08em;
  height: 0.45em;
  background: #dfe3eb;
  transform: translateX(-50%);
}

.price-input-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1em;
  margin-top: 0.95em;
}

.price-input-grid label {
  display: grid;
  gap: 0.5em;
  color: #171717;
  font-size: 0.95em;
  font-weight: 700;
}

.price-input-grid input {
  width: 100%;
  height: 3.05em;
  padding: 0 1em;
  background: #e9e9e9;
  border: 0;
  border-radius: 0.45em;
  color: #4f4f4f;
  font-size: 1em;
  outline: none;
}

.price-input-grid input:focus {
  box-shadow: 0 0 0 0.16em rgba(0, 0, 0, 0.12);
}

.price-search-button {
  width: 100%;
  height: 3.25em;
  margin-top: 1.35em;
  background: #000;
  border: 0;
  border-radius: 0.45em;
  color: #fff;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
}

.feature-filter-card {
  padding: 2.15em 2em;
  background: #fff;
  border: 0.0625em solid #e5e7eb;
  border-radius: 1.1em;
  color: #111;
  box-shadow: 0 0.45em 1.5em rgba(15, 23, 42, 0.08);
}

.feature-filter-section + .feature-filter-section {
  margin-top: 2.2em;
  padding-top: 2.1em;
  border-top: 0.0625em solid #e9edf3;
}

.feature-filter-section h3 {
  margin: 0 0 1.3em;
  color: #000;
  font-size: 1.35em;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.feature-option {
  display: flex;
  align-items: center;
  gap: 0.85em;
  margin-bottom: 1.1em;
  color: #111;
  font-family: monospace;
  font-size: 1.25em;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.2;
  cursor: pointer;
  user-select: none;
}

.feature-option:last-child {
  margin-bottom: 0;
}

.feature-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.feature-option span {
  position: relative;
  display: inline-flex;
  width: 1.05em;
  height: 1.05em;
  flex: 0 0 1.05em;
  align-items: center;
  justify-content: center;
  border: 0.1em solid #d3d8df;
  border-radius: 0.16em;
  background: #fff;
}

.feature-option input:checked + span {
  background: #000;
  border-color: #000;
}

.feature-option input:checked + span::after {
  content: '';
  width: 0.45em;
  height: 0.25em;
  border-left: 0.13em solid #fff;
  border-bottom: 0.13em solid #fff;
  transform: rotate(-45deg) translateY(-0.05em);
}
</style>
