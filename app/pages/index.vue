<template>
  <div class="flex flex-col items-center gap-2 mx-auto px-4">
    <section class="mx-auto flex text-balance max-w-4xl flex-col items-center gap-2 py-8 md:py-12 md:pb-8 pb-8">
      <h1
        class="text-center text-balance text-3xl font-bold leading-tight tracking-tighter mb-4 md:text-5xl lg:leading-[1.1]">
        Generate National Identity Numbers
      </h1>
      <span data-br="Giw6I" class="max-w-[750px] text-balance text-center text-lg font-light text-foreground">
        Generates a valid Norwgian "Fødselsnummer" or "D-nummer", or Swedish "Personnummer", a unique number assigned to
        every person born or moved
        to Norway/Sweden. They are all synthetic and are not possible to connect to a real person.
      </span>
    </section>

    <Tabs default-value="norway" class="w-full flex flex-col items-center gap-2 mx-auto px-4">
      <TabsList>
        <TabsTrigger value="norway">
          Norwegian
        </TabsTrigger>
        <TabsTrigger value="sweden">
          Swedish
        </TabsTrigger>
      </TabsList>
      <TabsContent value="norway" class="w-full">
        <NorwegianGenerator />
      </TabsContent>
      <TabsContent value="sweden" class="w-full">
        <SwedishGenerator />
      </TabsContent>
    </Tabs>
  </div>

</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NorwegianGenerator from '@/components/NorwegianGenerator.vue'
import SwedishGenerator from '@/components/SwedishGenerator.vue'

useHead({
  link: [
    { rel: 'icon', href: '/favicon.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ],
})

useSeoMeta({
  title: `Generate Norwegian National Identity Number`,
  description: `Here you can generate Norwegian national identity numbers`,
  ogTitle: `Generate Norwegian National Identity Number`,
  ogDescription: `Here you can generate Norwegian national identity numbers`,
})

</script>