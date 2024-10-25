<template>
  <svg 
    :width="width" 
    :height="height"
    viewBox="0 0 400 100" 
    xmlns="http://www.w3.org/2000/svg"
    :style="{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height
    }"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2563EB;stop-opacity:1" />
      </linearGradient>
    </defs>

    <!-- Groupe de texte principal -->
    <g transform="translate(0, 25)">
      <!-- DOFUS -->
      <text 
        x="0" 
        y="40" 
        font-family="'Segoe UI', Roboto, sans-serif" 
        font-size="42" 
        font-weight="800" 
        fill="#1E293B"
        letter-spacing="2"
      >
        DOFUS
      </text>
      
      <!-- CRAFTER -->
      <text 
        x="170" 
        y="40" 
        font-family="'Segoe UI', Roboto, sans-serif" 
        font-size="32" 
        font-weight="600" 
        fill="url(#textGradient)"
        letter-spacing="2"
      >
        CRAFTER
      </text>
    </g>
  </svg>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  width: {
    type: [Number, String],
    default: '200px'
  },
  height: {
    type: [Number, String],
    default: '50px'
  }
})
</script>
