<template>

  <Body class="min-h-screen">
    <Toaster />
    <div class="min-h-screen flex flex-col justify-between">

      <NuxtPage />

      <footer class="container mt-12 flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <div class="text-sm leading-loose text-muted-foreground md:text-left">
          <p class=" text-center text-xs">
            The code source is available on
            <a href="https://github.com/aulonm/generate-nin" target="_blank"
              class="underline underline-offset-4 font-bold decoration-foreground"> GitHub
            </a>
            . <a href="https://github.com/aulonm/nav-faker" target="_blank"
              class="underline underline-offset-4 font-bold decoration-foreground">Nav-faker</a> is used to generate
            the norwegian numbers. <a href="https://tedeh.net/tools/generator-for-swedish-personnummer/"
              class="underline underline-offset-4 font-bold decoration-foreground" target="_blank">Tedeh</a> was an
            inspiration for the design and the logic for swedish numbers.
          </p>
        </div>
      </footer>
    </div>
  </Body>
</template>

<script lang="ts" setup>
import Toaster from '@/components/ui/toast/Toaster.vue'

useSeoMeta({
  title: "Generate National Identity Numbers",
  description: "Generate national identity numbers",
});
</script>
